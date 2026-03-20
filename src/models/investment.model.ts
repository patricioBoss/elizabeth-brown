import mongoose, { Document, Schema } from 'mongoose';

export interface IInvestment extends Document {
  planId: number;
  userId: Schema.Types.ObjectId;
  capital: number;
  approvedDate?: Date;
  withDrawalDate?: string;
  status: 'pending' | 'active' | 'ended';
  daysCount: number;
  stock: string;
  type: string;
  currency: string;
  transactionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const InvestmentSchema = new Schema(
  {
    planId: {
      type: Number,
      required: [true, 'Plan is required'],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    capital: {
      type: Number,
      required: [true, 'Capital is required'],
    },
    approvedDate: {
      type: Date,
    },
    withDrawalDate: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'ended'],
      default: 'pending',
    },
    daysCount: {
      type: Number,
      default: 0,
    },
    stock: {
      type: String,
      required: [true, 'Stock symbol is required'],
    },
    type: {
      type: String,
      default: 'stocks',
    },
    currency: {
      type: String,
      required: [true, 'Currency type needed'],
    },
    transactionId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Investment = mongoose.models.Investment || mongoose.model('Investment', InvestmentSchema);

export default Investment;
