'use server';
/**
 * @fileOverview Local rule-based + template engine for generating a narrative summary
 * of a patient's primary dropout risk factors. No API keys required.
 */

import { generateRiskNarrative } from '@/ai/local-engine';

export interface DoctorRiskSummaryGenerationInput {
  patientName: string;
  diagnosis: string;
  overallRiskScore: number;
  riskFactors: Array<{ factor: string; percentage: number }>;
  behavioralTimelineSummary: string;
}

export interface DoctorRiskSummaryGenerationOutput {
  summary: string;
}

export async function generateDoctorRiskSummary(
  input: DoctorRiskSummaryGenerationInput
): Promise<DoctorRiskSummaryGenerationOutput> {
  const summary = generateRiskNarrative(
    input.patientName,
    input.diagnosis,
    input.overallRiskScore,
    input.riskFactors,
    input.behavioralTimelineSummary
  );
  return { summary };
}
