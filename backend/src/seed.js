import dns from 'dns';
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // Ignore fallback failure
}
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { connectDB } from './db.js';
import { User, Role } from './models/User.js';
import { BorrowerProfile, EmploymentMode } from './models/BorrowerProfile.js';
import { Loan, LoanStatus } from './models/Loan.js';
import { Payment } from './models/Payment.js';

dotenv.config();

const seed = async () => {
  await connectDB();
  console.log('Seeding institutional users and demo facilities...');

  // 1. Staff Users
  const staffHash = await bcrypt.hash('Admin@1234', 10);
  const staffUsers = [
    { name: 'Alice Admin',        email: 'admin@creditsea.com',        role: Role.Admin },
    { name: 'Sam Sales',          email: 'sales@creditsea.com',        role: Role.Sales },
    { name: 'Sara Sanction',      email: 'sanction@creditsea.com',     role: Role.Sanction },
    { name: 'Dave Disbursement',  email: 'disbursement@creditsea.com', role: Role.Disbursement },
    { name: 'Chris Collection',   email: 'collection@creditsea.com',   role: Role.Collection },
  ];

  for (const u of staffUsers) {
    const exists = await User.findOne({ email: u.email });
    if (!exists) {
      await User.create({ ...u, passwordHash: staffHash });
      console.log(`  + Created Staff: ${u.email} (Password: Admin@1234)`);
    } else {
      console.log(`  = Staff exists: ${u.email}`);
    }
  }

  // Fallback @lms.com users for backward compatibility
  const legacyHash = await bcrypt.hash('password123', 10);
  for (const role of Object.values(Role)) {
    const email = `${role.toLowerCase()}@lms.com`;
    const exists = await User.findOne({ email });
    if (!exists) {
      await User.create({ name: `${role} User`, email, passwordHash: legacyHash, role });
      console.log(`  + Created Legacy: ${email} (Password: password123)`);
    }
  }

  // 2. Borrowers with Profiles
  const borrowerHash = await bcrypt.hash('Borrower@1234', 10);
  const borrowers = [
    { name: 'Rahul Sharma',  email: 'rahul@gmail.com',   pan: 'ABCPS1234A', dob: '1990-04-12', salary: 55000, employment: EmploymentMode.Salaried },
    { name: 'Priya Mehta',   email: 'priya@gmail.com',   pan: 'EFGPM5678B', dob: '1988-09-23', salary: 72000, employment: EmploymentMode.Salaried },
    { name: 'Arjun Verma',   email: 'arjun@gmail.com',   pan: 'HIJAV9012C', dob: '1995-02-17', salary: 38000, employment: EmploymentMode.SelfEmployed },
    { name: 'Neha Gupta',    email: 'neha@gmail.com',    pan: 'KLMNG3456D', dob: '1992-11-05', salary: 48000, employment: EmploymentMode.Salaried },
  ];

  const createdProfiles = [];
  for (const b of borrowers) {
    let user = await User.findOne({ email: b.email });
    if (!user) {
      user = await User.create({ name: b.name, email: b.email, passwordHash: borrowerHash, role: Role.Borrower });
      console.log(`  + Created Borrower: ${b.email} (Password: Borrower@1234)`);
    }
    let profile = await BorrowerProfile.findOne({ userId: user._id });
    if (!profile) {
      profile = await BorrowerProfile.create({
        userId: user._id,
        pan: b.pan,
        dob: new Date(b.dob),
        monthlySalary: b.salary,
        employmentMode: b.employment,
      });
    }
    createdProfiles.push(profile);
  }

  // 3. Demo Loan Facilities
  if (createdProfiles.length > 0) {
    const loanTemplates = [
      { profileIdx: 0, amount: 150000, tenure: 12, status: LoanStatus.Disbursed, paidFraction: 0.5 },
      { profileIdx: 1, amount: 75000,  tenure: 9,  status: LoanStatus.Approved,  paidFraction: 0 },
      { profileIdx: 2, amount: 100000, tenure: 18, status: LoanStatus.Rejected,  paidFraction: 0 },
      { profileIdx: 3, amount: 80000,  tenure: 12, status: LoanStatus.Pending,   paidFraction: 0 },
    ];

    for (const t of loanTemplates) {
      const profile = createdProfiles[t.profileIdx];
      const existing = await Loan.findOne({ borrowerId: profile._id, amount: t.amount });
      if (!existing) {
        const totalRepayment = Math.round(t.amount * (1 + 0.12 * (t.tenure / 12)));
        const amountPaid = Math.round(totalRepayment * t.paidFraction);
        const loan = await Loan.create({
          borrowerId: profile._id,
          amount: t.amount,
          tenure: t.tenure,
          status: t.status,
          totalRepayment,
          amountPaid,
          appliedAt: new Date(),
          ...(t.status === LoanStatus.Rejected ? { rejectionReason: 'Documentation did not meet criteria.' } : {})
        });

        if (t.paidFraction > 0 && amountPaid > 0) {
          const utr = `UTR${Date.now()}LOCAL`;
          await Payment.create({ loanId: loan._id, utr, amount: amountPaid, date: new Date() });
        }
        console.log(`  + Created Demo Loan: Rs.${t.amount} (${t.status})`);
      }
    }
  }

  console.log('\nSeed completed successfully.');
  console.log('Login credentials available:');
  console.log('  Admin:        admin@creditsea.com        / Admin@1234');
  console.log('  Sanction:     sanction@creditsea.com     / Admin@1234');
  console.log('  Disbursement: disbursement@creditsea.com / Admin@1234');
  console.log('  Sales:        sales@creditsea.com        / Admin@1234');
  console.log('  Collection:   collection@creditsea.com   / Admin@1234');
  console.log('  Borrower:     rahul@gmail.com            / Borrower@1234');

  await mongoose.disconnect();
  process.exit(0);
};

seed();
