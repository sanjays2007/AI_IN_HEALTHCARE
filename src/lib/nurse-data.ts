// Nurse Portal Data Types and Mock Data

export interface NurseStats {
  assignedPatients: number;
  pendingFollowUps: number;
  completedToday: number;
  criticalAlerts: number;
  highRiskPatients: number;
  appointmentsToday: number;
}

export interface PatientAssignment {
  id: string;
  patientId: string;
  patientName: string;
  age: number;
  gender: string;
  condition: string;
  riskScore: number;
  lastVisit: string;
  nextFollowUp: string;
  status: 'stable' | 'needs-attention' | 'critical';
  phone: string;
  adherenceRate: number;
  assignedDoctor: string;
}

export interface FollowUp {
  id: string;
  patientId: string;
  patientName: string;
  type: 'phone' | 'visit' | 'message';
  scheduledDate: string;
  scheduledTime: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'completed' | 'missed' | 'rescheduled';
  notes: string;
  reason: string;
}

export interface VitalRecord {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  bloodPressure: string;
  heartRate: number;
  temperature: number;
  weight: number;
  oxygenSaturation: number;
  notes: string;
  recordedBy: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  time: string;
  duration: number;
  type: 'checkup' | 'medication' | 'counseling' | 'vitals';
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  doctor: string;
  room: string;
}

export interface CommunicationLog {
  id: string;
  patientId: string;
  patientName: string;
  type: 'call' | 'sms' | 'email' | 'in-person';
  date: string;
  time: string;
  duration?: number;
  summary: string;
  outcome: 'successful' | 'no-answer' | 'callback-requested' | 'issue-resolved';
  nurseId: string;
}

// Mock Data
export const mockNurseStats: NurseStats = {
  assignedPatients: 42,
  pendingFollowUps: 8,
  completedToday: 12,
  criticalAlerts: 3,
  highRiskPatients: 7,
  appointmentsToday: 15,
};

export const mockPatientAssignments: PatientAssignment[] = [
  {
    id: '1',
    patientId: 'PT-1001',
    patientName: 'Ramesh Kumar',
    age: 45,
    gender: 'Male',
    condition: 'Type 2 Diabetes',
    riskScore: 78,
    lastVisit: '2026-02-15',
    nextFollowUp: '2026-02-20',
    status: 'needs-attention',
    phone: '+91 98765 43210',
    adherenceRate: 65,
    assignedDoctor: 'Dr. Sharma',
  },
  {
    id: '2',
    patientId: 'PT-1002',
    patientName: 'Sunita Devi',
    age: 52,
    gender: 'Female',
    condition: 'Hypertension',
    riskScore: 45,
    lastVisit: '2026-02-18',
    nextFollowUp: '2026-02-25',
    status: 'stable',
    phone: '+91 98765 43211',
    adherenceRate: 88,
    assignedDoctor: 'Dr. Patel',
  },
  {
    id: '3',
    patientId: 'PT-1003',
    patientName: 'Mohan Singh',
    age: 61,
    gender: 'Male',
    condition: 'TB Treatment',
    riskScore: 92,
    lastVisit: '2026-02-10',
    nextFollowUp: '2026-02-19',
    status: 'critical',
    phone: '+91 98765 43212',
    adherenceRate: 42,
    assignedDoctor: 'Dr. Gupta',
  },
  {
    id: '4',
    patientId: 'PT-1004',
    patientName: 'Priya Sharma',
    age: 38,
    gender: 'Female',
    condition: 'Cancer Chemotherapy',
    riskScore: 68,
    lastVisit: '2026-02-17',
    nextFollowUp: '2026-02-22',
    status: 'needs-attention',
    phone: '+91 98765 43213',
    adherenceRate: 75,
    assignedDoctor: 'Dr. Sharma',
  },
  {
    id: '5',
    patientId: 'PT-1005',
    patientName: 'Anil Verma',
    age: 55,
    gender: 'Male',
    condition: 'Dialysis',
    riskScore: 35,
    lastVisit: '2026-02-19',
    nextFollowUp: '2026-02-26',
    status: 'stable',
    phone: '+91 98765 43214',
    adherenceRate: 92,
    assignedDoctor: 'Dr. Kumar',
  },
  {
    id: '6',
    patientId: 'PT-1006',
    patientName: 'Lakshmi Rao',
    age: 48,
    gender: 'Female',
    condition: 'Mental Health',
    riskScore: 85,
    lastVisit: '2026-02-12',
    nextFollowUp: '2026-02-19',
    status: 'critical',
    phone: '+91 98765 43215',
    adherenceRate: 55,
    assignedDoctor: 'Dr. Mehta',
  },
];

export const mockFollowUps: FollowUp[] = [
  {
    id: '1',
    patientId: 'PT-1003',
    patientName: 'Mohan Singh',
    type: 'phone',
    scheduledDate: '2026-02-19',
    scheduledTime: '09:00',
    priority: 'urgent',
    status: 'pending',
    notes: 'Missed last 3 doses, needs immediate follow-up',
    reason: 'Medication adherence check',
  },
  {
    id: '2',
    patientId: 'PT-1006',
    patientName: 'Lakshmi Rao',
    type: 'visit',
    scheduledDate: '2026-02-19',
    scheduledTime: '10:30',
    priority: 'high',
    status: 'pending',
    notes: 'Showing signs of depression, family reported concerns',
    reason: 'Mental health assessment',
  },
  {
    id: '3',
    patientId: 'PT-1001',
    patientName: 'Ramesh Kumar',
    type: 'phone',
    scheduledDate: '2026-02-20',
    scheduledTime: '11:00',
    priority: 'medium',
    status: 'pending',
    notes: 'Blood sugar levels fluctuating',
    reason: 'Routine follow-up',
  },
  {
    id: '4',
    patientId: 'PT-1004',
    patientName: 'Priya Sharma',
    type: 'message',
    scheduledDate: '2026-02-19',
    scheduledTime: '14:00',
    priority: 'medium',
    status: 'completed',
    notes: 'Sent medication reminder',
    reason: 'Pre-chemo reminder',
  },
  {
    id: '5',
    patientId: 'PT-1002',
    patientName: 'Sunita Devi',
    type: 'phone',
    scheduledDate: '2026-02-21',
    scheduledTime: '09:30',
    priority: 'low',
    status: 'pending',
    notes: 'Regular check-in call',
    reason: 'Weekly follow-up',
  },
];

export const mockTodayAppointments: Appointment[] = [
  {
    id: '1',
    patientId: 'PT-1003',
    patientName: 'Mohan Singh',
    time: '09:00',
    duration: 30,
    type: 'medication',
    status: 'scheduled',
    doctor: 'Dr. Gupta',
    room: 'Room 101',
  },
  {
    id: '2',
    patientId: 'PT-1006',
    patientName: 'Lakshmi Rao',
    time: '10:30',
    duration: 45,
    type: 'counseling',
    status: 'scheduled',
    doctor: 'Dr. Mehta',
    room: 'Room 205',
  },
  {
    id: '3',
    patientId: 'PT-1001',
    patientName: 'Ramesh Kumar',
    time: '11:30',
    duration: 20,
    type: 'vitals',
    status: 'scheduled',
    doctor: 'Dr. Sharma',
    room: 'Room 102',
  },
  {
    id: '4',
    patientId: 'PT-1004',
    patientName: 'Priya Sharma',
    time: '14:00',
    duration: 60,
    type: 'checkup',
    status: 'scheduled',
    doctor: 'Dr. Sharma',
    room: 'Room 301',
  },
  {
    id: '5',
    patientId: 'PT-1005',
    patientName: 'Anil Verma',
    time: '15:30',
    duration: 30,
    type: 'vitals',
    status: 'scheduled',
    doctor: 'Dr. Kumar',
    room: 'Room 102',
  },
];

export const mockCommunicationLogs: CommunicationLog[] = [
  {
    id: '1',
    patientId: 'PT-1001',
    patientName: 'Ramesh Kumar',
    type: 'call',
    date: '2026-02-18',
    time: '10:30',
    duration: 8,
    summary: 'Discussed medication schedule, patient confirmed understanding',
    outcome: 'successful',
    nurseId: 'N-001',
  },
  {
    id: '2',
    patientId: 'PT-1003',
    patientName: 'Mohan Singh',
    type: 'call',
    date: '2026-02-17',
    time: '11:00',
    duration: 0,
    summary: 'Attempted follow-up call, no answer',
    outcome: 'no-answer',
    nurseId: 'N-001',
  },
  {
    id: '3',
    patientId: 'PT-1002',
    patientName: 'Sunita Devi',
    type: 'sms',
    date: '2026-02-18',
    time: '09:00',
    summary: 'Sent appointment reminder for Feb 25',
    outcome: 'successful',
    nurseId: 'N-001',
  },
  {
    id: '4',
    patientId: 'PT-1004',
    patientName: 'Priya Sharma',
    type: 'in-person',
    date: '2026-02-17',
    time: '14:30',
    duration: 15,
    summary: 'Pre-chemo counseling, discussed side effect management',
    outcome: 'successful',
    nurseId: 'N-001',
  },
];

// Helper functions
export const getStatusColor = (status: PatientAssignment['status']) => {
  switch (status) {
    case 'stable': return 'bg-green-100 text-green-800';
    case 'needs-attention': return 'bg-yellow-100 text-yellow-800';
    case 'critical': return 'bg-red-100 text-red-800';
  }
};

export const getPriorityColor = (priority: FollowUp['priority']) => {
  switch (priority) {
    case 'low': return 'bg-gray-100 text-gray-800';
    case 'medium': return 'bg-blue-100 text-blue-800';
    case 'high': return 'bg-orange-100 text-orange-800';
    case 'urgent': return 'bg-red-100 text-red-800';
  }
};

export const getFollowUpStatusColor = (status: FollowUp['status']) => {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'completed': return 'bg-green-100 text-green-800';
    case 'missed': return 'bg-red-100 text-red-800';
    case 'rescheduled': return 'bg-blue-100 text-blue-800';
  }
};

export const getAppointmentTypeColor = (type: Appointment['type']) => {
  switch (type) {
    case 'checkup': return 'bg-blue-100 text-blue-800';
    case 'medication': return 'bg-purple-100 text-purple-800';
    case 'counseling': return 'bg-pink-100 text-pink-800';
    case 'vitals': return 'bg-green-100 text-green-800';
  }
};

export const getRiskColor = (score: number) => {
  if (score >= 70) return 'text-red-600';
  if (score >= 40) return 'text-yellow-600';
  return 'text-green-600';
};
