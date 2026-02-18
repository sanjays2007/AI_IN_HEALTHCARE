'use server';

import {
  generateDoctorRiskSummary,
  type DoctorRiskSummaryGenerationInput,
} from '@/ai/flows/doctor-risk-summary-generation-flow';
import {
  generateInterventionRecommendations,
  type InterventionRecommendationInput,
} from '@/ai/flows/intervention-recommendation-generation-flow';
import {
  predictiveInterventionSimulation,
  type PredictiveInterventionSimulationInput,
} from '@/ai/flows/predictive-intervention-simulation-flow';

export async function generateDoctorRiskSummaryAction(input: DoctorRiskSummaryGenerationInput) {
  try {
    const result = await generateDoctorRiskSummary(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error generating doctor risk summary:', error);
    return { success: false, error: 'Failed to generate summary. Please try again.' };
  }
}

export async function getInterventionRecommendationsAction(input: InterventionRecommendationInput) {
  try {
    const result = await generateInterventionRecommendations(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error generating intervention recommendations:', error);
    return { success: false, error: 'Failed to generate recommendations. Please try again.' };
  }
}

export async function runPredictiveSimulationAction(input: PredictiveInterventionSimulationInput) {
  try {
    const result = await predictiveInterventionSimulation(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error running predictive simulation:', error);
    return { success: false, error: 'Failed to run simulation. Please try again.' };
  }
}

export async function logInterventionAction(patientId: string, intervention: any, reason: string) {
    // In a real app, this would save to a database.
    console.log(`Intervention logged for patient ${patientId}:`, { intervention, reason });
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate DB call
    return { success: true, message: 'Intervention logged successfully.' };
}
