import { Router } from 'express';
import { authenticate } from '../middlewares/auth.js';
import { authorize } from '../middlewares/rbac.js';
import { Role, User } from '../models/User.js';
import { Loan, LoanStatus } from '../models/Loan.js';
import { BorrowerProfile } from '../models/BorrowerProfile.js';
import { Payment } from '../models/Payment.js';

const router = Router();
router.use(authenticate);

// ── Overall Executive Statistics & KPIs ───────────────────────────────────────
router.get('/stats', authorize([Role.Admin, Role.Sales, Role.Sanction, Role.Disbursement, Role.Collection]), async (req, res) => {
  try {
    const [totalLeads, allLoans, allPayments] = await Promise.all([
      User.countDocuments({ role: Role.Borrower }),
      Loan.find().select('amount totalRepayment amountPaid status createdAt updatedAt borrowerId'),
      Payment.find().sort({ createdAt: -1 }).limit(10).populate({
        path: 'loanId',
        select: 'amount totalRepayment borrowerId',
        populate: { path: 'borrowerId', select: 'pan' }
      })
    ]);

    const stats = {
      totalLeads,
      totalLoans: allLoans.length,
      pending: { count: 0, amount: 0 },
      approved: { count: 0, amount: 0 },
      disbursed: { count: 0, amount: 0, totalRepayment: 0, amountPaid: 0, outstanding: 0 },
      closed: { count: 0, amount: 0, totalRepayment: 0 },
      rejected: { count: 0, amount: 0 },
      totalDisbursedCapital: 0,
      totalCollectedCapital: 0,
      totalOutstandingBalance: 0,
      recoveryRate: 0,
    };

    allLoans.forEach((l) => {
      if (l.status === LoanStatus.Pending) {
        stats.pending.count++;
        stats.pending.amount += l.amount || 0;
      } else if (l.status === LoanStatus.Approved) {
        stats.approved.count++;
        stats.approved.amount += l.amount || 0;
      } else if (l.status === LoanStatus.Disbursed) {
        stats.disbursed.count++;
        stats.disbursed.amount += l.amount || 0;
        stats.disbursed.totalRepayment += l.totalRepayment || 0;
        stats.disbursed.amountPaid += l.amountPaid || 0;
        stats.disbursed.outstanding += Math.max(0, (l.totalRepayment || 0) - (l.amountPaid || 0));
        stats.totalDisbursedCapital += l.amount || 0;
        stats.totalCollectedCapital += l.amountPaid || 0;
        stats.totalOutstandingBalance += Math.max(0, (l.totalRepayment || 0) - (l.amountPaid || 0));
      } else if (l.status === LoanStatus.Closed) {
        stats.closed.count++;
        stats.closed.amount += l.amount || 0;
        stats.closed.totalRepayment += l.totalRepayment || 0;
        stats.totalDisbursedCapital += l.amount || 0;
        stats.totalCollectedCapital += l.amountPaid || l.totalRepayment || 0;
      } else if (l.status === LoanStatus.Rejected) {
        stats.rejected.count++;
        stats.rejected.amount += l.amount || 0;
      }
    });

    const totalEligibleRepayment = stats.totalCollectedCapital + stats.totalOutstandingBalance;
    stats.recoveryRate = totalEligibleRepayment > 0 
      ? Math.round((stats.totalCollectedCapital / totalEligibleRepayment) * 100) 
      : 100;

    res.json({ stats, recentPayments: allPayments });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ── Sales: Pre-application stage (Enriched leads) ──────────────────────────────
router.get('/sales/leads', authorize([Role.Admin, Role.Sales]), async (req, res) => {
  try {
    const borrowers = await User.find({ role: Role.Borrower })
      .select('-passwordHash')
      .sort({ createdAt: -1 });

    const borrowerIds = borrowers.map(b => b._id);
    const profiles = await BorrowerProfile.find({ userId: { $in: borrowerIds } });
    const profileMap = new Map();
    profiles.forEach(p => profileMap.set(p.userId.toString(), p));

    const profileIds = profiles.map(p => p._id);
    const loans = await Loan.find({ borrowerId: { $in: profileIds } }).sort({ createdAt: -1 });
    const loanMap = new Map();
    loans.forEach(l => {
      const pid = l.borrowerId.toString();
      if (!loanMap.has(pid)) loanMap.set(pid, l);
    });

    const enrichedLeads = borrowers.map(b => {
      const profile = profileMap.get(b._id.toString()) || null;
      const latestLoan = profile ? loanMap.get(profile._id.toString()) : null;
      return {
        _id: b._id,
        name: b.name,
        email: b.email,
        createdAt: b.createdAt,
        profile: profile ? {
          _id: profile._id,
          pan: profile.pan,
          monthlySalary: profile.monthlySalary,
          employmentMode: profile.employmentMode,
          salarySlipUrl: profile.salarySlipUrl,
          dob: profile.dob,
        } : null,
        latestLoan: latestLoan ? {
          _id: latestLoan._id,
          amount: latestLoan.amount,
          tenure: latestLoan.tenure,
          status: latestLoan.status,
          createdAt: latestLoan.createdAt,
        } : null,
      };
    });

    res.json({ leads: enrichedLeads });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ── Sanction: Review and approve/reject ─────────────────────────────────────────
router.get('/sanction/loans', authorize([Role.Admin, Role.Sanction]), async (req, res) => {
  try {
    const loans = await Loan.find({ status: LoanStatus.Pending })
      .populate({
        path: 'borrowerId',
        populate: { path: 'userId', select: 'name email createdAt' }
      })
      .sort({ createdAt: -1 });
    res.json({ loans });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.patch('/sanction/loans/:id', authorize([Role.Admin, Role.Sanction]), async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;
    if (status !== LoanStatus.Approved && status !== LoanStatus.Rejected) {
      return res.status(400).json({ message: 'Invalid status update. Must be Approved or Rejected' });
    }

    const loan = await Loan.findById(req.params.id);
    if (!loan) return res.status(404).json({ message: 'Loan not found' });
    if (loan.status !== LoanStatus.Pending) return res.status(400).json({ message: 'Loan is not in pending state' });

    loan.status = status;
    if (status === LoanStatus.Rejected) {
      loan.rejectionReason = rejectionReason || 'Failed credit underwriting criteria.';
    }
    await loan.save();
    res.json({ message: `Loan ${status.toLowerCase()}`, loan });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ── Disbursement: Disburse approved loans ─────────────────────────────────────
router.get('/disbursement/loans', authorize([Role.Admin, Role.Disbursement]), async (req, res) => {
  try {
    const loans = await Loan.find({ status: LoanStatus.Approved })
      .populate({
        path: 'borrowerId',
        populate: { path: 'userId', select: 'name email createdAt' }
      })
      .sort({ updatedAt: -1 });
    res.json({ loans });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.patch('/disbursement/loans/:id', authorize([Role.Admin, Role.Disbursement]), async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id);
    if (!loan) return res.status(404).json({ message: 'Loan not found' });
    if (loan.status !== LoanStatus.Approved) return res.status(400).json({ message: 'Loan is not approved yet' });

    loan.status = LoanStatus.Disbursed;
    await loan.save();
    res.json({ message: 'Loan disbursed successfully', loan });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ── Collection: Track active disbursed loans ──────────────────────────────────
router.get('/collection/loans', authorize([Role.Admin, Role.Collection]), async (req, res) => {
  try {
    const loans = await Loan.find({ status: LoanStatus.Disbursed })
      .populate({
        path: 'borrowerId',
        populate: { path: 'userId', select: 'name email createdAt' }
      })
      .sort({ updatedAt: -1 });
    res.json({ loans });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ── Loan Payment Ledger (History) ─────────────────────────────────────────────
router.get('/loans/:id/payments', authorize([Role.Admin, Role.Collection, Role.Sanction, Role.Disbursement]), async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id).populate({
      path: 'borrowerId',
      populate: { path: 'userId', select: 'name email' }
    });
    if (!loan) return res.status(404).json({ message: 'Loan not found' });

    const payments = await Payment.find({ loanId: req.params.id }).sort({ date: -1 });
    const remainingBalance = Math.max(0, loan.totalRepayment - loan.amountPaid);

    res.json({ loan, payments, remainingBalance });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ── Record Manual Payment Receipt ─────────────────────────────────────────────
router.post('/collection/payments', authorize([Role.Admin, Role.Collection]), async (req, res) => {
  try {
    const { loanId, utr, amount, date } = req.body;
    
    if (!utr || !amount || Number(amount) <= 0) {
      return res.status(400).json({ message: 'Valid UTR and positive payment amount are required' });
    }

    const existingPayment = await Payment.findOne({ utr });
    if (existingPayment) return res.status(400).json({ message: 'UTR must be unique. This transaction is already recorded.' });

    const loan = await Loan.findById(loanId);
    if (!loan) return res.status(404).json({ message: 'Loan not found' });
    if (loan.status !== LoanStatus.Disbursed) return res.status(400).json({ message: 'Loan is not in active disbursed state' });

    const remainingDue = loan.totalRepayment - loan.amountPaid;
    const paymentAmount = Number(amount);

    const payment = await Payment.create({ 
      loanId, 
      utr, 
      amount: paymentAmount, 
      date: date ? new Date(date) : new Date() 
    });

    loan.amountPaid += paymentAmount;
    if (loan.amountPaid >= loan.totalRepayment) {
      loan.status = LoanStatus.Closed;
    }
    await loan.save();

    res.json({ 
      message: 'Payment recorded successfully', 
      payment, 
      loanStatus: loan.status,
      amountPaid: loan.amountPaid,
      remainingBalance: Math.max(0, loan.totalRepayment - loan.amountPaid)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
