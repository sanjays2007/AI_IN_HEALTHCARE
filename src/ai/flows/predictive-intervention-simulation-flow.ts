'use server';
/**
 * @fileOverview Local weighted-scoring engine for simulating the impact of
 * interventions on patient dropout probability. No API keys required.
 */

import { simulateIntervention } from '@/ai/local-engine';

export interface PredictiveInterventionSimulationInput {
  currentDropoutProbability: number;
  interventionType: string;
  patientContext?: string;
}

export interface PredictiveInterventionSimulationOutput {
  simulatedDropoutProbability: number;
  interventionEffectDescription: string;
  noInterventionDropoutProbability: number;
}

export async function predictiveInterventionSimulation(
  input: PredictiveInterventionSimulationInput
): Promise<PredictiveInterventionSimulationOutput> {
  const result = simulateIntervention(
    input.currentDropoutProbability,
    input.interventionType,
    input.patientContext
  );
  return {
    simulatedDropoutProbability: result.simulatedProbability,
    interventionEffectDescription: result.description,
    noInterventionDropoutProbability: input.currentDropoutProbability,
  };
}
