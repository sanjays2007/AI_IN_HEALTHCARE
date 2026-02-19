'use server';
/**
 * @fileOverview Local template-based engine for generating personalized
 * educational content for patients. No API keys required.
 */

import { generateEducation } from '@/ai/local-engine';

export interface PersonalizedEducationInput {
  patientName: string;
  diagnosis: string;
  riskFactors: string[];
  language?: string;
}

export interface PersonalizedEducationOutput {
  title: string;
  content: string;
}

export async function generatePersonalizedEducation(
  input: PersonalizedEducationInput
): Promise<PersonalizedEducationOutput> {
  return generateEducation(
    input.patientName,
    input.diagnosis,
    input.riskFactors,
    input.language ?? 'English'
  );
}
