import type { Patient, RiskCategory, BehaviorEvent } from '@/lib/types';
import {
  CalendarX,
  CreditCard,
  Frown,
  Pill,
  Thermometer,
  Smile,
  Meh,
  CalendarCheck,
} from 'lucide-react';

const behavioralTimeline1: BehaviorEvent[] = [
  { id: 'b1', date: '2024-07-15', type: 'Appointment', description: 'Appointment gap increased', details: 'Rescheduled for the 3rd time', icon: CalendarX },
  { id: 'b2', date: '2024-07-10', type: 'Payment', description: 'Payment delay', details: 'Invoice #123 due July 5th', icon: CreditCard },
  { id: 'b3', date: '2024-07-05', type: 'SideEffect', description: 'Side effect reported', details: 'Nausea, Severity: 3/5', icon: Thermometer },
  { id: 'b4', date: '2024-07-01', type: 'Mood', description: 'Mood decline', details: 'Reported feeling "Overwhelmed"', icon: Frown },
  { id: 'b5', date: '2024-06-28', type: 'Medication', description: 'Missed dose', details: 'Forgot morning medication', icon: Pill },
];

const behavioralTimeline2: BehaviorEvent[] = [
  { id: 'b6', date: '2024-07-18', type: 'Mood', description: 'Positive mood', details: 'Reported feeling "Good"', icon: Smile },
  { id: 'b7', date: '2024-07-12', type: 'Appointment', description: 'Attended appointment', details: 'Follow-up with Dr. Smith', icon: CalendarCheck },
  { id: 'b8', date: '2024-07-08', type: 'Medication', description: 'Consistent medication', details: '14-day streak', icon: Pill },
];

const behavioralTimeline3: BehaviorEvent[] = [
    { id: 'b9', date: '2024-07-14', type: 'SideEffect', description: 'Severe side effect', details: 'Fatigue, Severity: 4/5', icon: Thermometer },
    { id: 'b10', date: '2024-07-09', type: 'Mood', description: 'Neutral mood', details: 'Reported feeling "Neutral"', icon: Meh },
];


export const patients: Patient[] = [
  {
    id: 'p001',
    name: 'Anjali Sharma',
    avatarUrl: 'https://picsum.photos/seed/avatar1/100/100',
    diagnosis: 'Tuberculosis',
    riskScore: 82,
    riskCategory: 'Critical',
    primaryRiskFactor: 'Financial',
    lastVisit: '2024-06-15',
    missedAppointments: 3,
    treatmentType: 'TB',
    age: 34,
    incomeLevel: 'Low',
    treatmentPhase: 'Intensive Phase',
    medicationPlan: 'Isoniazid, Rifampin',
    labProgress: 'Sputum smear positive',
    completionPercentage: 20,
    riskBreakdown: [
      { name: 'Financial', score: 40 },
      { name: 'Side Effects', score: 25 },
      { name: 'Emotional', score: 15 },
      { name: 'Travel', score: 10 },
      { name: 'Engagement', score: 10 },
    ],
    behavioralTimeline: behavioralTimeline1,
  },
  {
    id: 'p002',
    name: 'Raj Patel',
    avatarUrl: 'https://picsum.photos/seed/avatar2/100/100',
    diagnosis: 'Major Depressive Disorder',
    riskScore: 65,
    riskCategory: 'High',
    primaryRiskFactor: 'Emotional',
    lastVisit: '2024-07-01',
    missedAppointments: 1,
    treatmentType: 'Mental Health',
    age: 28,
    incomeLevel: 'Medium',
    treatmentPhase: 'Mid-treatment',
    medicationPlan: 'Sertraline 100mg',
    labProgress: 'PHQ-9 score: 14',
    completionPercentage: 50,
    riskBreakdown: [
        { name: 'Emotional', score: 50 },
        { name: 'Engagement', score: 20 },
        { name: 'Side Effects', score: 15 },
        { name: 'Financial', score: 10 },
        { name: 'Travel', score: 5 },
    ],
    behavioralTimeline: behavioralTimeline3,
  },
  {
    id: 'p003',
    name: 'Priya Singh',
    avatarUrl: 'https://picsum.photos/seed/avatar3/100/100',
    diagnosis: 'End-Stage Renal Disease',
    riskScore: 45,
    riskCategory: 'Medium',
    primaryRiskFactor: 'Side Effects',
    lastVisit: '2024-07-10',
    missedAppointments: 0,
    treatmentType: 'Dialysis',
    age: 52,
    incomeLevel: 'Medium',
    treatmentPhase: 'Maintenance',
    medicationPlan: 'Hemodialysis 3x/week',
    labProgress: 'Creatinine stable',
    completionPercentage: 75,
    riskBreakdown: [
      { name: 'Side Effects', score: 35 },
      { name: 'Travel', score: 25 },
      { name: 'Emotional', score: 20 },
      { name: 'Financial', score: 15 },
      { name: 'Engagement', score: 5 },
    ],
    behavioralTimeline: behavioralTimeline2,
  },
  {
    id: 'p004',
    name: 'Amit Kumar',
    avatarUrl: 'https://picsum.photos/seed/avatar4/100/100',
    diagnosis: 'Breast Cancer',
    riskScore: 20,
    riskCategory: 'Low',
    primaryRiskFactor: 'Engagement',
    lastVisit: '2024-07-18',
    missedAppointments: 0,
    treatmentType: 'Chemo',
    age: 45,
    incomeLevel: 'High',
    treatmentPhase: 'Post-chemotherapy',
    medicationPlan: 'Tamoxifen',
    labProgress: 'Tumor markers normal',
    completionPercentage: 95,
     riskBreakdown: [
      { name: 'Engagement', score: 30 },
      { name: 'Emotional', score: 25 },
      { name: 'Side Effects', score: 20 },
      { name: 'Financial', score: 15 },
      { name: 'Travel', score: 10 },
    ],
    behavioralTimeline: behavioralTimeline2,
  },
  {
    id: 'p005',
    name: 'Sunita Devi',
    avatarUrl: 'https://picsum.photos/seed/avatar5/100/100',
    diagnosis: 'Alcohol Use Disorder',
    riskScore: 78,
    riskCategory: 'Critical',
    primaryRiskFactor: 'Emotional',
    lastVisit: '2024-06-20',
    missedAppointments: 2,
    treatmentType: 'Substance Use',
    age: 41,
    incomeLevel: 'Low',
    treatmentPhase: 'Early Recovery',
    medicationPlan: 'Naltrexone, Group Therapy',
    labProgress: 'Relapse risk high',
    completionPercentage: 15,
     riskBreakdown: [
      { name: 'Emotional', score: 45 },
      { name: 'Engagement', score: 25 },
      { name: 'Financial', score: 15 },
      { name: 'Side Effects', score: 10 },
      { name: 'Travel', score: 5 },
    ],
    behavioralTimeline: behavioralTimeline1,
  },
];

export const getRiskCategoryColor = (category: RiskCategory) => {
  switch (category) {
    case 'Critical':
      return 'border-red-500/50 bg-red-500/10';
    case 'High':
      return 'border-yellow-500/50 bg-yellow-500/10';
    case 'Medium':
      return 'border-blue-500/50 bg-blue-500/10';
    case 'Low':
      return 'border-green-500/50 bg-green-500/10';
    default:
      return 'border-gray-500/50 bg-gray-500/10';
  }
};
