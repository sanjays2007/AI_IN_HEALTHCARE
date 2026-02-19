'use server';
/**
 * @fileOverview Local rule-based engine for generating personalized intervention
 * recommendations for patients at risk of dropping out. No API keys required.
 */

import { generateInterventionRecommendations as generateRecs } from '@/ai/local-engine';

export interface InterventionRecommendationInput {
  diagnosis: string;
  treatmentPhase: string;
  medicationPlan: string;
  labProgress: string;
  completionPercentage: number;
  riskBreakdown: {
    financial: number;
    sideEffects: number;
    emotional: number;
    travel: number;
    engagement: number;
  };
  behavioralTimeline: string[];
}

export interface InterventionRecommendationOutput {
  recommendations: Array<{
    type: string;
    description: string;
    priority: 'High' | 'Medium' | 'Low';
    riskFactorAddressed: string;
  }>;
}

export async function generateInterventionRecommendations(
  input: InterventionRecommendationInput
): Promise<InterventionRecommendationOutput> {
  const recommendations = generateRecs(
    input.riskBreakdown,
    input.diagnosis,
    input.treatmentPhase,
    input.completionPercentage,
    input.behavioralTimeline
  );
  return { recommendations };
}
