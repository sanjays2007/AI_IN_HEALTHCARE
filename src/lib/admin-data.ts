// Admin Module Types and Mock Data

export interface AdminStats {
  totalActivePatients: number;
  overallDropoutRisk: number;
  highRiskCount: number;
  treatmentCompletionRate: number;
  dropoutPreventionRate: number;
  financialAssistanceDistributed: number;
  predictedDropouts: number;
  preventedDropouts: number;
}

export interface MonthlyTrend {
  month: string;
  dropoutRate: number;
  completionRate: number;
  newPatients: number;
  discharges: number;
}

export interface DepartmentPerformance {
  id: string;
  name: string;
  totalPatients: number;
  dropoutRate: number;
  highRiskPercent: number;
  avgRiskScore: number;
  interventionSuccessRate: number;
  staffResponsivenessScore: number;
  trend: 'improving' | 'stable' | 'declining';
}

export interface StaffPerformance {
  id: string;
  name: string;
  role: 'doctor' | 'nurse' | 'counselor' | 'finance';
  department: string;
  interventionResponseTime: number; // hours
  followUpCompletionRate: number;
  resolutionTime: number; // hours
  escalationsHandled: number;
  avgTimeToRiskReduction: number; // days
  patientsManaged: number;
  performanceScore: number;
}

export interface RiskFactorBreakdown {
  factor: string;
  percentage: number;
  patientCount: number;
  trend: 'up' | 'down' | 'stable';
  color: string;
}

export interface GeographicCluster {
  region: string;
  riskLevel: 'high' | 'medium' | 'low';
  patientCount: number;
  avgTravelTime: number; // minutes
  dropoutRate: number;
  coordinates: { lat: number; lng: number };
}

export interface InterventionOutcome {
  type: string;
  totalAttempted: number;
  successful: number;
  successRate: number;
  avgRiskReduction: number;
  avgResponseTime: number; // hours
}

export interface FinancialMetrics {
  totalAllocated: number;
  installmentAdoptionRate: number;
  financialDropoutReduction: number;
  costSavedPerPrevention: number;
  roiPercentage: number;
  pendingApplications: number;
  approvedThisMonth: number;
}

export interface SeasonalPattern {
  season: string;
  period: string;
  months: string;
  riskIncrease: number;
  riskSpike: number;
  primaryCause: string;
  primaryFactors: string[];
  recommendedAction: string;
  recommendedActions: string[];
  historicalDropouts: number;
}

export interface PolicyProgram {
  id: string;
  name: string;
  type: 'campaign' | 'support' | 'staffing' | 'protocol';
  status: 'active' | 'draft' | 'completed' | 'scheduled' | 'planned';
  startDate: string;
  endDate?: string;
  targetDepartment: string;
  impact: number;
  description: string;
  budget: number;
  utilized: number;
  effectiveness: number;
  targetPatients: number;
  currentEnrollment: number;
}

export interface AIModelMetrics {
  overallAccuracy: number;
  accuracy: number;
  sensitivity: number;
  specificity: number;
  aucRoc: number;
  falsePositiveRate: number;
  falseNegativeRate: number;
  truePositives: number;
  falsePositives: number;
  trueNegatives: number;
  falseNegatives: number;
  lastCalibration: string;
  totalPredictions: number;
  flaggedReviews: number;
  modelVersion: string;
}

export interface SystemAlert {
  id: string;
  type: 'dropout_spike' | 'threshold_breach' | 'budget_exceeded' | 'ai_error' | 'staff_delay' | 'system';
  priority: 'critical' | 'high' | 'moderate' | 'low';
  title: string;
  description: string;
  department?: string;
  timestamp: string;
  isRead: boolean;
  actionRequired: boolean;
}

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: 'doctor' | 'nurse' | 'counselor' | 'finance' | 'admin';
  department: string;
  status: 'active' | 'inactive' | 'pending';
  lastLogin: string;
  createdAt: string;
  permissions: string[];
}

// Mock Data
export const mockAdminStats: AdminStats = {
  totalActivePatients: 1247,
  overallDropoutRisk: 18.5,
  highRiskCount: 89,
  treatmentCompletionRate: 76.8,
  dropoutPreventionRate: 72.3,
  financialAssistanceDistributed: 2450000,
  predictedDropouts: 124,
  preventedDropouts: 89,
};

export const mockMonthlyTrends: MonthlyTrend[] = [
  { month: 'Sep', dropoutRate: 22.1, completionRate: 71.2, newPatients: 145, discharges: 98 },
  { month: 'Oct', dropoutRate: 20.8, completionRate: 73.5, newPatients: 132, discharges: 112 },
  { month: 'Nov', dropoutRate: 19.2, completionRate: 74.8, newPatients: 118, discharges: 89 },
  { month: 'Dec', dropoutRate: 21.5, completionRate: 72.1, newPatients: 95, discharges: 76 },
  { month: 'Jan', dropoutRate: 19.8, completionRate: 75.3, newPatients: 156, discharges: 102 },
  { month: 'Feb', dropoutRate: 18.5, completionRate: 76.8, newPatients: 142, discharges: 94 },
];

export const mockDepartmentPerformance: DepartmentPerformance[] = [
  {
    id: '1',
    name: 'Oncology',
    totalPatients: 245,
    dropoutRate: 15.2,
    highRiskPercent: 12.3,
    avgRiskScore: 42,
    interventionSuccessRate: 78.5,
    staffResponsivenessScore: 92,
    trend: 'improving',
  },
  {
    id: '2',
    name: 'TB Treatment',
    totalPatients: 312,
    dropoutRate: 22.8,
    highRiskPercent: 18.5,
    avgRiskScore: 51,
    interventionSuccessRate: 68.2,
    staffResponsivenessScore: 85,
    trend: 'stable',
  },
  {
    id: '3',
    name: 'Dialysis',
    totalPatients: 189,
    dropoutRate: 12.4,
    highRiskPercent: 8.9,
    avgRiskScore: 38,
    interventionSuccessRate: 82.1,
    staffResponsivenessScore: 94,
    trend: 'improving',
  },
  {
    id: '4',
    name: 'Mental Health',
    totalPatients: 278,
    dropoutRate: 31.5,
    highRiskPercent: 24.2,
    avgRiskScore: 58,
    interventionSuccessRate: 61.3,
    staffResponsivenessScore: 78,
    trend: 'declining',
  },
  {
    id: '5',
    name: 'Substance Abuse',
    totalPatients: 156,
    dropoutRate: 38.2,
    highRiskPercent: 32.1,
    avgRiskScore: 65,
    interventionSuccessRate: 52.8,
    staffResponsivenessScore: 72,
    trend: 'declining',
  },
  {
    id: '6',
    name: 'Cardiology',
    totalPatients: 198,
    dropoutRate: 9.8,
    highRiskPercent: 6.5,
    avgRiskScore: 32,
    interventionSuccessRate: 88.4,
    staffResponsivenessScore: 96,
    trend: 'improving',
  },
];

export const mockStaffPerformance: StaffPerformance[] = [
  {
    id: '1',
    name: 'Dr. Sarah Chen',
    role: 'doctor',
    department: 'Oncology',
    interventionResponseTime: 2.5,
    followUpCompletionRate: 94,
    resolutionTime: 48,
    escalationsHandled: 12,
    avgTimeToRiskReduction: 5.2,
    patientsManaged: 45,
    performanceScore: 92,
  },
  {
    id: '2',
    name: 'Dr. Michael Evans',
    role: 'doctor',
    department: 'TB Treatment',
    interventionResponseTime: 3.2,
    followUpCompletionRate: 88,
    resolutionTime: 56,
    escalationsHandled: 8,
    avgTimeToRiskReduction: 6.8,
    patientsManaged: 52,
    performanceScore: 85,
  },
  {
    id: '3',
    name: 'Nurse Priya Sharma',
    role: 'nurse',
    department: 'Dialysis',
    interventionResponseTime: 1.2,
    followUpCompletionRate: 96,
    resolutionTime: 24,
    escalationsHandled: 15,
    avgTimeToRiskReduction: 3.5,
    patientsManaged: 38,
    performanceScore: 95,
  },
  {
    id: '4',
    name: 'Nurse John Williams',
    role: 'nurse',
    department: 'Mental Health',
    interventionResponseTime: 1.8,
    followUpCompletionRate: 82,
    resolutionTime: 32,
    escalationsHandled: 22,
    avgTimeToRiskReduction: 4.8,
    patientsManaged: 41,
    performanceScore: 78,
  },
  {
    id: '5',
    name: 'Raj Patel',
    role: 'counselor',
    department: 'Substance Abuse',
    interventionResponseTime: 2.0,
    followUpCompletionRate: 76,
    resolutionTime: 72,
    escalationsHandled: 18,
    avgTimeToRiskReduction: 8.2,
    patientsManaged: 28,
    performanceScore: 72,
  },
  {
    id: '6',
    name: 'Lisa Thompson',
    role: 'finance',
    department: 'All',
    interventionResponseTime: 4.5,
    followUpCompletionRate: 91,
    resolutionTime: 96,
    escalationsHandled: 5,
    avgTimeToRiskReduction: 12.5,
    patientsManaged: 156,
    performanceScore: 88,
  },
];

export const mockRiskFactorBreakdown: RiskFactorBreakdown[] = [
  { factor: 'Financial Stress', percentage: 35, patientCount: 312, trend: 'up', color: '#ef4444' },
  { factor: 'Emotional/Mental', percentage: 20, patientCount: 178, trend: 'stable', color: '#f97316' },
  { factor: 'Side Effects', percentage: 18, patientCount: 160, trend: 'down', color: '#eab308' },
  { factor: 'Low Engagement', percentage: 15, patientCount: 134, trend: 'up', color: '#22c55e' },
  { factor: 'Travel Burden', percentage: 12, patientCount: 107, trend: 'stable', color: '#3b82f6' },
];

export const mockGeographicClusters: GeographicCluster[] = [
  { region: 'North District', riskLevel: 'high', patientCount: 234, avgTravelTime: 85, dropoutRate: 28.5, coordinates: { lat: 28.7041, lng: 77.1025 } },
  { region: 'South District', riskLevel: 'low', patientCount: 312, avgTravelTime: 25, dropoutRate: 12.3, coordinates: { lat: 28.5245, lng: 77.1855 } },
  { region: 'East District', riskLevel: 'medium', patientCount: 189, avgTravelTime: 45, dropoutRate: 19.8, coordinates: { lat: 28.6289, lng: 77.3178 } },
  { region: 'West District', riskLevel: 'medium', patientCount: 267, avgTravelTime: 55, dropoutRate: 21.2, coordinates: { lat: 28.6517, lng: 77.0219 } },
  { region: 'Central', riskLevel: 'low', patientCount: 245, avgTravelTime: 15, dropoutRate: 8.5, coordinates: { lat: 28.6139, lng: 77.2090 } },
];

export const mockInterventionOutcomes: InterventionOutcome[] = [
  { type: 'Phone Counseling', totalAttempted: 456, successful: 342, successRate: 75.0, avgRiskReduction: 15.2, avgResponseTime: 2.5 },
  { type: 'Financial Support', totalAttempted: 234, successful: 198, successRate: 84.6, avgRiskReduction: 22.8, avgResponseTime: 48.0 },
  { type: 'Home Visit', totalAttempted: 89, successful: 71, successRate: 79.8, avgRiskReduction: 28.5, avgResponseTime: 72.0 },
  { type: 'Family Meeting', totalAttempted: 156, successful: 112, successRate: 71.8, avgRiskReduction: 18.4, avgResponseTime: 96.0 },
  { type: 'Peer Support', totalAttempted: 178, successful: 128, successRate: 71.9, avgRiskReduction: 12.6, avgResponseTime: 24.0 },
  { type: 'Schedule Adjustment', totalAttempted: 312, successful: 278, successRate: 89.1, avgRiskReduction: 8.5, avgResponseTime: 4.0 },
];

export const mockFinancialMetrics: FinancialMetrics = {
  totalAllocated: 2450000,
  installmentAdoptionRate: 68.5,
  financialDropoutReduction: 42.3,
  costSavedPerPrevention: 185000,
  roiPercentage: 340,
  pendingApplications: 23,
  approvedThisMonth: 89,
};

export const mockSeasonalPatterns: SeasonalPattern[] = [
  {
    season: 'Monsoon',
    period: 'Jul - Sep',
    months: 'July - September',
    riskIncrease: 35,
    riskSpike: 35,
    primaryCause: 'Travel difficulties, flooding',
    primaryFactors: ['Travel difficulties', 'Flooding', 'Road closures'],
    recommendedAction: 'Increase telemedicine, home visits',
    recommendedActions: ['Increase telemedicine sessions', 'Schedule home visits', 'Provide transport assistance'],
    historicalDropouts: 156,
  },
  {
    season: 'Festival Season',
    period: 'Oct - Nov',
    months: 'October - November',
    riskIncrease: 22,
    riskSpike: 22,
    primaryCause: 'Financial strain, family obligations',
    primaryFactors: ['Financial strain', 'Family obligations', 'Travel for festivities'],
    recommendedAction: 'Pre-emptive financial counseling',
    recommendedActions: ['Pre-emptive financial counseling', 'Flexible payment plans', 'Schedule adjustments'],
    historicalDropouts: 98,
  },
  {
    season: 'Exam Period',
    period: 'Mar - Apr',
    months: 'March - April',
    riskIncrease: 18,
    riskSpike: 18,
    primaryCause: 'Caregiver stress, younger patients',
    primaryFactors: ['Caregiver stress', 'Students missing appointments', 'Academic pressure'],
    recommendedAction: 'Flexible scheduling, emotional support',
    recommendedActions: ['Flexible scheduling', 'Emotional support sessions', 'Weekend appointments'],
    historicalDropouts: 67,
  },
  {
    season: 'Year End',
    period: 'Dec - Jan',
    months: 'December - January',
    riskIncrease: 28,
    riskSpike: 28,
    primaryCause: 'Fund shortages, insurance renewal',
    primaryFactors: ['Annual fund depletion', 'Insurance renewal gaps', 'Holiday travel'],
    recommendedAction: 'Emergency fund allocation',
    recommendedActions: ['Emergency fund allocation', 'Insurance bridge support', 'Year-end wellness check'],
    historicalDropouts: 112,
  },
];

export const mockPolicyPrograms: PolicyProgram[] = [
  {
    id: '1',
    name: 'Zero Dropout Initiative',
    type: 'campaign',
    status: 'active',
    startDate: '2026-01-01',
    targetDepartment: 'All',
    impact: 15,
    description: 'Hospital-wide awareness campaign to reduce treatment dropout',
    budget: 500000,
    utilized: 325000,
    effectiveness: 78,
    targetPatients: 500,
    currentEnrollment: 412,
  },
  {
    id: '2',
    name: 'Emergency Financial Aid',
    type: 'support',
    status: 'active',
    startDate: '2025-06-15',
    targetDepartment: 'All',
    impact: 42,
    description: 'Emergency fund for patients facing sudden financial hardship',
    budget: 1200000,
    utilized: 890000,
    effectiveness: 85,
    targetPatients: 300,
    currentEnrollment: 245,
  },
  {
    id: '3',
    name: 'Mental Health Staff Augmentation',
    type: 'staffing',
    status: 'active',
    startDate: '2026-02-01',
    targetDepartment: 'Mental Health',
    impact: 8,
    description: 'Additional counselors assigned to high-risk mental health department',
    budget: 350000,
    utilized: 125000,
    effectiveness: 72,
    targetPatients: 150,
    currentEnrollment: 98,
  },
  {
    id: '4',
    name: 'AI-Driven Early Intervention Protocol',
    type: 'protocol',
    status: 'active',
    startDate: '2025-09-01',
    targetDepartment: 'All',
    impact: 28,
    description: 'Automated alerts and intervention workflows based on AI predictions',
    budget: 200000,
    utilized: 180000,
    effectiveness: 91,
    targetPatients: 800,
    currentEnrollment: 734,
  },
  {
    id: '5',
    name: 'Monsoon Preparedness Campaign',
    type: 'campaign',
    status: 'scheduled',
    startDate: '2026-06-15',
    endDate: '2026-09-30',
    targetDepartment: 'All',
    impact: 0,
    description: 'Proactive outreach before monsoon season to reduce weather-related dropouts',
    budget: 400000,
    utilized: 0,
    effectiveness: 0,
    targetPatients: 350,
    currentEnrollment: 0,
  },
  {
    id: '6',
    name: 'Pediatric Support Program',
    type: 'support',
    status: 'planned',
    startDate: '2026-04-01',
    targetDepartment: 'Pediatrics',
    impact: 0,
    description: 'Specialized support for pediatric patients and their families',
    budget: 280000,
    utilized: 0,
    effectiveness: 0,
    targetPatients: 200,
    currentEnrollment: 0,
  },
  {
    id: '7',
    name: 'Rural Outreach Initiative',
    type: 'campaign',
    status: 'completed',
    startDate: '2025-03-01',
    endDate: '2025-12-31',
    targetDepartment: 'All',
    impact: 35,
    description: 'Targeted outreach to patients in rural areas with transport challenges',
    budget: 600000,
    utilized: 580000,
    effectiveness: 82,
    targetPatients: 400,
    currentEnrollment: 385,
  },
];

export const mockAIModelMetrics: AIModelMetrics = {
  overallAccuracy: 87.3,
  accuracy: 87.3,
  sensitivity: 91.2,
  specificity: 84.5,
  aucRoc: 0.923,
  falsePositiveRate: 15.5,
  falseNegativeRate: 8.8,
  truePositives: 1823,
  falsePositives: 312,
  trueNegatives: 9876,
  falseNegatives: 445,
  lastCalibration: '2026-02-15',
  totalPredictions: 12456,
  flaggedReviews: 23,
  modelVersion: '2.4.1',
};

export const mockSystemAlerts: SystemAlert[] = [
  {
    id: '1',
    type: 'dropout_spike',
    priority: 'critical',
    title: 'Dropout Spike in Mental Health',
    description: 'Mental Health department dropout rate increased by 8% in the last 7 days',
    department: 'Mental Health',
    timestamp: '2026-02-19T08:30:00Z',
    isRead: false,
    actionRequired: true,
  },
  {
    id: '2',
    type: 'threshold_breach',
    priority: 'high',
    title: 'Substance Abuse Risk Threshold',
    description: 'Department average risk score (65) exceeds threshold (60)',
    department: 'Substance Abuse',
    timestamp: '2026-02-19T07:15:00Z',
    isRead: false,
    actionRequired: true,
  },
  {
    id: '3',
    type: 'budget_exceeded',
    priority: 'high',
    title: 'Financial Aid Budget 85% Utilized',
    description: 'Monthly financial assistance budget has reached 85% utilization',
    timestamp: '2026-02-18T16:00:00Z',
    isRead: true,
    actionRequired: false,
  },
  {
    id: '4',
    type: 'ai_error',
    priority: 'moderate',
    title: 'AI Model Flagged Predictions',
    description: '5 new predictions flagged for manual review due to low confidence',
    timestamp: '2026-02-18T14:30:00Z',
    isRead: false,
    actionRequired: true,
  },
  {
    id: '5',
    type: 'staff_delay',
    priority: 'moderate',
    title: 'Response Time Delay',
    description: 'Average intervention response time increased to 4.2 hours (target: 3 hours)',
    department: 'TB Treatment',
    timestamp: '2026-02-18T10:00:00Z',
    isRead: true,
    actionRequired: false,
  },
  {
    id: '6',
    type: 'system',
    priority: 'low',
    title: 'Weekly Report Generated',
    description: 'Automated weekly performance report is ready for review',
    timestamp: '2026-02-17T06:00:00Z',
    isRead: true,
    actionRequired: false,
  },
];

export const mockSystemUsers: SystemUser[] = [
  {
    id: '1',
    name: 'Dr. Sarah Chen',
    email: 'sarah.chen@hospital.com',
    role: 'doctor',
    department: 'Oncology',
    status: 'active',
    lastLogin: '2026-02-19T09:15:00Z',
    createdAt: '2024-03-15',
    permissions: ['view_patients', 'create_interventions', 'view_analytics'],
  },
  {
    id: '2',
    name: 'Dr. Michael Evans',
    email: 'michael.evans@hospital.com',
    role: 'doctor',
    department: 'TB Treatment',
    status: 'active',
    lastLogin: '2026-02-19T08:30:00Z',
    createdAt: '2023-08-20',
    permissions: ['view_patients', 'create_interventions', 'view_analytics'],
  },
  {
    id: '3',
    name: 'Nurse Priya Sharma',
    email: 'priya.sharma@hospital.com',
    role: 'nurse',
    department: 'Dialysis',
    status: 'active',
    lastLogin: '2026-02-19T07:45:00Z',
    createdAt: '2024-01-10',
    permissions: ['view_patients', 'log_followups', 'send_messages'],
  },
  {
    id: '4',
    name: 'Raj Patel',
    email: 'raj.patel@hospital.com',
    role: 'counselor',
    department: 'Substance Abuse',
    status: 'active',
    lastLogin: '2026-02-18T16:20:00Z',
    createdAt: '2024-06-05',
    permissions: ['view_patients', 'create_interventions', 'log_sessions'],
  },
  {
    id: '5',
    name: 'Lisa Thompson',
    email: 'lisa.thompson@hospital.com',
    role: 'finance',
    department: 'Finance',
    status: 'active',
    lastLogin: '2026-02-19T10:00:00Z',
    createdAt: '2023-11-12',
    permissions: ['view_patients', 'manage_financial_aid', 'view_reports'],
  },
  {
    id: '6',
    name: 'Admin User',
    email: 'admin@hospital.com',
    role: 'admin',
    department: 'Administration',
    status: 'active',
    lastLogin: '2026-02-19T10:30:00Z',
    createdAt: '2023-01-01',
    permissions: ['all'],
  },
  {
    id: '7',
    name: 'Dr. James Wilson',
    email: 'james.wilson@hospital.com',
    role: 'doctor',
    department: 'Cardiology',
    status: 'inactive',
    lastLogin: '2026-01-15T14:00:00Z',
    createdAt: '2024-02-28',
    permissions: ['view_patients', 'create_interventions'],
  },
  {
    id: '8',
    name: 'Nurse Pending',
    email: 'pending.nurse@hospital.com',
    role: 'nurse',
    department: 'Mental Health',
    status: 'pending',
    lastLogin: '',
    createdAt: '2026-02-18',
    permissions: [],
  },
];

// Helper functions
export const getAlertPriorityColor = (priority: SystemAlert['priority']) => {
  switch (priority) {
    case 'critical': return 'bg-red-500';
    case 'high': return 'bg-orange-500';
    case 'moderate': return 'bg-yellow-500';
    case 'low': return 'bg-blue-500';
  }
};

export const getAlertPriorityBadge = (priority: SystemAlert['priority']) => {
  switch (priority) {
    case 'critical': return 'destructive';
    case 'high': return 'destructive';
    case 'moderate': return 'secondary';
    case 'low': return 'outline';
  }
};

export const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
  switch (trend) {
    case 'up': return '↑';
    case 'down': return '↓';
    case 'stable': return '→';
  }
};

export const getTrendColor = (trend: 'up' | 'down' | 'stable', isGoodUp: boolean = false) => {
  if (trend === 'stable') return 'text-gray-500';
  if (isGoodUp) {
    return trend === 'up' ? 'text-green-500' : 'text-red-500';
  }
  return trend === 'up' ? 'text-red-500' : 'text-green-500';
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const getRiskLevelColor = (level: 'high' | 'medium' | 'low') => {
  switch (level) {
    case 'high': return 'bg-red-500';
    case 'medium': return 'bg-yellow-500';
    case 'low': return 'bg-green-500';
  }
};

export const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'active': return 'default';
    case 'inactive': return 'secondary';
    case 'pending': return 'outline';
    case 'completed': return 'secondary';
    case 'scheduled': return 'outline';
    case 'draft': return 'outline';
    default: return 'secondary';
  }
};

export const getRoleBadgeColor = (role: string) => {
  switch (role) {
    case 'admin': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
    case 'doctor': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    case 'nurse': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    case 'counselor': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
    case 'finance': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
  }
};
