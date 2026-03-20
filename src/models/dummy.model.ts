import mongoose from 'mongoose';

// @ts-ignore - Mongoose type instantiation issue
const DummySchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: true,
    },
    lastName: {
      type: String,
      trim: true,
      required: true,
    },
    amount: {
      type: Number,
    },
    coin: {
      type: String,
    },
    approvedAt: {
      type: Date,
    },
    type: {
      type: String,
      enum: ['investment', 'withdrawal'],
    },
  },
  {
    timestamps: true,
  }
);

// @ts-ignore - Mongoose type instantiation issue
const Dummy = mongoose.models.Dummy || mongoose.model('Dummy', DummySchema);

export default Dummy;
