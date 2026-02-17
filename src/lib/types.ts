import type { LucideIcon } from 'lucide-react';

export type RiskCategory = 'Low' | 'Medium' | 'High' | 'Critical';

export type RiskFactor = {
  name: 'Financial' | 'Side Effects' | 'Emotional' | 'Travel' | 'Engagement';
  score: number;
};

export type BehaviorEvent = {
  id: string;
  date: string;
  type: 'Appointment' | 'Payment' | 'SideEffect' | 'Mood' | 'Medication';
  description: string;
  details?: string;
  icon: LucideIcon;
};

export type Patient = {
  id: string;
  name: string;
  avatarUrl: string;
  diagnosis: string;
  riskScore: number;
  riskCategory: RiskCategory;
  primaryRiskFactor: RiskFactor['name'];
  lastVisit: string;
  missedAppointments: number;
  treatmentType: 'TB' | 'Dialysis' | 'Chemo' | 'Mental Health' | 'Substance Use';
  age: number;
  treatmentPhase: string;
  medicationPlan: string;
  labProgress: string;
  completionPercentage: number;
  riskBreakdown: RiskFactor[];
  behavioralTimeline: BehaviorEvent[];
};

export type Intervention = {
  type: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  riskFactorAddressed: string;
};

export type Department = 'TB' | 'Dialysis' | 'Chemo' | 'Mental Health';
