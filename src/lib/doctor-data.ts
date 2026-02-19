// Doctor Portal Types and Mock Data

export type RiskCategory = 'low' | 'medium' | 'high' | 'critical';
export type AlertPriority = 'critical' | 'high' | 'moderate' | 'low';
export type InterventionType = 
  | 'dosage_adjustment' 
  | 'tele_consult' 
  | 'financial_referral' 
  | 'nurse_followup' 
  | 'education_intervention' 
  | 'mental_health_support'
  | 'urgent_appointment'
  | 'treatment_change'
  | 'multidisciplinary_review';

export interface RiskBreakdown {
  financial: number;
  sideEffect: number;
  emotional: number;
  travel: number;
  engagement: number;
}

export interface PatientRiskProfile {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  patientId: string;
  diagnosis: string;
  treatmentType: string;
  treatmentPhase: string;
  medicationPlan: string;
  labProgress: string;
  treatmentCompletionPercent: number;
  dropoutRiskScore: number;
  riskCategory: RiskCategory;
  primaryRiskFactor: string;
  riskBreakdown: RiskBreakdown;
  lastVisitDate: string;
  nextAppointment: string;
  missedAppointmentCount: number;
  medicationAdherence: number;
  appointmentAdherence: number;
  communicationResponseRate: number;
  enrollmentDate: string;
  assignedDoctor: string;
  department: string;
  contactPhone: string;
  contactEmail: string;
  emergencyContact: string;
  insuranceStatus: 'active' | 'pending' | 'expired' | 'none';
  financialAidStatus: 'approved' | 'pending' | 'rejected' | 'none';
}

export interface BehavioralEvent {
  id: string;
  patientId: string;
  date: string;
  type: 'appointment_gap' | 'payment_delay' | 'side_effect' | 'mood_decline' | 'missed_dose' | 'appointment_kept' | 'payment_made' | 'positive_feedback';
  description: string;
  severity: 'low' | 'medium' | 'high';
  value?: number;
}

export interface AIRecommendation {
  id: string;
  patientId: string;
  type: InterventionType;
  title: string;
  description: string;
  priority: AlertPriority;
  expectedImpact: string;
  riskReduction: number;
  createdAt: string;
  status: 'pending' | 'accepted' | 'modified' | 'ignored';
  ignoreReason?: string;
}

export interface Intervention {
  id: string;
  patientId: string;
  doctorId: string;
  type: InterventionType;
  title: string;
  notes: string;
  outcome?: string;
  createdAt: string;
  scheduledDate?: string;
  completedAt?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
}

export interface DoctorAlert {
  id: string;
  patientId: string;
  patientName: string;
  type: 'risk_increase' | 'missed_appointments' | 'severe_side_effect' | 'emotional_distress' | 'financial_instability' | 'treatment_milestone';
  title: string;
  description: string;
  priority: AlertPriority;
  createdAt: string;
  isRead: boolean;
  actionRequired: boolean;
  actionTaken?: string;
}

export interface DepartmentStats {
  department: string;
  totalPatients: number;
  highRiskCount: number;
  avgDropoutRisk: number;
  treatmentCompletionRate: number;
  topRiskFactor: string;
}

export interface RiskTrend {
  date: string;
  lowRisk: number;
  mediumRisk: number;
  highRisk: number;
  criticalRisk: number;
}

export interface PredictiveScenario {
  intervention: string;
  currentRisk: number;
  projectedRisk: number;
  riskReduction: number;
  confidence: number;
  timeToEffect: string;
}

// Dashboard Summary Stats
export interface DashboardStats {
  totalActivePatients: number;
  highRiskPatients: number;
  mediumRiskPatients: number;
  newRiskAlertsToday: number;
  patientsStabilizedThisMonth: number;
  treatmentCompletionRate: number;
}

// Mock Data

export const mockDashboardStats: DashboardStats = {
  totalActivePatients: 248,
  highRiskPatients: 32,
  mediumRiskPatients: 67,
  newRiskAlertsToday: 8,
  patientsStabilizedThisMonth: 15,
  treatmentCompletionRate: 78.5,
};

export const mockRiskDistribution = {
  low: 124,
  medium: 67,
  high: 32,
  critical: 25,
};

export const mockDepartmentStats: DepartmentStats[] = [
  { department: 'Oncology', totalPatients: 85, highRiskCount: 18, avgDropoutRisk: 42, treatmentCompletionRate: 72, topRiskFactor: 'Financial' },
  { department: 'Cardiology', totalPatients: 62, highRiskCount: 8, avgDropoutRisk: 28, treatmentCompletionRate: 85, topRiskFactor: 'Side Effects' },
  { department: 'Neurology', totalPatients: 45, highRiskCount: 12, avgDropoutRisk: 38, treatmentCompletionRate: 76, topRiskFactor: 'Travel' },
  { department: 'Pulmonology', totalPatients: 38, highRiskCount: 6, avgDropoutRisk: 25, treatmentCompletionRate: 82, topRiskFactor: 'Engagement' },
  { department: 'Gastroenterology', totalPatients: 18, highRiskCount: 3, avgDropoutRisk: 22, treatmentCompletionRate: 88, topRiskFactor: 'Emotional' },
];

export const mockRiskTrends: RiskTrend[] = [
  { date: '2026-02-13', lowRisk: 128, mediumRisk: 62, highRisk: 28, criticalRisk: 22 },
  { date: '2026-02-14', lowRisk: 126, mediumRisk: 64, highRisk: 30, criticalRisk: 22 },
  { date: '2026-02-15', lowRisk: 125, mediumRisk: 65, highRisk: 31, criticalRisk: 23 },
  { date: '2026-02-16', lowRisk: 124, mediumRisk: 66, highRisk: 31, criticalRisk: 24 },
  { date: '2026-02-17', lowRisk: 123, mediumRisk: 67, highRisk: 32, criticalRisk: 24 },
  { date: '2026-02-18', lowRisk: 124, mediumRisk: 67, highRisk: 32, criticalRisk: 25 },
  { date: '2026-02-19', lowRisk: 124, mediumRisk: 67, highRisk: 32, criticalRisk: 25 },
];

export const mockPatientRiskProfiles: PatientRiskProfile[] = [
  {
    id: '1',
    name: 'Maria Santos',
    age: 54,
    gender: 'female',
    patientId: 'PAT-2024-001',
    diagnosis: 'Breast Cancer Stage II',
    treatmentType: 'Chemotherapy',
    treatmentPhase: 'Phase 2 of 4',
    medicationPlan: 'Doxorubicin + Cyclophosphamide',
    labProgress: 'Tumor markers decreasing',
    treatmentCompletionPercent: 45,
    dropoutRiskScore: 78,
    riskCategory: 'high',
    primaryRiskFactor: 'Financial Burden',
    riskBreakdown: { financial: 40, sideEffect: 25, emotional: 15, travel: 10, engagement: 10 },
    lastVisitDate: '2026-02-10',
    nextAppointment: '2026-02-24',
    missedAppointmentCount: 3,
    medicationAdherence: 72,
    appointmentAdherence: 68,
    communicationResponseRate: 45,
    enrollmentDate: '2025-11-15',
    assignedDoctor: 'Dr. James Wilson',
    department: 'Oncology',
    contactPhone: '+1-555-0101',
    contactEmail: 'maria.santos@email.com',
    emergencyContact: '+1-555-0102',
    insuranceStatus: 'active',
    financialAidStatus: 'pending',
  },
  {
    id: '2',
    name: 'Robert Chen',
    age: 62,
    gender: 'male',
    patientId: 'PAT-2024-002',
    diagnosis: 'Chronic Heart Failure',
    treatmentType: 'Medication + Lifestyle',
    treatmentPhase: 'Maintenance',
    medicationPlan: 'Metoprolol + Lisinopril + Furosemide',
    labProgress: 'BNP levels stable',
    treatmentCompletionPercent: 60,
    dropoutRiskScore: 85,
    riskCategory: 'critical',
    primaryRiskFactor: 'Severe Side Effects',
    riskBreakdown: { financial: 15, sideEffect: 45, emotional: 20, travel: 5, engagement: 15 },
    lastVisitDate: '2026-02-05',
    nextAppointment: '2026-02-20',
    missedAppointmentCount: 4,
    medicationAdherence: 58,
    appointmentAdherence: 55,
    communicationResponseRate: 30,
    enrollmentDate: '2025-09-20',
    assignedDoctor: 'Dr. James Wilson',
    department: 'Cardiology',
    contactPhone: '+1-555-0201',
    contactEmail: 'robert.chen@email.com',
    emergencyContact: '+1-555-0202',
    insuranceStatus: 'pending',
    financialAidStatus: 'none',
  },
  {
    id: '3',
    name: 'Emily Johnson',
    age: 38,
    gender: 'female',
    patientId: 'PAT-2024-003',
    diagnosis: 'Multiple Sclerosis',
    treatmentType: 'Disease-Modifying Therapy',
    treatmentPhase: 'Year 2',
    medicationPlan: 'Ocrelizumab infusions',
    labProgress: 'No new lesions',
    treatmentCompletionPercent: 75,
    dropoutRiskScore: 52,
    riskCategory: 'medium',
    primaryRiskFactor: 'Emotional Distress',
    riskBreakdown: { financial: 10, sideEffect: 20, emotional: 40, travel: 15, engagement: 15 },
    lastVisitDate: '2026-02-15',
    nextAppointment: '2026-03-01',
    missedAppointmentCount: 1,
    medicationAdherence: 88,
    appointmentAdherence: 85,
    communicationResponseRate: 75,
    enrollmentDate: '2024-08-10',
    assignedDoctor: 'Dr. James Wilson',
    department: 'Neurology',
    contactPhone: '+1-555-0301',
    contactEmail: 'emily.johnson@email.com',
    emergencyContact: '+1-555-0302',
    insuranceStatus: 'active',
    financialAidStatus: 'none',
  },
  {
    id: '4',
    name: 'David Williams',
    age: 71,
    gender: 'male',
    patientId: 'PAT-2024-004',
    diagnosis: 'COPD Stage III',
    treatmentType: 'Pulmonary Rehabilitation',
    treatmentPhase: 'Month 4',
    medicationPlan: 'Tiotropium + Fluticasone/Salmeterol',
    labProgress: 'FEV1 stable',
    treatmentCompletionPercent: 55,
    dropoutRiskScore: 68,
    riskCategory: 'high',
    primaryRiskFactor: 'Travel Difficulty',
    riskBreakdown: { financial: 20, sideEffect: 15, emotional: 10, travel: 45, engagement: 10 },
    lastVisitDate: '2026-02-12',
    nextAppointment: '2026-02-26',
    missedAppointmentCount: 2,
    medicationAdherence: 78,
    appointmentAdherence: 72,
    communicationResponseRate: 60,
    enrollmentDate: '2025-10-05',
    assignedDoctor: 'Dr. James Wilson',
    department: 'Pulmonology',
    contactPhone: '+1-555-0401',
    contactEmail: 'david.williams@email.com',
    emergencyContact: '+1-555-0402',
    insuranceStatus: 'active',
    financialAidStatus: 'approved',
  },
  {
    id: '5',
    name: 'Sarah Miller',
    age: 45,
    gender: 'female',
    patientId: 'PAT-2024-005',
    diagnosis: 'Colorectal Cancer Stage I',
    treatmentType: 'Adjuvant Chemotherapy',
    treatmentPhase: 'Cycle 3 of 8',
    medicationPlan: 'FOLFOX regimen',
    labProgress: 'CEA levels normalizing',
    treatmentCompletionPercent: 35,
    dropoutRiskScore: 42,
    riskCategory: 'medium',
    primaryRiskFactor: 'Side Effect Concerns',
    riskBreakdown: { financial: 15, sideEffect: 35, emotional: 25, travel: 10, engagement: 15 },
    lastVisitDate: '2026-02-18',
    nextAppointment: '2026-02-25',
    missedAppointmentCount: 0,
    medicationAdherence: 92,
    appointmentAdherence: 95,
    communicationResponseRate: 88,
    enrollmentDate: '2025-12-01',
    assignedDoctor: 'Dr. James Wilson',
    department: 'Oncology',
    contactPhone: '+1-555-0501',
    contactEmail: 'sarah.miller@email.com',
    emergencyContact: '+1-555-0502',
    insuranceStatus: 'active',
    financialAidStatus: 'none',
  },
  {
    id: '6',
    name: 'Michael Brown',
    age: 58,
    gender: 'male',
    patientId: 'PAT-2024-006',
    diagnosis: 'Atrial Fibrillation',
    treatmentType: 'Rate Control + Anticoagulation',
    treatmentPhase: 'Stable Management',
    medicationPlan: 'Diltiazem + Apixaban',
    labProgress: 'INR in range',
    treatmentCompletionPercent: 80,
    dropoutRiskScore: 28,
    riskCategory: 'low',
    primaryRiskFactor: 'Minor Engagement Drop',
    riskBreakdown: { financial: 10, sideEffect: 10, emotional: 5, travel: 5, engagement: 70 },
    lastVisitDate: '2026-02-17',
    nextAppointment: '2026-03-17',
    missedAppointmentCount: 0,
    medicationAdherence: 95,
    appointmentAdherence: 98,
    communicationResponseRate: 92,
    enrollmentDate: '2025-06-15',
    assignedDoctor: 'Dr. James Wilson',
    department: 'Cardiology',
    contactPhone: '+1-555-0601',
    contactEmail: 'michael.brown@email.com',
    emergencyContact: '+1-555-0602',
    insuranceStatus: 'active',
    financialAidStatus: 'none',
  },
  {
    id: '7',
    name: 'Jennifer Davis',
    age: 33,
    gender: 'female',
    patientId: 'PAT-2024-007',
    diagnosis: 'Epilepsy',
    treatmentType: 'Antiepileptic Therapy',
    treatmentPhase: 'Dose Optimization',
    medicationPlan: 'Levetiracetam + Lamotrigine',
    labProgress: 'Seizure-free 3 months',
    treatmentCompletionPercent: 65,
    dropoutRiskScore: 72,
    riskCategory: 'high',
    primaryRiskFactor: 'Financial Strain',
    riskBreakdown: { financial: 50, sideEffect: 20, emotional: 15, travel: 5, engagement: 10 },
    lastVisitDate: '2026-02-08',
    nextAppointment: '2026-02-22',
    missedAppointmentCount: 2,
    medicationAdherence: 68,
    appointmentAdherence: 70,
    communicationResponseRate: 55,
    enrollmentDate: '2025-05-20',
    assignedDoctor: 'Dr. James Wilson',
    department: 'Neurology',
    contactPhone: '+1-555-0701',
    contactEmail: 'jennifer.davis@email.com',
    emergencyContact: '+1-555-0702',
    insuranceStatus: 'expired',
    financialAidStatus: 'pending',
  },
  {
    id: '8',
    name: 'James Wilson Jr.',
    age: 48,
    gender: 'male',
    patientId: 'PAT-2024-008',
    diagnosis: 'Crohn\'s Disease',
    treatmentType: 'Biologic Therapy',
    treatmentPhase: 'Induction Complete',
    medicationPlan: 'Infliximab maintenance',
    labProgress: 'CRP normalized',
    treatmentCompletionPercent: 70,
    dropoutRiskScore: 35,
    riskCategory: 'low',
    primaryRiskFactor: 'Travel Distance',
    riskBreakdown: { financial: 15, sideEffect: 15, emotional: 10, travel: 40, engagement: 20 },
    lastVisitDate: '2026-02-14',
    nextAppointment: '2026-03-14',
    missedAppointmentCount: 1,
    medicationAdherence: 90,
    appointmentAdherence: 88,
    communicationResponseRate: 82,
    enrollmentDate: '2025-04-10',
    assignedDoctor: 'Dr. James Wilson',
    department: 'Gastroenterology',
    contactPhone: '+1-555-0801',
    contactEmail: 'james.wilson.jr@email.com',
    emergencyContact: '+1-555-0802',
    insuranceStatus: 'active',
    financialAidStatus: 'none',
  },
];

export const mockBehavioralEvents: BehavioralEvent[] = [
  { id: '1', patientId: '1', date: '2026-02-19', type: 'payment_delay', description: 'Missed payment installment', severity: 'high', value: 45 },
  { id: '2', patientId: '1', date: '2026-02-17', type: 'mood_decline', description: 'Reported feeling overwhelmed', severity: 'medium' },
  { id: '3', patientId: '1', date: '2026-02-15', type: 'side_effect', description: 'Reported severe nausea', severity: 'high' },
  { id: '4', patientId: '1', date: '2026-02-10', type: 'appointment_kept', description: 'Attended chemotherapy session', severity: 'low' },
  { id: '5', patientId: '1', date: '2026-02-05', type: 'missed_dose', description: 'Missed anti-nausea medication', severity: 'medium' },
  { id: '6', patientId: '1', date: '2026-01-28', type: 'appointment_gap', description: 'Rescheduled appointment twice', severity: 'medium' },
  { id: '7', patientId: '1', date: '2026-01-20', type: 'payment_delay', description: 'Late payment warning', severity: 'medium' },
  { id: '8', patientId: '2', date: '2026-02-18', type: 'side_effect', description: 'Severe fatigue and dizziness', severity: 'high' },
  { id: '9', patientId: '2', date: '2026-02-15', type: 'missed_dose', description: 'Skipped evening medications', severity: 'high' },
  { id: '10', patientId: '2', date: '2026-02-12', type: 'appointment_gap', description: 'No-show for follow-up', severity: 'high' },
  { id: '11', patientId: '2', date: '2026-02-08', type: 'mood_decline', description: 'Expressed frustration with treatment', severity: 'high' },
  { id: '12', patientId: '3', date: '2026-02-16', type: 'mood_decline', description: 'Anxiety about disease progression', severity: 'medium' },
  { id: '13', patientId: '3', date: '2026-02-15', type: 'appointment_kept', description: 'Completed infusion session', severity: 'low' },
  { id: '14', patientId: '4', date: '2026-02-14', type: 'appointment_gap', description: 'Transportation issues', severity: 'medium' },
  { id: '15', patientId: '4', date: '2026-02-12', type: 'appointment_kept', description: 'Attended rehabilitation', severity: 'low' },
];

export const mockAIRecommendations: AIRecommendation[] = [
  {
    id: '1',
    patientId: '1',
    type: 'financial_referral',
    title: 'Refer to Financial Counselor',
    description: 'Patient shows high financial stress. Connect with hospital financial aid program for payment plan restructuring.',
    priority: 'high',
    expectedImpact: 'Could reduce financial risk factor by 60%',
    riskReduction: 25,
    createdAt: '2026-02-19T08:00:00Z',
    status: 'pending',
  },
  {
    id: '2',
    patientId: '1',
    type: 'dosage_adjustment',
    title: 'Consider Anti-Nausea Protocol Adjustment',
    description: 'Patient reporting severe nausea affecting daily activities. Consider adding Olanzapine to anti-emetic regimen.',
    priority: 'high',
    expectedImpact: 'Could improve medication adherence by 20%',
    riskReduction: 15,
    createdAt: '2026-02-19T08:00:00Z',
    status: 'pending',
  },
  {
    id: '3',
    patientId: '1',
    type: 'mental_health_support',
    title: 'Schedule Psychology Consultation',
    description: 'Mood decline pattern detected over past 2 weeks. Patient may benefit from psychological support.',
    priority: 'moderate',
    expectedImpact: 'Could improve emotional wellbeing score',
    riskReduction: 10,
    createdAt: '2026-02-19T08:00:00Z',
    status: 'pending',
  },
  {
    id: '4',
    patientId: '2',
    type: 'tele_consult',
    title: 'Schedule Urgent Telehealth Review',
    description: 'Critical risk patient with severe side effects and multiple missed doses. Immediate consultation recommended.',
    priority: 'critical',
    expectedImpact: 'Early intervention could prevent treatment discontinuation',
    riskReduction: 30,
    createdAt: '2026-02-19T09:00:00Z',
    status: 'pending',
  },
  {
    id: '5',
    patientId: '2',
    type: 'dosage_adjustment',
    title: 'Review Medication Dosages',
    description: 'Side effects may indicate need for dose reduction or alternative medication.',
    priority: 'high',
    expectedImpact: 'Could reduce side effect severity by 40%',
    riskReduction: 20,
    createdAt: '2026-02-19T09:00:00Z',
    status: 'pending',
  },
  {
    id: '6',
    patientId: '4',
    type: 'nurse_followup',
    title: 'Arrange Home Visit or Transport',
    description: 'Travel barrier identified as primary risk factor. Coordinate hospital transport service.',
    priority: 'moderate',
    expectedImpact: 'Could improve appointment adherence by 30%',
    riskReduction: 18,
    createdAt: '2026-02-19T10:00:00Z',
    status: 'pending',
  },
  {
    id: '7',
    patientId: '7',
    type: 'financial_referral',
    title: 'Insurance Re-enrollment Assistance',
    description: 'Patient insurance has expired. Urgent assistance needed for coverage renewal.',
    priority: 'high',
    expectedImpact: 'Could prevent treatment interruption',
    riskReduction: 30,
    createdAt: '2026-02-19T11:00:00Z',
    status: 'pending',
  },
];

export const mockInterventions: Intervention[] = [
  {
    id: '1',
    patientId: '1',
    doctorId: 'doc-1',
    type: 'financial_referral',
    title: 'Financial Counseling Referral',
    notes: 'Patient referred to financial counselor. Approved for payment plan restructuring.',
    outcome: 'Payment plan extended, patient relieved',
    createdAt: '2026-01-15T10:00:00Z',
    completedAt: '2026-01-20T14:00:00Z',
    status: 'completed',
  },
  {
    id: '2',
    patientId: '1',
    doctorId: 'doc-1',
    type: 'dosage_adjustment',
    title: 'Anti-nausea medication added',
    notes: 'Added Ondansetron pre-chemo. Monitor for effectiveness.',
    outcome: 'Moderate improvement reported',
    createdAt: '2026-01-25T11:00:00Z',
    completedAt: '2026-01-25T11:30:00Z',
    status: 'completed',
  },
  {
    id: '3',
    patientId: '2',
    doctorId: 'doc-1',
    type: 'nurse_followup',
    title: 'Nurse phone follow-up scheduled',
    notes: 'Weekly check-in calls to monitor medication compliance.',
    createdAt: '2026-02-01T09:00:00Z',
    scheduledDate: '2026-02-08T10:00:00Z',
    status: 'in_progress',
  },
];

export const mockDoctorAlerts: DoctorAlert[] = [
  {
    id: '1',
    patientId: '2',
    patientName: 'Robert Chen',
    type: 'risk_increase',
    title: 'Critical Risk Level Reached',
    description: 'Patient risk score increased from 72% to 85% in the past week. Multiple missed doses and appointments detected.',
    priority: 'critical',
    createdAt: '2026-02-19T07:30:00Z',
    isRead: false,
    actionRequired: true,
  },
  {
    id: '2',
    patientId: '1',
    patientName: 'Maria Santos',
    type: 'financial_instability',
    title: 'Payment Default Warning',
    description: 'Patient missed 2 consecutive payment installments. Financial aid application pending.',
    priority: 'high',
    createdAt: '2026-02-19T08:00:00Z',
    isRead: false,
    actionRequired: true,
  },
  {
    id: '3',
    patientId: '2',
    patientName: 'Robert Chen',
    type: 'severe_side_effect',
    title: 'Severe Side Effects Reported',
    description: 'Patient reported Grade 3 fatigue and dizziness affecting daily activities.',
    priority: 'high',
    createdAt: '2026-02-18T16:00:00Z',
    isRead: true,
    actionRequired: true,
  },
  {
    id: '4',
    patientId: '7',
    patientName: 'Jennifer Davis',
    type: 'financial_instability',
    title: 'Insurance Coverage Expired',
    description: 'Patient insurance has lapsed. Risk of treatment discontinuation if not addressed.',
    priority: 'high',
    createdAt: '2026-02-18T14:00:00Z',
    isRead: false,
    actionRequired: true,
  },
  {
    id: '5',
    patientId: '3',
    patientName: 'Emily Johnson',
    type: 'emotional_distress',
    title: 'Emotional Support Needed',
    description: 'Patient expressed anxiety about disease progression during last visit.',
    priority: 'moderate',
    createdAt: '2026-02-17T11:00:00Z',
    isRead: true,
    actionRequired: false,
    actionTaken: 'Scheduled psychology consultation',
  },
  {
    id: '6',
    patientId: '4',
    patientName: 'David Williams',
    type: 'missed_appointments',
    title: 'Consecutive Appointments Missed',
    description: 'Patient missed 2 rehabilitation sessions citing transportation issues.',
    priority: 'moderate',
    createdAt: '2026-02-16T09:00:00Z',
    isRead: true,
    actionRequired: true,
  },
  {
    id: '7',
    patientId: '5',
    patientName: 'Sarah Miller',
    type: 'treatment_milestone',
    title: 'Treatment Milestone Achieved',
    description: 'Patient completed 3 of 8 chemotherapy cycles with excellent adherence.',
    priority: 'low',
    createdAt: '2026-02-18T10:00:00Z',
    isRead: false,
    actionRequired: false,
  },
  {
    id: '8',
    patientId: '6',
    patientName: 'Michael Brown',
    type: 'treatment_milestone',
    title: 'Risk Status Improved',
    description: 'Patient risk score decreased from 45% to 28%. Continue current management.',
    priority: 'low',
    createdAt: '2026-02-15T14:00:00Z',
    isRead: true,
    actionRequired: false,
  },
];

export const mockPredictiveScenarios: Record<string, PredictiveScenario[]> = {
  '1': [
    { intervention: 'No Intervention', currentRisk: 78, projectedRisk: 88, riskReduction: -10, confidence: 85, timeToEffect: 'N/A' },
    { intervention: 'Financial Aid Approval', currentRisk: 78, projectedRisk: 52, riskReduction: 26, confidence: 82, timeToEffect: '2-3 weeks' },
    { intervention: 'Enhanced Anti-Nausea Protocol', currentRisk: 78, projectedRisk: 65, riskReduction: 13, confidence: 78, timeToEffect: '1 week' },
    { intervention: 'Psychology Consultation', currentRisk: 78, projectedRisk: 68, riskReduction: 10, confidence: 72, timeToEffect: '3-4 weeks' },
    { intervention: 'Combined Interventions', currentRisk: 78, projectedRisk: 38, riskReduction: 40, confidence: 75, timeToEffect: '4-6 weeks' },
  ],
  '2': [
    { intervention: 'No Intervention', currentRisk: 85, projectedRisk: 95, riskReduction: -10, confidence: 90, timeToEffect: 'N/A' },
    { intervention: 'Immediate Telehealth Consult', currentRisk: 85, projectedRisk: 70, riskReduction: 15, confidence: 85, timeToEffect: '1-2 days' },
    { intervention: 'Medication Dose Reduction', currentRisk: 85, projectedRisk: 60, riskReduction: 25, confidence: 80, timeToEffect: '1-2 weeks' },
    { intervention: 'Alternative Medication', currentRisk: 85, projectedRisk: 55, riskReduction: 30, confidence: 70, timeToEffect: '2-3 weeks' },
    { intervention: 'Combined Interventions', currentRisk: 85, projectedRisk: 45, riskReduction: 40, confidence: 72, timeToEffect: '3-4 weeks' },
  ],
  '4': [
    { intervention: 'No Intervention', currentRisk: 68, projectedRisk: 78, riskReduction: -10, confidence: 82, timeToEffect: 'N/A' },
    { intervention: 'Hospital Transport Service', currentRisk: 68, projectedRisk: 45, riskReduction: 23, confidence: 88, timeToEffect: 'Immediate' },
    { intervention: 'Telehealth Sessions', currentRisk: 68, projectedRisk: 50, riskReduction: 18, confidence: 75, timeToEffect: '1 week' },
    { intervention: 'Home Visit Program', currentRisk: 68, projectedRisk: 42, riskReduction: 26, confidence: 80, timeToEffect: '1-2 weeks' },
  ],
  '7': [
    { intervention: 'No Intervention', currentRisk: 72, projectedRisk: 85, riskReduction: -13, confidence: 88, timeToEffect: 'N/A' },
    { intervention: 'Insurance Re-enrollment', currentRisk: 72, projectedRisk: 40, riskReduction: 32, confidence: 90, timeToEffect: '2-4 weeks' },
    { intervention: 'Emergency Financial Aid', currentRisk: 72, projectedRisk: 48, riskReduction: 24, confidence: 85, timeToEffect: '1 week' },
    { intervention: 'Medication Assistance Program', currentRisk: 72, projectedRisk: 52, riskReduction: 20, confidence: 82, timeToEffect: '1-2 weeks' },
  ],
};

// Helper functions
export function getRiskColor(category: RiskCategory): string {
  switch (category) {
    case 'critical': return 'text-red-600 bg-red-100 dark:bg-red-900/30';
    case 'high': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30';
    case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
    case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900/30';
  }
}

export function getRiskBadgeVariant(category: RiskCategory): 'destructive' | 'default' | 'secondary' | 'outline' {
  switch (category) {
    case 'critical': return 'destructive';
    case 'high': return 'destructive';
    case 'medium': return 'default';
    case 'low': return 'secondary';
  }
}

export function getAlertPriorityColor(priority: AlertPriority): string {
  switch (priority) {
    case 'critical': return 'text-red-600 bg-red-100 dark:bg-red-900/30 border-red-300';
    case 'high': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30 border-orange-300';
    case 'moderate': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300';
    case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900/30 border-green-300';
  }
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
