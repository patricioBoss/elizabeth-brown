import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import User from '../models/user.model';
import response from '../apiUtil/responses';
import { jwtSign } from '../apiUtil/jwt';
import sendMail from '../helpers/sendMail';
import welcomeMail from '../helpers/welcomeMail';
import Transaction from '../models/transaction.model';
import Investment from '../models/investment.model';
import Withdrawal from '../models/withdrawal.model';

const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_at_least_32_characters';
const DOMAIN = process.env.NEXT_PUBLIC_SITE_URL || 'localhost:8084';

interface AuthRequest extends NextApiRequest {
  session?: any;
  user?: any;
}

export const getUsers = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const allUsers = await User.find({});
    return response(res, 200, 'Fetched users successfully', allUsers);
  } catch (err: any) {
    return res.status(500).json({
      type: 'failure',
      message: 'Server Error!',
    });
  }
};

export const createUser = async (req: NextApiRequest, res: NextApiResponse) => {
  const userData = req.body;
  
  // Check if user email exists
  const fetchedUser = await User.findOne({ email: userData.email });
  if (fetchedUser) {
    return response(res, 400, 'User with email Already Exist!');
  }
  
  // Delete confirm password
  delete userData.confirmPassword;
  
  try {
    const hash = await bcrypt.hash(userData.password, SALT_ROUNDS);
    userData.password = hash;
    
    // Save user
    const user = new User(userData);
    const savedUser = await user.save();
    
    // Create verification token
    const token = await jwtSign({ user: savedUser._id }, JWT_SECRET, {
      expiresIn: '30 days',
    });
    
    const loginLink = `https://${DOMAIN}/login`;
    const msg = welcomeMail(userData.firstName, loginLink);

    const sent = await sendMail(
      msg,
      'Welcome to Elizabeth Brown Wealth Management',
      userData.email
    );
    
    console.log(sent);
    
    return res.status(200).json({
      type: 'success',
      message: 'Successfully signed up!',
    });
  } catch (err: any) {
    console.log('Error from register:', err);
    return res.status(500).json({
      type: 'failure',
      message: err.message,
    });
  }
};

export const getUserById = async (req: NextApiRequest, res: NextApiResponse) => {
  const { userId } = req.query;
  try {
    const user = await User.findById(userId)
      .select(['-password', '-createdAt', '-updatedAt'])
      .lean();
    
    if (!user) {
      return response(res, 404, 'User not found', null);
    } else {
      return response(res, 200, 'User retrieved successfully', user);
    }
  } catch (err: any) {
    return response(res, 500, 'Server error', err.message);
  }
};

export const updateUser = async (req: AuthRequest, res: NextApiResponse) => {
  const { userId } = req.query;
  try {
    let fetchedUser = await User.findOne({ _id: userId });

    if (!fetchedUser) {
      return res.status(404).json({
        type: 'failure',
        message: 'User not found',
      });
    }

    // Update user fields
    const updateData: any = {};
    if (req.body.firstName) updateData.firstName = req.body.firstName;
    if (req.body.lastName) updateData.lastName = req.body.lastName;
    if (req.body.phone) updateData.phone = req.body.phone;
    if (req.body.city) updateData.city = req.body.city;
    if (req.body.permanentAddress) updateData.permanentAddress = req.body.permanentAddress;
    if (req.body.country) updateData.country = req.body.country;
    if (req.body.state) updateData.state = req.body.state;
    if (req.body.postalCode) updateData.postalCode = req.body.postalCode;

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    }).lean();

    const { password, ...user } = updatedUser;
    return response(res, 200, 'User updated successfully', user);
  } catch (err: any) {
    return res.status(500).json({
      type: 'failure',
      message: err.message,
    });
  }
};

export const updateUserWallet = async (req: AuthRequest, res: NextApiResponse) => {
  const { userId } = req.query;
  const { usdt, btc, eth } = req.body;
  
  try {
    const updateData: any = {};
    if (usdt !== undefined) updateData['wallets.usdt'] = usdt;
    if (btc !== undefined) updateData['wallets.btc'] = btc;
    if (eth !== undefined) updateData['wallets.eth'] = eth;

    const updatedUser = await User.findByIdAndUpdate(userId, {
      $set: updateData,
    }, {
      new: true,
    }).lean();

    const { password, ...user } = updatedUser;
    return response(res, 200, 'Wallet updated successfully', user);
  } catch (err: any) {
    return res.status(500).json({
      type: 'failure',
      message: err.message,
    });
  }
};

export const changePassword = async (req: AuthRequest, res: NextApiResponse) => {
  const { userId } = req.query;
  const { currentPassword, newPassword } = req.body;
  
  try {
    const user = await User.findById(userId);
    
    if (!user) {
      return response(res, 404, 'User not found', null);
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return response(res, 401, 'Current password is incorrect');
    }

    // Hash new password
    const hash = await bcrypt.hash(newPassword, SALT_ROUNDS);
    user.password = hash;
    await user.save();

    return response(res, 200, 'Password changed successfully');
  } catch (err: any) {
    return res.status(500).json({
      type: 'failure',
      message: err.message,
    });
  }
};

export const resetPasswordWithToken = async (req: NextApiRequest, res: NextApiResponse) => {
  const { token } = req.query;
  const { password } = req.body;
  
  try {
    const decoded: any = await jwtSign(token, JWT_SECRET);
    const userId = decoded.user;
    
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    await User.findByIdAndUpdate(userId, { password: hash });
    
    return response(res, 200, 'Password reset successful');
  } catch (err: any) {
    return res.status(400).json({
      type: 'failure',
      message: 'Invalid or expired token',
    });
  }
};

export const deleteUser = async (req: NextApiRequest, res: NextApiResponse) => {
  const { userId } = req.query;
  try {
    await User.findByIdAndDelete(userId);
    return response(res, 200, 'User deleted successfully');
  } catch (err: any) {
    return res.status(500).json({
      type: 'failure',
      message: err.message,
    });
  }
};
