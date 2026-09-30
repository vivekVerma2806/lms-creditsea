/**
 * seed_production.js
 * Seeds MongoDB Atlas with admin credentials and dummy loan data.
 * Configures Node's DNS servers to Google/Cloudflare (8.8.8.8, 1.1.1.1)
 * to resolve SRV records properly on any network.
 */
import dns from 'dns';
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  console.warn('DNS server override warning:', e.message);
}
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('Error: MONGO_URI environment variable is required.');
  console.error('Usage: $env:MONGO_URI="your-uri"; node src/seed_production.js');
  process.exit(1);
}

console.log('Connecting to MongoDB Atlas...');
await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 30000 });
console.log('Connected to MongoDB Atlas successfully!\n');

// ── Inline models & enums ──────────────────────────────────────────────────────
const Role = { Admin: 'Admin', Sales: 'Sales', Sanction: 'Sanction', Disbursement: 'Disbursement', Collection: 'Collection', Borrower: 'Borrower' };
const LoanStatus = { Pending: 'Pending', Approved: 'Approved', Rejected: 'Rejected', Disbursed: 'Disbursed', Closed: 'Closed' };
const EmploymentMode = { Salaried: 'Salaried', SelfEmployed: 'Self-Employed', Unemployed: 'Unemployed' };

const User = mongoose.model('User', new mongoose.Schema({ name: String, email: { type: String, unique: true }, passwordHash: String, role: String }, { timestamps: true }));
const BorrowerProfile = mongoose.model('BorrowerProfile', new mongoose.Schema({ userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true }, pan: String, dob: Date, monthlySalary: Number, employmentMode: String, salarySlipUrl: String }, { timestamps: true }));
const Loan = mongoose.model('Loan', new mongoose.Schema({ borrowerId: { type: mongoose.Schema.Types.ObjectId, ref: 'BorrowerProfile' }, amount: Number, tenure: Number, status: String, rejectionReason: String, totalRepayment: Number, amountPaid: { type: Number, default: 0 }, appliedAt: Date }, { timestamps: true }));
const Payment = mongoose.model('Payment', new mongoose.Schema({ loanId: { type: mongoose.Schema.Types.ObjectId, ref: 'Loan' }, utr: { type: String, unique: true }, amount: Number, date: Date }, { timestamps: true }));

// ── 1. Staff Users ─────────────────────────────────────────────────────────────

const staffUsers = [
  { name: 'Alice Admin',        email: 'admin@creditsea.com',        role: Role.Admin },
  { name: 'Sam Sales',          email: 'sales@creditsea.com',        role: Role.Sales },
  { name: 'Sara Sanction',      email: 'sanction@creditsea.com',     role: Role.Sanction },
  { name: 'Dave Disbursement',  email: 'disbursement@creditsea.com', role: Role.Disbursement },
  { name: 'Chris Collection',   email: 'collection@creditsea.com',   role: Role.Collection },
];

const staffHash = await bcrypt.hash('Admin@1234', 10);
for (const u of staffUsers) {
  const exists = await User.findOne({ email: u.email });
  if (!exists) { await User.create({ ...u, passwordHash: staffHash }); console.log(`  + ${u.role}: ${u.email}`); }
  else { console.log(`  = exists: ${u.email}`); }
}

// ── 2. Borrowers + Profiles ────────────────────────────────────────────────────

const borrowers = [
  { name: 'Rahul Sharma',  email: 'rahul@gmail.com',   pan: 'ABCPS1234A', dob: '1990-04-12', salary: 55000, employment: EmploymentMode.Salaried },
  { name: 'Priya Mehta',   email: 'priya@gmail.com',   pan: 'EFGPM5678B', dob: '1988-09-23', salary: 72000, employment: EmploymentMode.Salaried },
  { name: 'Arjun Verma',   email: 'arjun@gmail.com',   pan: 'HIJAV9012C', dob: '1995-02-17', salary: 38000, employment: EmploymentMode.SelfEmployed },
  { name: 'Neha Gupta',    email: 'neha@gmail.com',    pan: 'KLMNG3456D', dob: '1992-11-05', salary: 48000, employment: EmploymentMode.Salaried },
  { name: 'Vikram Singh',  email: 'vikram@gmail.com',  pan: 'NOPVS7890E', dob: '1986-07-30', salary: 91000, employment: EmploymentMode.Salaried },
  { name: 'Sunita Patel',  email: 'sunita@gmail.com',  pan: 'QRSSP1122F', dob: '1998-03-14', salary: 32000, employment: EmploymentMode.SelfEmployed },
  { name: 'Amit Kumar',    email: 'amit@gmail.com',    pan: 'TUVAK3344G', dob: '1991-06-08', salary: 60000, employment: EmploymentMode.Salaried },
  { name: 'Deepika Nair',  email: 'deepika@gmail.com', pan: 'WXYZN5566H', dob: '1993-01-25', salary: 44000, employment: EmploymentMode.Salaried },
  { name: 'Rohit Joshi',   email: 'rohit@gmail.com',   pan: 'ABCRJ7788I', dob: '1987-08-19', salary: 85000, employment: EmploymentMode.Salaried },
  { name: 'Kavya Reddy',   email: 'kavya@gmail.com',   pan: 'DEFKR9900J', dob: '1996-12-31', salary: 29000, employment: EmploymentMode.Unemployed },
];

const borrowerHash = await bcrypt.hash('Borrower@1234', 10);
const createdProfiles = [];

for (const b of borrowers) {
  let user = await User.findOne({ email: b.email });
  if (!user) { user = await User.create({ name: b.name, email: b.email, passwordHash: borrowerHash, role: Role.Borrower }); console.log(`  + Borrower: ${b.email}`); }
  else { console.log(`  = exists: ${b.email}`); }
  let profile = await BorrowerProfile.findOne({ userId: user._id });
  if (!profile) { profile = await BorrowerProfile.create({ userId: user._id, pan: b.pan, dob: new Date(b.dob), monthlySalary: b.salary, employmentMode: b.employment }); }
  createdProfiles.push(profile);
}

// ── 3. Loans + Payments ────────────────────────────────────────────────────────

// [profileIdx, amount, tenure(months), status, paidFraction]
const loanTemplates = [
  [0, 150000, 12, LoanStatus.Disbursed, 0.5 ],
  [0,  50000,  6, LoanStatus.Closed,    1.0 ],
  [1, 200000, 24, LoanStatus.Disbursed, 0.25],
  [1,  75000,  9, LoanStatus.Approved,  0   ],
  [2, 100000, 18, LoanStatus.Rejected,  0   ],
  [3,  80000, 12, LoanStatus.Pending,   0   ],
  [4, 300000, 36, LoanStatus.Disbursed, 0.75],
  [5,  40000,  6, LoanStatus.Pending,   0   ],
  [6, 120000, 18, LoanStatus.Approved,  0   ],
  [7,  60000,  9, LoanStatus.Disbursed, 0.33],
  [8, 250000, 30, LoanStatus.Closed,    1.0 ],
  [9,  25000,  3, LoanStatus.Rejected,  0   ],
  [0,  90000, 12, LoanStatus.Pending,   0   ],
  [2,  70000,  6, LoanStatus.Disbursed, 0.6 ],
  [3, 180000, 24, LoanStatus.Approved,  0   ],
  [5,  55000,  9, LoanStatus.Disbursed, 0.1 ],
  [6,  95000, 12, LoanStatus.Closed,    1.0 ],
  [7, 200000, 18, LoanStatus.Pending,   0   ],
  [8, 130000, 15, LoanStatus.Disbursed, 0.4 ],
  [9,  35000,  6, LoanStatus.Approved,  0   ],
];

for (const [pi, amount, tenure, status, paidFraction] of loanTemplates) {
  const profile = createdProfiles[pi];
  const totalRepayment = Math.round(amount * (1 + 0.12 * (tenure / 12)));
  const amountPaid = Math.round(totalRepayment * paidFraction);
  const appliedAt = new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000);

  const existingLoan = await Loan.findOne({ borrowerId: profile._id, amount, tenure });
  if (existingLoan) { console.log(`  = Loan exists: Rs.${amount} (${status})`); continue; }

  const loan = await Loan.create({
    borrowerId: profile._id, amount, tenure, status, totalRepayment, amountPaid, appliedAt,
    ...(status === LoanStatus.Rejected ? { rejectionReason: 'Insufficient credit score or documentation.' } : {}),
  });

  if (paidFraction > 0 && amountPaid > 0) {
    const numPayments = Math.max(1, Math.round(tenure * paidFraction));
    const paymentAmt = Math.round(amountPaid / numPayments);
    for (let i = 0; i < numPayments; i++) {
      const utr = `UTR${Date.now()}X${i}${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
      const payDate = new Date(appliedAt.getTime() + (i + 1) * 30 * 24 * 60 * 60 * 1000);
      await Payment.create({ loanId: loan._id, utr, amount: paymentAmt, date: payDate });
    }
    console.log(`  + Loan Rs.${amount} (${status}) + ${numPayments} payment(s)`);
  } else {
    console.log(`  + Loan Rs.${amount} (${status})`);
  }
}

// ── Summary ────────────────────────────────────────────────────────────────────

const stats = {
  users:    await User.countDocuments(),
  profiles: await BorrowerProfile.countDocuments(),
  loans:    await Loan.countDocuments(),
  payments: await Payment.countDocuments(),
};

console.log('\n============= SEED COMPLETE =============');
console.log(`Users: ${stats.users} | Profiles: ${stats.profiles} | Loans: ${stats.loans} | Payments: ${stats.payments}`);
console.log('\nStaff login (password: Admin@1234):');
staffUsers.forEach(u => console.log(`  ${u.role.padEnd(14)} -> ${u.email}`));
console.log('\nBorrower login (password: Borrower@1234):');
borrowers.slice(0, 5).forEach(b => console.log(`  ${b.email}`));
console.log('  ... (all 10 borrowers use Borrower@1234)\n');

await mongoose.disconnect();
process.exit(0);
