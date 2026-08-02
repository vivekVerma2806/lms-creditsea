import mongoose from 'mongoose';

export const EmploymentMode = {
  Salaried: 'Salaried',
  SelfEmployed: 'Self-Employed',
  Unemployed: 'Unemployed',
};

const borrowerProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    pan: { type: String, required: true },
    dob: { type: Date, required: true },
    monthlySalary: { type: Number, required: true },
    employmentMode: { type: String, enum: Object.values(EmploymentMode), required: true },
    salarySlipUrl: { type: String },
  },
  { timestamps: true }
);

export const BorrowerProfile = mongoose.model('BorrowerProfile', borrowerProfileSchema);
