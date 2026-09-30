import { Router } from 'express';
import { authenticate } from '../middlewares/auth.js';
import { BorrowerProfile, EmploymentMode } from '../models/BorrowerProfile.js';
import { Loan, LoanStatus } from '../models/Loan.js';
import { Payment } from '../models/Payment.js';
import multer from 'multer';
import path from 'path';

const router = Router();
router.use(authenticate);

// Fetch borrower profile and loans
router.get('/loans', async (req, res) => {
  try {
    const profile = await BorrowerProfile.findOne({ userId: req.user.id });
    if (!profile) {
      return res.json({ loans: [], profileExists: false });
    }
    const loans = await Loan.find({ borrowerId: profile._id }).sort({ createdAt: -1 });
    res.json({ loans, profileExists: true });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${req.user?.id}-${Date.now()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, JPG, and PNG are allowed'));
    }
  },
});

router.post('/profile', async (req, res) => {
  try {
    const { pan, dob, monthlySalary, employmentMode } = req.body;

    // BRE Checks
    const age = new Date().getFullYear() - new Date(dob).getFullYear();
    if (age < 23 || age > 50) return res.status(400).json({ message: 'BRE Rejected: Age not between 23 and 50' });
    if (monthlySalary < 25000) return res.status(400).json({ message: 'BRE Rejected: Salary below 25,000 / month' });
    if (employmentMode === EmploymentMode.Unemployed) return res.status(400).json({ message: 'BRE Rejected: Applicant is Unemployed' });
    
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test(pan)) return res.status(400).json({ message: 'BRE Rejected: Invalid PAN format' });

    let profile = await BorrowerProfile.findOne({ userId: req.user.id });
    if (profile) {
      profile.pan = pan;
      profile.dob = dob;
      profile.monthlySalary = monthlySalary;
      profile.employmentMode = employmentMode;
      await profile.save();
    } else {
      profile = await BorrowerProfile.create({ userId: req.user.id, pan, dob, monthlySalary, employmentMode });
    }

    res.json({ message: 'Profile updated successfully', profile });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.post('/upload-slip', upload.single('salarySlip'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const profile = await BorrowerProfile.findOne({ userId: req.user.id });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    profile.salarySlipUrl = `/uploads/${req.file.filename}`;
    await profile.save();

    res.json({ message: 'File uploaded successfully', url: profile.salarySlipUrl });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.post('/loan', async (req, res) => {
  try {
    const { amount, tenure } = req.body;

    if (amount < 50000 || amount > 500000) return res.status(400).json({ message: 'Amount must be between 50K and 5L' });
    if (tenure < 30 || tenure > 365) return res.status(400).json({ message: 'Tenure must be between 30 and 365 days' });

    const profile = await BorrowerProfile.findOne({ userId: req.user.id });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    const interestRate = 0.12; // 12%
    const simpleInterest = (amount * interestRate * tenure) / 365;
    const totalRepayment = amount + simpleInterest;

    const loan = await Loan.create({
      borrowerId: profile._id,
      amount,
      tenure,
      totalRepayment,
    });

    res.json({ message: 'Loan application submitted', loan });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// ── Self-Serve Borrower Repayment ─────────────────────────────────────────────
router.post('/repay', async (req, res) => {
  try {
    const { loanId, utr, amount } = req.body;

    if (!loanId || !utr || !amount || Number(amount) <= 0) {
      return res.status(400).json({ message: 'Valid loan ID, UTR number, and positive payment amount are required' });
    }

    const profile = await BorrowerProfile.findOne({ userId: req.user.id });
    if (!profile) return res.status(404).json({ message: 'Borrower profile not found' });

    const loan = await Loan.findOne({ _id: loanId, borrowerId: profile._id });
    if (!loan) return res.status(404).json({ message: 'Loan not found or does not belong to your account' });

    if (loan.status !== LoanStatus.Disbursed) {
      return res.status(400).json({ message: `Cannot submit payment for loan with status: ${loan.status}` });
    }

    const existingPayment = await Payment.findOne({ utr });
    if (existingPayment) {
      return res.status(400).json({ message: 'This UTR has already been recorded. Please check your transaction details.' });
    }

    const payAmt = Number(amount);
    const remainingDue = loan.totalRepayment - loan.amountPaid;
    if (payAmt > remainingDue) {
      return res.status(400).json({ message: `Payment amount (₹${payAmt}) cannot exceed remaining balance (₹${Math.round(remainingDue)})` });
    }

    const payment = await Payment.create({
      loanId: loan._id,
      utr,
      amount: payAmt,
      date: new Date(),
    });

    loan.amountPaid += payAmt;
    if (loan.amountPaid >= loan.totalRepayment) {
      loan.status = LoanStatus.Closed;
    }
    await loan.save();

    res.json({
      message: 'Repayment submitted successfully!',
      payment,
      loanStatus: loan.status,
      amountPaid: loan.amountPaid,
      remainingBalance: Math.max(0, loan.totalRepayment - loan.amountPaid),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ── Borrower Loan Payment History ─────────────────────────────────────────────
router.get('/loans/:id/payments', async (req, res) => {
  try {
    const profile = await BorrowerProfile.findOne({ userId: req.user.id });
    if (!profile) return res.status(404).json({ message: 'Borrower profile not found' });

    const loan = await Loan.findOne({ _id: req.params.id, borrowerId: profile._id });
    if (!loan) return res.status(404).json({ message: 'Loan not found' });

    const payments = await Payment.find({ loanId: loan._id }).sort({ date: -1 });
    res.json({ payments, loan });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
