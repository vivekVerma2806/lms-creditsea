import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    loanId: { type: mongoose.Schema.Types.ObjectId, ref: 'Loan', required: true },
    utr: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Payment = mongoose.model('Payment', paymentSchema);
