'use server';
/**
 * @fileOverview Local template-based engine for generating personalized,
 * empathetic nudges and alerts for patients. No API keys required.
 */

import { generateNudge } from '@/ai/local-engine';

export interface PatientNudgeInput {
  patientName: string;
  treatmentPhase: string;
  lastActionDetails: string;
  specificContext?: string;
  tone: 'supportive' | 'urgent' | 'informative' | 'motivational';
}

export interface PatientNudgeOutput {
  nudgeMessage: string;
}

export async function generatePatientNudge(
  input: PatientNudgeInput
): Promise<PatientNudgeOutput> {
  const nudgeMessage = generateNudge(
    input.patientName,
    input.treatmentPhase,
    input.lastActionDetails,
    input.tone,
    input.specificContext
  );
  return { nudgeMessage };
}
