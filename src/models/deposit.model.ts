import mongoose, { Document, Schema } from 'mongoose';

export interface IDeposit extends Document {
  userId: Schema.Types.ObjectId;
  amount: number;
  approvedDate?: Date;
  reason: string;
  status: 'pending' | 'approved';
  coin: string;
  transactionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const DepositSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
    },
    approvedDate: {
      type: Date,
    },
    reason: {
      type: String,
      required: [true, 'Procedure is needed'],
    },
    status: {
      type: String,
      enum: ['pending', 'approved'],
      default: 'pending',
    },
    coin: {
      type: String,
      required: [true, 'Coin symbol is needed'],
    },
    transactionId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Deposit = mongoose.models.Deposit || mongoose.model('Deposit', DepositSchema);

export default Deposit;
