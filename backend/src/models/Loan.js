import mongoose from 'mongoose';

export const LoanStatus = {
  Pending: 'Pending',
  Approved: 'Approved',
  Rejected: 'Rejected',
  Disbursed: 'Disbursed',
  Closed: 'Closed',
};

const loanSchema = new mongoose.Schema(
  {
    borrowerId: { type: mongoose.Schema.Types.ObjectId, ref: 'BorrowerProfile', required: true },
    amount: { type: Number, required: true },
    tenure: { type: Number, required: true },
    status: { type: String, enum: Object.values(LoanStatus), default: LoanStatus.Pending },
    rejectionReason: { type: String },
    totalRepayment: { type: Number, required: true },
    amountPaid: { type: Number, default: 0 },
    appliedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Loan = mongoose.model('Loan', loanSchema);
