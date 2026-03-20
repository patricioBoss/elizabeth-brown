import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/session';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Dashboard',
};

// ----------------------------------------------------------------------

// Force dynamic rendering since this page uses cookies/session
export const dynamic = 'force-dynamic';
import mongoose from 'mongoose';
import dbConnect from '@/utils/dbConnect';
import Withdrawal from '@/models/withdrawal.model';
import Transaction from '@/models/transaction.model';
import stocks from '@/helpers/stocks';
import fs from 'fs/promises';
import path from 'path';
import axios from 'axios';
// Client component
import DashboardHomeClient from './DashboardHomeClient';

// ----------------------------------------------------------------------

// Server-side data fetching (like original handler)
async function getDashboardData(userId: string) {
  try {
    await dbConnect();

    // Calculate total earnings
    const totalEarnings = await Transaction.aggregate([
      {
        $match: {
          $and: [
            { userId: new mongoose.Types.ObjectId(userId) },
            {
              $or: [{ type: 'daily' }, { type: 'bonus' }, { type: 'referral' }],
            },
          ],
        },
      },
      { $group: { _id: '$userId', totalEarnings: { $sum: '$amount' } } },
    ]);

    // Calculate total investment
    const allApprovedInvestment = await Transaction.aggregate([
      {
        $match: {
          $and: [{ userId: new mongoose.Types.ObjectId(userId) }, { type: 'investment' }],
        },
      },
      { $group: { _id: '$userId', totalInvestment: { $sum: '$amount' } } },
    ]);

    // Calculate total withdrawal
    const totalWithdrawal = await Withdrawal.aggregate([
      {
        $match: {
          $and: [
            { userId: new mongoose.Types.ObjectId(userId) },
            { approvedDate: { $exists: true } },
          ],
        },
      },
      { $group: { _id: '$userId', totalWithdrawal: { $sum: '$amount' } } },
    ]);

    // Get withdrawal list
    const withdrawalList = await Withdrawal.find({ userId })
      .select('-__v')
      .lean();

    // Fetch stocks data
    const filePath = path.join(process.cwd(), 'public', 'dashboardData.json');
        const stocksListString = Object.keys(stocks).join(",");
        console.log('Fetching stocks data for:', stocksListString);
    let stocksDataList = [];
    try {
      const stocksResponse = await axios({
        baseURL: process.env.NEXT_PUBLIC_IMAGE_SERVER,
        method: 'GET',
        url: '/yahooapi/quotes',
      });

      const stocksDataArray = stocksResponse.data.data;
      const jsonFile = await fs.readFile(filePath, 'utf-8');
      const parsedData = JSON.parse(jsonFile);
      
      stocksDataList = stocksDataArray.map((stock: any, idx: number) => ({
        ...stock,
        ...parsedData.list[idx].data.result[0].meta,
      }));
    } catch (error) {
      console.error('Error fetching stocks data:', error);
    }

    return {
      stocksData: stocksDataList,
      withdrawalList,
      totalWithdrawal: totalWithdrawal.length ? totalWithdrawal[0].totalWithdrawal : 0,
      totalEarnings: totalEarnings.length ? totalEarnings[0].totalEarnings : 0,
      totalInvestment: allApprovedInvestment.length ? allApprovedInvestment[0].totalInvestment : 0,
    };
  } catch (err) {
    console.error('Dashboard data error:', err);
    return {
      stocksData: [],
      withdrawalList: [],
      totalWithdrawal: 0,
      totalEarnings: 0,
      totalInvestment: 0,
    };
  }
}

// ----------------------------------------------------------------------

export default async function DashboardHomePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch dashboard data
  const dashboardData = await getDashboardData(user._id);

  // Serialize to plain objects before passing to Client Component
  // (Mongoose ObjectIds have toJSON methods which are not allowed)
  const plainUser = JSON.parse(JSON.stringify(user));
  const plainData = JSON.parse(JSON.stringify(dashboardData));

  return <DashboardHomeClient user={plainUser} {...plainData} />;
}
