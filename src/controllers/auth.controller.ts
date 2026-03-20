import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';
import User from '../models/user.model';
import response from '../apiUtil/responses';
import sendMail from '../helpers/sendMail';
import resetPasswordMailTemplate from '../helpers/resetPasswordMailTemplate';
import { jwtSign } from '../apiUtil/jwt';

const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_at_least_32_characters';

interface AuthRequest extends NextApiRequest {
  session: any;
  profile?: any;
}

export const login = async (req: AuthRequest, res: NextApiResponse) => {
  try {
    const { email, password } = req.body;
    
    // Validate all the fields
    if (!email || !password) {
      return res.status(400).json({
        type: 'failure',
        message: 'Invalid email or password',
      });
    }

    const fetchedUser = await User.findOne({ email }).lean();
    
    // Verify email
    if (!fetchedUser) {
      return res.status(404).json({
        type: 'failure',
        message: 'Credentials does not exist!',
      });
    } else {
      // Check if password match
      const isPasswordMatch = await bcrypt.compare(password, fetchedUser.password);
      if (!isPasswordMatch) {
        return response(res, 401, 'Invalid Credentials!');
      }

      const { password: _, ...user } = fetchedUser;
      
      // Setting session when user is verified
      req.session.user = user;
      await req.session.save();

      return response(res, 200, 'User retrieved successfully', user);
    }
  } catch (err: any) {
    console.log(err);
    return response(res, 500, 'Server error', err.message);
  }
};

export const reset = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { email } = req.body;
    
    // Validate all the fields
    if (!email) {
      return res.status(400).json({
        type: 'failure',
        message: 'Invalid email or password',
      });
    }
    
    const fetchedUser = await User.findOne({ email }).lean();
    
    // Verify email
    if (!fetchedUser) {
      return res.status(404).json({
        type: 'failure',
        message: 'No Account Found',
      });
    }
    
    // Create verification token
    const token = await jwtSign({ user: fetchedUser._id }, JWT_SECRET, {
      expiresIn: 60 * 60 * 24,
    });
    
    const hostname = req.headers.host;
    const verificationLink = `http://${hostname}/reset/${token}`;
    const msg = resetPasswordMailTemplate(fetchedUser.firstName, verificationLink);
    const subject = 'Ethervest Reset';
    
    const sent = await sendMail(msg, subject, fetchedUser.email);
    if (sent) {
      return response(res, 200, 'Check Email for reset Link');
    }
    return response(res, 400, 'Error sending mail');
  } catch (err: any) {
    console.log(err);
    return response(res, 500, 'Server error', err.message);
  }
};

export const updatePassword = async (req: AuthRequest, res: NextApiResponse) => {
  const _id = req.profile?._id;
  try {
    const { password } = req.body;
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    await User.findByIdAndUpdate(_id, {
      password: hash,
    }).lean();
    return response(res, 200, 'Password Reset Successful');
  } catch (err: any) {
    console.log(err);
    return response(res, 500, 'Server error', err.message);
  }
};

export const logout = async (req: AuthRequest, res: NextApiResponse) => {
  if (req.session.user) {
    await req.session.destroy();
    return response(res, 200, 'Logged out', null);
  } else {
    return response(res, 400, 'No user to log out', null);
  }
};
