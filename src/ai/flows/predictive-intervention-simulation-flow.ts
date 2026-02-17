'use server';
/**
 * @fileOverview A Genkit flow for simulating the impact of interventions on patient dropout probability.
 *
 * - predictiveInterventionSimulation - A function that simulates the effect of a proposed intervention.
 * - PredictiveInterventionSimulationInput - The input type for the predictiveInterventionSimulation function.
 * - PredictiveInterventionSimulationOutput - The return type for the predictiveInterventionSimulation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input Schema
const PredictiveInterventionSimulationInputSchema = z.object({
  currentDropoutProbability: z
    .number()
    .min(0)
    .max(100)
    .describe("The patient's current dropout probability, as a percentage."),
  interventionType: z
    .string()
    .describe(
      'The type of intervention being simulated (e.g., "financial support added", "adjust dosage", "schedule tele-consult").'
    ),
  patientContext: z
    .string()
    .optional()
    .describe(
      'Additional context about the patient, such as diagnosis, primary risk factor, or current treatment stage.'
    ),
});
export type PredictiveInterventionSimulationInput = z.infer<
  typeof PredictiveInterventionSimulationInputSchema
>;

// Output Schema
const PredictiveInterventionSimulationOutputSchema = z.object({
  simulatedDropoutProbability: z
    .number()
    .min(0)
    .max(100)
    .describe(
      'The predicted dropout probability after the intervention, as a percentage.'
    ),
  interventionEffectDescription: z
    .string()
    .describe(
      'A brief explanation of why the intervention is predicted to have this effect.'
    ),
  noInterventionDropoutProbability: z
    .number()
    .min(0)
    .max(100)
    .describe(
      'The dropout probability if no intervention is applied, for comparison (should be the same as currentDropoutProbability).'
    ),
});
export type PredictiveInterventionSimulationOutput = z.infer<
  typeof PredictiveInterventionSimulationOutputSchema
>;

// Wrapper function
export async function predictiveInterventionSimulation(
  input: PredictiveInterventionSimulationInput
): Promise<PredictiveInterventionSimulationOutput> {
  return predictiveInterventionSimulationFlow(input);
}

// Define the prompt
const predictiveInterventionSimulationPrompt = ai.definePrompt({
  name: 'predictiveInterventionSimulationPrompt',
  input: {schema: PredictiveInterventionSimulationInputSchema},
  output: {schema: PredictiveInterventionSimulationOutputSchema},
  prompt: `You are an AI-powered simulation tool for a medical dropout detection system. Your task is to predict the impact of a given intervention on a patient's dropout probability.

Consider the patient's current dropout probability and the proposed intervention. Provide a realistic and concise simulation result.

Current Dropout Probability: {{{currentDropoutProbability}}}%
Proposed Intervention: {{{interventionType}}}
{{#if patientContext}}
Patient Context: {{{patientContext}}}
{{/if}}

Based on this information, predict the new dropout probability if the intervention is applied, and explain the reasoning.

Provide the output in JSON format as per the output schema. For 'noInterventionDropoutProbability', simply echo the 'currentDropoutProbability' from the input for comparison purposes.`,
});

// Define the flow
const predictiveInterventionSimulationFlow = ai.defineFlow(
  {
    name: 'predictiveInterventionSimulationFlow',
    inputSchema: PredictiveInterventionSimulationInputSchema,
    outputSchema: PredictiveInterventionSimulationOutputSchema,
  },
  async (input) => {
    const {output} = await predictiveInterventionSimulationPrompt(input);
    // Explicitly set noInterventionDropoutProbability to the input's currentDropoutProbability
    return {
      simulatedDropoutProbability: output!.simulatedDropoutProbability,
      interventionEffectDescription: output!.interventionEffectDescription,
      noInterventionDropoutProbability: input.currentDropoutProbability,
    };
  }
);
