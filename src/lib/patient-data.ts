// Patient Data Types and Mock Data

// Appointment Types
export interface Appointment {
  id: string;
  type: string;
  doctor: string;
  department: string;
  date: string;
  time: string;
  location: string;
  status: 'Scheduled' | 'Confirmed' | 'Completed' | 'Cancelled' | 'Rescheduled';
  isVirtual: boolean;
  notes?: string;
  travelTime?: string;
  transportAssistance?: boolean;
}

export const mockAppointments: Appointment[] = [
  {
    id: '1',
    type: 'Check-up',
    doctor: 'Dr. Sarah Evans',
    department: 'Internal Medicine',
    date: '2026-02-25',
    time: '10:00 AM',
    location: 'Building A, Room 205',
    status: 'Scheduled',
    isVirtual: false,
    notes: 'Annual physical examination',
  },
  {
    id: '2',
    type: 'Lab Work',
    doctor: 'Lab Services',
    department: 'Pathology',
    date: '2026-03-01',
    time: '9:00 AM',
    location: 'Building B, Lab Wing',
    status: 'Confirmed',
    isVirtual: false,
    notes: 'Fasting required - no food 12 hours before',
  },
  {
    id: '3',
    type: 'Follow-up',
    doctor: 'Dr. Michael Chen',
    department: 'Cardiology',
    date: '2026-03-10',
    time: '2:30 PM',
    location: 'Virtual',
    status: 'Scheduled',
    isVirtual: true,
  },
  {
    id: '4',
    type: 'Consultation',
    doctor: 'Dr. Sarah Evans',
    department: 'Internal Medicine',
    date: '2026-01-15',
    time: '11:00 AM',
    location: 'Building A, Room 205',
    status: 'Completed',
    isVirtual: false,
  },
  {
    id: '5',
    type: 'Therapy Session',
    doctor: 'Dr. Lisa Wong',
    department: 'Mental Health',
    date: '2026-01-08',
    time: '3:00 PM',
    location: 'Building C, Suite 102',
    status: 'Completed',
    isVirtual: false,
  },
];

// Support Request Types
export interface SupportRequest {
  id: string;
  category: string;
  subject: string;
  message: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  createdAt: string;
  updatedAt: string;
  responses?: { from: string; message: string; date: string }[];
}

export const mockSupportRequests: SupportRequest[] = [
  {
    id: '1',
    category: 'Medication',
    subject: 'Question about dosage timing',
    message: 'I am confused about when to take my Metformin. Should it be before or after meals?',
    status: 'Resolved',
    createdAt: '2026-02-10',
    updatedAt: '2026-02-11',
    responses: [
      {
        from: 'Nurse Smith',
        message: 'Metformin should be taken with meals to reduce stomach upset. Take it with your breakfast and dinner.',
        date: '2026-02-11',
      },
    ],
  },
  {
    id: '2',
    category: 'Appointment',
    subject: 'Need to reschedule my appointment',
    message: 'I have a conflict with my February 25th appointment. Can I reschedule?',
    status: 'Open',
    createdAt: '2026-02-18',
    updatedAt: '2026-02-18',
  },
];

// Side Effects Types
export interface SideEffectReport {
  id: string;
  medication: string;
  symptoms: string[];
  severity: 'Mild' | 'Moderate' | 'Severe';
  startDate: string;
  description: string;
  status: 'Reported' | 'Under Review' | 'Resolved';
  doctorNotes?: string;
}

export const mockSideEffects: SideEffectReport[] = [
  {
    id: '1',
    medication: 'Metformin',
    symptoms: ['Nausea', 'Stomach upset'],
    severity: 'Mild',
    startDate: '2026-02-05',
    description: 'Experiencing mild nausea after taking medication in the morning.',
    status: 'Resolved',
    doctorNotes: 'Recommended taking with food. Symptoms should improve.',
  },
  {
    id: '2',
    medication: 'Lisinopril',
    symptoms: ['Dizziness', 'Fatigue'],
    severity: 'Moderate',
    startDate: '2026-02-15',
    description: 'Feeling dizzy when standing up quickly, especially in the morning.',
    status: 'Under Review',
  },
];

export const mockMedications = [
  { id: '1', name: 'Metformin', dosage: '500mg' },
  { id: '2', name: 'Lisinopril', dosage: '10mg' },
  { id: '3', name: 'Aspirin', dosage: '81mg' },
  { id: '4', name: 'Vitamin D', dosage: '1000IU' },
];

export const symptomOptions = [
  'Nausea',
  'Headache',
  'Dizziness',
  'Fatigue',
  'Stomach upset',
  'Loss of appetite',
  'Insomnia',
  'Dry mouth',
  'Muscle pain',
  'Skin rash',
  'Other',
];

// Mood Entry Types
export interface MoodEntry {
  id: string;
  date: string;
  moodScore: number;
  energyLevel: number;
  sleepQuality: number;
  anxietyLevel: number;
  notes?: string;
  activities?: string[];
}

export const mockMoodEntries: MoodEntry[] = [
  {
    id: '1',
    date: '2026-02-18',
    moodScore: 7,
    energyLevel: 6,
    sleepQuality: 7,
    anxietyLevel: 3,
    notes: 'Good day overall, had a nice walk in the park.',
    activities: ['Exercise', 'Social activity'],
  },
  {
    id: '2',
    date: '2026-02-17',
    moodScore: 5,
    energyLevel: 4,
    sleepQuality: 5,
    anxietyLevel: 5,
    notes: 'Felt a bit tired, did not sleep well last night.',
    activities: ['Work'],
  },
  {
    id: '3',
    date: '2026-02-16',
    moodScore: 8,
    energyLevel: 7,
    sleepQuality: 8,
    anxietyLevel: 2,
    notes: 'Great day! Met with friends and felt very positive.',
    activities: ['Social activity', 'Hobbies'],
  },
  {
    id: '4',
    date: '2026-02-15',
    moodScore: 6,
    energyLevel: 5,
    sleepQuality: 6,
    anxietyLevel: 4,
    activities: ['Work', 'Exercise'],
  },
];

// Patient Profile
export interface PatientProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  insuranceProvider: string;
  insuranceId: string;
  primaryDoctor: string;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
    appointmentReminders: boolean;
    medicationReminders: boolean;
    healthTips: boolean;
  };
}

export const mockPatientProfile: PatientProfile = {
  id: '3',
  name: 'John Patient',
  email: 'patient@example.com',
  phone: '+1 (555) 123-4567',
  dateOfBirth: '1985-06-15',
  address: '123 Main Street, Anytown, ST 12345',
  emergencyContact: {
    name: 'Jane Patient',
    relationship: 'Spouse',
    phone: '+1 (555) 987-6543',
  },
  insuranceProvider: 'HealthCare Plus',
  insuranceId: 'HCP-2026-789012',
  primaryDoctor: 'Dr. Sarah Evans',
  notifications: {
    email: true,
    sms: true,
    push: true,
    appointmentReminders: true,
    medicationReminders: true,
    healthTips: false,
  },
};

// Treatment History Types
export interface TreatmentEvent {
  id: string;
  date: string;
  type: 'Diagnosis' | 'Medication' | 'Procedure' | 'Lab Result' | 'Consultation' | 'Hospitalization';
  title: string;
  description: string;
  doctor?: string;
  department?: string;
  attachments?: string[];
}

export const mockTreatmentHistory: TreatmentEvent[] = [
  {
    id: '1',
    date: '2026-02-15',
    type: 'Lab Result',
    title: 'Blood Work Results',
    description: 'Complete blood count and metabolic panel. All values within normal range.',
    doctor: 'Lab Services',
    department: 'Pathology',
  },
  {
    id: '2',
    date: '2026-02-01',
    type: 'Consultation',
    title: 'Cardiology Follow-up',
    description: 'Routine heart check. Blood pressure stable. Continue current medication.',
    doctor: 'Dr. Michael Chen',
    department: 'Cardiology',
  },
  {
    id: '3',
    date: '2026-01-15',
    type: 'Medication',
    title: 'New Prescription: Lisinopril',
    description: 'Started on Lisinopril 10mg for blood pressure management.',
    doctor: 'Dr. Sarah Evans',
    department: 'Internal Medicine',
  },
  {
    id: '4',
    date: '2025-12-10',
    type: 'Diagnosis',
    title: 'Type 2 Diabetes Diagnosis',
    description: 'Diagnosed with Type 2 Diabetes. Started on Metformin.',
    doctor: 'Dr. Sarah Evans',
    department: 'Internal Medicine',
  },
  {
    id: '5',
    date: '2025-11-20',
    type: 'Lab Result',
    title: 'A1C Test',
    description: 'A1C level at 7.2%. Indicates pre-diabetic condition.',
    doctor: 'Lab Services',
    department: 'Pathology',
  },
];

// Financial Info Types
export interface FinancialInfo {
  totalCost: number;
  paidAmount: number;
  outstandingBalance: number;
  financialAidStatus: 'Not Applied' | 'Pending' | 'Approved' | 'Rejected';
  installmentPlan: boolean;
  nextPaymentDue: string;
  nextPaymentAmount: number;
  eligibleSchemes: string[];
  documents: {
    name: string;
    status: 'Required' | 'Pending' | 'Verified' | 'Rejected';
  }[];
  balance: number;
  lastPayment: { amount: number; date: string };
  insuranceCoverage: number;
  deductible: { used: number; total: number };
  bills: {
    id: string;
    date: string;
    description: string;
    amount: number;
    status: 'Paid' | 'Pending' | 'Overdue';
    insuranceCovered: number;
  }[];
  assistancePrograms: {
    id: string;
    name: string;
    status: 'Active' | 'Pending' | 'Eligible';
    benefit: string;
  }[];
}

export const mockFinancialInfo: FinancialInfo = {
  totalCost: 12500,
  paidAmount: 8750,
  outstandingBalance: 3750,
  financialAidStatus: 'Not Applied',
  installmentPlan: true,
  nextPaymentDue: '2026-03-01',
  nextPaymentAmount: 375,
  eligibleSchemes: [
    'TB Treatment Subsidy Program',
    'State Medical Assistance Fund',
    'Hospital Charity Care Program',
    'Patient Assistance Foundation',
  ],
  documents: [
    { name: 'Proof of Income', status: 'Verified' },
    { name: 'ID/Passport Copy', status: 'Verified' },
    { name: 'Insurance Card', status: 'Pending' },
    { name: 'Bank Statement', status: 'Required' },
  ],
  balance: 245.00,
  lastPayment: { amount: 150.00, date: '2026-02-01' },
  insuranceCoverage: 80,
  deductible: { used: 1200, total: 2000 },
  bills: [
    {
      id: '1',
      date: '2026-02-15',
      description: 'Lab Work - Blood Panel',
      amount: 85.00,
      status: 'Pending',
      insuranceCovered: 340.00,
    },
    {
      id: '2',
      date: '2026-02-01',
      description: 'Office Visit - Dr. Evans',
      amount: 45.00,
      status: 'Pending',
      insuranceCovered: 180.00,
    },
    {
      id: '3',
      date: '2026-01-15',
      description: 'Cardiology Consultation',
      amount: 115.00,
      status: 'Paid',
      insuranceCovered: 460.00,
    },
  ],
  assistancePrograms: [
    {
      id: '1',
      name: 'Medication Assistance Program',
      status: 'Active',
      benefit: '50% off prescription costs',
    },
    {
      id: '2',
      name: 'Transportation Support',
      status: 'Eligible',
      benefit: 'Free rides to appointments',
    },
  ],
};

// Education Content Types
export interface EducationContent {
  id: string;
  title: string;
  category: string;
  type: 'Article' | 'Video' | 'Guide' | 'FAQ';
  summary: string;
  readTime: string;
  isRead: boolean;
  isRecommended: boolean;
  content?: string;
}

export const mockEducationContent: EducationContent[] = [
  {
    id: '1',
    title: 'Managing Type 2 Diabetes',
    category: 'Diabetes',
    type: 'Guide',
    summary: 'Comprehensive guide on lifestyle changes, diet, and medication management for Type 2 Diabetes.',
    readTime: '8 min',
    isRead: true,
    isRecommended: true,
  },
  {
    id: '2',
    title: 'Understanding Blood Pressure',
    category: 'Heart Health',
    type: 'Article',
    summary: 'Learn about blood pressure, what the numbers mean, and how to keep it under control.',
    readTime: '5 min',
    isRead: false,
    isRecommended: true,
  },
  {
    id: '3',
    title: 'Medication Safety Tips',
    category: 'Medications',
    type: 'Article',
    summary: 'Important tips for taking your medications safely and effectively.',
    readTime: '4 min',
    isRead: false,
    isRecommended: false,
  },
  {
    id: '4',
    title: 'Healthy Eating on a Budget',
    category: 'Nutrition',
    type: 'Guide',
    summary: 'Practical tips for maintaining a healthy diet without breaking the bank.',
    readTime: '6 min',
    isRead: false,
    isRecommended: true,
  },
  {
    id: '5',
    title: 'Exercise for Beginners',
    category: 'Fitness',
    type: 'Article',
    summary: 'Gentle exercises suitable for all fitness levels.',
    readTime: '5 min',
    isRead: true,
    isRecommended: false,
  },
  {
    id: '6',
    title: 'Understanding Your TB Treatment',
    category: 'Treatment Info',
    type: 'Guide',
    summary: 'Learn about the phases of TB treatment, what to expect, and how to stay on track.',
    readTime: '10 min',
    isRead: false,
    isRecommended: true,
  },
  {
    id: '7',
    title: 'Managing Treatment Side Effects',
    category: 'Side Effects',
    type: 'Article',
    summary: 'Common side effects of TB medications and how to manage them effectively.',
    readTime: '6 min',
    isRead: false,
    isRecommended: true,
  },
  {
    id: '8',
    title: 'TB Myths vs Facts',
    category: 'Myths vs Facts',
    type: 'Article',
    summary: 'Debunking common misconceptions about tuberculosis and its treatment.',
    readTime: '4 min',
    isRead: false,
    isRecommended: false,
  },
];

// Smart Alert Types
export interface SmartAlert {
  id: string;
  type: 'reminder' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  date: string;
  isRead: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

export const mockSmartAlerts: SmartAlert[] = [
  {
    id: '1',
    type: 'reminder',
    title: 'Upcoming Appointment',
    message: 'You have an appointment with Dr. Evans on February 25th at 10:00 AM.',
    date: '2026-02-19',
    isRead: false,
    actionUrl: '/patient/appointments',
    actionLabel: 'View Details',
  },
  {
    id: '2',
    type: 'info',
    title: 'New Education Content',
    message: 'A new video about blood pressure management has been added to your recommended content.',
    date: '2026-02-18',
    isRead: false,
    actionUrl: '/patient/education',
    actionLabel: 'Watch Now',
  },
  {
    id: '3',
    type: 'warning',
    title: 'Medication Reminder',
    message: 'Don\'t forget to take your evening Metformin dose.',
    date: '2026-02-18',
    isRead: true,
  },
  {
    id: '4',
    type: 'success',
    title: 'Lab Results Available',
    message: 'Your recent blood work results are now available. All values are within normal range.',
    date: '2026-02-15',
    isRead: true,
    actionUrl: '/patient/history',
    actionLabel: 'View Results',
  },
  {
    id: '5',
    type: 'info',
    title: 'Financial Assistance Approved',
    message: 'Your application for the Medication Assistance Program has been approved.',
    date: '2026-02-10',
    isRead: true,
    actionUrl: '/patient/financial',
    actionLabel: 'View Benefits',
  },
];
