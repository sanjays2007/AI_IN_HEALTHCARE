'use server';
/**
 * @fileOverview Local knowledge-base engine for generating financial
 * assistance guidance for patients. No API keys required.
 */

import { generateFinancialGuidance } from '@/ai/local-engine';

export interface FinancialAssistanceInput {
  patientName: string;
  diagnosis: string;
  incomeLevel: 'Low' | 'Medium' | 'High';
  primaryRiskFactor: string;
}

export interface FinancialAssistanceOutput {
  eligibleSchemes: Array<{
    schemeName: string;
    description: string;
    howToApply: string;
  }>;
  costSavingTips: Array<{
    tip: string;
    details: string;
  }>;
  financialCounselingAdvice: string;
}

export async function generateFinancialAssistance(
  input: FinancialAssistanceInput
): Promise<FinancialAssistanceOutput> {
  return generateFinancialGuidance(
    input.patientName,
    input.diagnosis,
    input.incomeLevel,
    input.primaryRiskFactor
  );
}
