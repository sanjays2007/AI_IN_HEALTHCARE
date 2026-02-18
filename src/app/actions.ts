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
  generatePatientNudge,
  type PatientNudgeInput,
} from '@/ai/flows/patient-nudge-generation-flow';
import {
  predictiveInterventionSimulation,
  type PredictiveInterventionSimulationInput,
} from '@/ai/flows/predictive-intervention-simulation-flow';
import type { Intervention } from '@/lib/types';

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

export async function generatePatientNudgeAction(input: PatientNudgeInput) {
  try {
    const result = await generatePatientNudge(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error generating patient nudge:', error);
    return { success: false, error: 'Failed to generate nudge. Please try again.' };
  }
}

export async function logInterventionAction(patientId: string, intervention: Intervention, action: 'Accepted' | 'Rejected') {
    // In a real app, this would save to a database and trigger a workflow.
    console.log(`Intervention ${action} for patient ${patientId}:`, { intervention });
    
    if (action === 'Rejected') {
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate DB call
        return { success: true, message: `Intervention '${intervention.type}' was logged as rejected.` };
    }

    let notificationMessage = `Intervention '${intervention.type}' has been accepted and logged.`;

    // Simulate automated workflow based on intervention type
    const interventionType = intervention.type.toLowerCase();
    if (interventionType.includes('financial')) {
        notificationMessage = "Financial counselor has been notified to assist the patient.";
    } else if (interventionType.includes('nurse')) {
        notificationMessage = "A follow-up task has been created for the nursing team.";
    } else if (interventionType.includes('mental health')) {
        notificationMessage = "A referral has been sent to the mental health support team.";
    } else if (interventionType.includes('dosage') || interventionType.includes('tele-consult')) {
        notificationMessage = "The care team has been notified to review the patient's plan.";
    }

    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate DB call & workflow trigger

    return { success: true, message: notificationMessage };
}
