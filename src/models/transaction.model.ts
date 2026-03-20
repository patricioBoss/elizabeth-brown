import mongoose from 'mongoose';

// @ts-ignore - Mongoose type instantiation issue
const TransactionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    amount: { type: Number },
    investmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Investment' },
    depositId: { type: mongoose.Schema.Types.ObjectId, ref: 'Deposit' },
    currentBalance: { type: Number },
    type: {
      type: String,
      enum: ['investment', 'daily', 'withdrawal', 'bonus', 'referral', 'fee'],
    },
  },
  { timestamps: true }
);

const Transaction =
  mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);

export default Transaction;
