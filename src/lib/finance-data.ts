// Finance Portal Data Types and Mock Data

export interface FinanceStats {
  totalApplications: number;
  pendingReview: number;
  approvedThisMonth: number;
  rejectedThisMonth: number;
  totalDisbursed: number;
  budgetRemaining: number;
  avgProcessingDays: number;
}

export interface FinancialApplication {
  id: string;
  patientId: string;
  patientName: string;
  applicationDate: string;
  requestedAmount: number;
  approvedAmount?: number;
  status: 'pending' | 'under-review' | 'approved' | 'rejected' | 'disbursed';
  category: 'transport' | 'medication' | 'treatment' | 'emergency' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  documents: string[];
  notes: string;
  reviewedBy?: string;
  reviewDate?: string;
  disbursementDate?: string;
}

export interface Disbursement {
  id: string;
  applicationId: string;
  patientId: string;
  patientName: string;
  amount: number;
  category: string;
  disbursementDate: string;
  method: 'bank-transfer' | 'cash' | 'cheque' | 'upi';
  status: 'pending' | 'processed' | 'completed' | 'failed';
  reference: string;
}

export interface BudgetCategory {
  category: string;
  allocated: number;
  utilized: number;
  pending: number;
}

// Mock Data
export const mockFinanceStats: FinanceStats = {
  totalApplications: 156,
  pendingReview: 23,
  approvedThisMonth: 42,
  rejectedThisMonth: 8,
  totalDisbursed: 1845000,
  budgetRemaining: 655000,
  avgProcessingDays: 3.2,
};

export const mockApplications: FinancialApplication[] = [
  {
    id: 'FA-001',
    patientId: 'PT-1001',
    patientName: 'Ramesh Kumar',
    applicationDate: '2026-02-15',
    requestedAmount: 15000,
    status: 'pending',
    category: 'transport',
    priority: 'high',
    documents: ['income_cert.pdf', 'travel_estimate.pdf'],
    notes: 'Patient travels 45km for weekly treatment',
  },
  {
    id: 'FA-002',
    patientId: 'PT-1003',
    patientName: 'Mohan Singh',
    applicationDate: '2026-02-14',
    requestedAmount: 25000,
    status: 'under-review',
    category: 'medication',
    priority: 'urgent',
    documents: ['prescription.pdf', 'medical_report.pdf'],
    notes: 'Cannot afford TB medication, risk of dropout',
  },
  {
    id: 'FA-003',
    patientId: 'PT-1002',
    patientName: 'Sunita Devi',
    applicationDate: '2026-02-12',
    requestedAmount: 50000,
    approvedAmount: 45000,
    status: 'approved',
    category: 'treatment',
    priority: 'medium',
    documents: ['treatment_plan.pdf', 'cost_estimate.pdf'],
    notes: 'Chemotherapy session costs',
    reviewedBy: 'Finance Manager',
    reviewDate: '2026-02-16',
  },
  {
    id: 'FA-004',
    patientId: 'PT-1004',
    patientName: 'Priya Sharma',
    applicationDate: '2026-02-10',
    requestedAmount: 20000,
    approvedAmount: 20000,
    status: 'disbursed',
    category: 'emergency',
    priority: 'urgent',
    documents: ['emergency_report.pdf'],
    notes: 'Emergency hospitalization costs',
    reviewedBy: 'Finance Manager',
    reviewDate: '2026-02-11',
    disbursementDate: '2026-02-12',
  },
  {
    id: 'FA-005',
    patientId: 'PT-1006',
    patientName: 'Lakshmi Rao',
    applicationDate: '2026-02-08',
    requestedAmount: 10000,
    status: 'rejected',
    category: 'other',
    priority: 'low',
    documents: ['application.pdf'],
    notes: 'Incomplete documentation',
    reviewedBy: 'Finance Manager',
    reviewDate: '2026-02-10',
  },
  {
    id: 'FA-006',
    patientId: 'PT-1005',
    patientName: 'Anil Verma',
    applicationDate: '2026-02-18',
    requestedAmount: 30000,
    status: 'pending',
    category: 'treatment',
    priority: 'high',
    documents: ['dialysis_plan.pdf', 'income_proof.pdf'],
    notes: 'Dialysis treatment expenses',
  },
];

export const mockDisbursements: Disbursement[] = [
  {
    id: 'D-001',
    applicationId: 'FA-004',
    patientId: 'PT-1004',
    patientName: 'Priya Sharma',
    amount: 20000,
    category: 'emergency',
    disbursementDate: '2026-02-12',
    method: 'bank-transfer',
    status: 'completed',
    reference: 'TXN123456789',
  },
  {
    id: 'D-002',
    applicationId: 'FA-003',
    patientId: 'PT-1002',
    patientName: 'Sunita Devi',
    amount: 45000,
    category: 'treatment',
    disbursementDate: '2026-02-17',
    method: 'bank-transfer',
    status: 'pending',
    reference: 'TXN123456790',
  },
  {
    id: 'D-003',
    applicationId: 'FA-010',
    patientId: 'PT-1010',
    patientName: 'Raj Patel',
    amount: 12000,
    category: 'transport',
    disbursementDate: '2026-02-15',
    method: 'upi',
    status: 'completed',
    reference: 'UPI789456123',
  },
];

export const mockBudgetCategories: BudgetCategory[] = [
  { category: 'Transport Assistance', allocated: 500000, utilized: 320000, pending: 45000 },
  { category: 'Medication Support', allocated: 800000, utilized: 580000, pending: 85000 },
  { category: 'Treatment Costs', allocated: 1000000, utilized: 720000, pending: 95000 },
  { category: 'Emergency Fund', allocated: 300000, utilized: 180000, pending: 20000 },
  { category: 'Other Support', allocated: 150000, utilized: 45000, pending: 10000 },
];

// Helper functions
export const getStatusColor = (status: FinancialApplication['status']) => {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'under-review': return 'bg-blue-100 text-blue-800';
    case 'approved': return 'bg-green-100 text-green-800';
    case 'rejected': return 'bg-red-100 text-red-800';
    case 'disbursed': return 'bg-purple-100 text-purple-800';
  }
};

export const getPriorityColor = (priority: FinancialApplication['priority']) => {
  switch (priority) {
    case 'low': return 'bg-gray-100 text-gray-800';
    case 'medium': return 'bg-blue-100 text-blue-800';
    case 'high': return 'bg-orange-100 text-orange-800';
    case 'urgent': return 'bg-red-100 text-red-800';
  }
};

export const getCategoryColor = (category: string) => {
  switch (category) {
    case 'transport': return 'bg-cyan-100 text-cyan-800';
    case 'medication': return 'bg-purple-100 text-purple-800';
    case 'treatment': return 'bg-pink-100 text-pink-800';
    case 'emergency': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const getDisbursementStatusColor = (status: Disbursement['status']) => {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'processed': return 'bg-blue-100 text-blue-800';
    case 'completed': return 'bg-green-100 text-green-800';
    case 'failed': return 'bg-red-100 text-red-800';
  }
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};
