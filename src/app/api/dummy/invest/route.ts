import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/utils/dbConnect';
import Dummy from '@/models/dummy.model';
import { add } from 'date-fns';
import axios from 'axios';

function randomIntFromInterval(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// GET - Create dummy investment
export async function GET() {
  try {
    await dbConnect();

    const lastData = await Dummy.aggregate([
      { $match: { type: 'investment' } },
      { $sort: { approvedAt: -1 } },
      { $limit: 1 },
    ]).exec();

    const randomRes = await axios({
      baseURL: 'https://randomuser.me',
      method: 'GET',
      url: '/api/',
    });

    const coinArray = ['btc', 'eth', 'usdt'];
    const coin = coinArray[Math.floor(Math.random() * coinArray.length)];
    const amount = randomIntFromInterval(100000, 600000);
    const fakeUser = randomRes.data.results[0];
    const {
      name: { first: first_name, last: last_name },
    } = fakeUser;

    let newDate;
    if (lastData.length) {
      newDate = add(new Date(lastData[0].approvedAt), {
        days: Math.floor(Math.random() * 4) + 3,
      });
    } else {
      newDate = new Date(2023, 2, 10);
    }

    const data = {
      firstName: first_name,
      lastName: last_name,
      coin,
      amount,
      type: 'investment',
      approvedAt: newDate,
    };

    let invest = new Dummy(data);
    const result = await invest.save();

    return NextResponse.json({ message: 'success', data: result }, { status: 200 });
  } catch (error: any) {
    console.error('Dummy invest error:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
