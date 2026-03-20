import mongoose, { Document, Schema } from 'mongoose';

export interface IWithdrawal extends Document {
  userId: Schema.Types.ObjectId;
  approvedDate?: Date;
  status: 'pending' | 'paid' | 'cancelled';
  currency: string;
  amount: number;
  transactionId?: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const WithdrawalSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    approvedDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'cancelled'],
      default: 'pending',
    },
    currency: {
      type: String,
      required: [true, 'Currency type needed'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount of withdrawal required'],
    },
    transactionId: {
      type: Schema.Types.ObjectId,
      ref: 'Transaction',
    },
  },
  {
    timestamps: true,
  }
);

const Withdrawal = mongoose.models.Withdrawal || mongoose.model('Withdrawal', WithdrawalSchema);

export default Withdrawal;
