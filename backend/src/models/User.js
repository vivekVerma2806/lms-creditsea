import mongoose from 'mongoose';

export const Role = {
  Admin: 'Admin',
  Sales: 'Sales',
  Sanction: 'Sanction',
  Disbursement: 'Disbursement',
  Collection: 'Collection',
  Borrower: 'Borrower',
};

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: Object.values(Role), default: Role.Borrower },
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);
