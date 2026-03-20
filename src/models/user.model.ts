import mongoose from 'mongoose';

// @ts-ignore - Mongoose type instantiation issue
const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: [true, 'First name is required'],
    },
    lastName: {
      type: String,
      trim: true,
      required: [true, 'Last name is required'],
    },
    phone: String,
    city: String,
    email: {
      type: String,
      trim: true,
      unique: true,
      match: [/.+\@.+\..+/, 'Please fill a valid email address'],
      required: [true, 'Email is required'],
    },
    postalCode: Number,
    permanentAddress: String,
    country: {
      type: String,
      trim: true,
      required: [true, 'Country is required'],
    },
    state: {
      type: String,
      trim: true,
      required: [true, 'State is required'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    level: {
      type: Number,
      default: 0,
    },
    role: {
      type: String,
      enum: ['Admin', 'User'],
      default: 'User',
    },
    IdImg: String,
    accountBalance: {
      type: Number,
      default: 0,
    },
    bonus: {
      type: Number,
      default: 0,
    },
    imageUrl: {
      type: String,
      default: '/img/default.png',
    },
    wallets: {
      usdt: String,
      btc: String,
      eth: String,
    },
    TwoFA: {
      type: Boolean,
      default: false,
    },
    referer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    withdrawalVested: Date,
  },
  {
    timestamps: true,
  }
);

const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;
