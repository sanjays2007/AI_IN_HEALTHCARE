'use server';
/**
 * @fileOverview A Genkit flow for generating personalized intervention recommendations for patients at risk of dropping out of treatment.
 *
 * - generateInterventionRecommendations - A function that handles the generation of intervention recommendations.
 * - InterventionRecommendationInput - The input type for the generateInterventionRecommendations function.
 * - InterventionRecommendationOutput - The return type for the generateInterventionRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input Schema
const InterventionRecommendationInputSchema = z.object({
  diagnosis: z.string().describe('The patient\'s primary diagnosis.'),
  treatmentPhase: z.string().describe('The current phase of the patient\'s treatment.'),
  medicationPlan: z.string().describe('The patient\'s current medication plan.'),
  labProgress: z.string().describe('Summary of the patient\'s latest lab results or progress.'),
  completionPercentage: z.number().describe('The percentage of treatment completed so far.'),
  riskBreakdown: z.object({
    financial: z.number().describe('Financial risk score/percentage (0-100).'),
    sideEffects: z.number().describe('Side effects risk score/percentage (0-100).'),
    emotional: z.number().describe('Emotional risk score/percentage (0-100).'),
    travel: z.number().describe('Travel burden risk score/percentage (0-100).'),
    engagement: z.number().describe('Engagement risk score/percentage (0-100).')
  }).describe('Breakdown of various risk factors contributing to dropout likelihood.'),
  behavioralTimeline: z.array(z.string()).describe('A chronological list of patient behaviors, such as missed appointments, payment delays, side effect reports, mood decline, and missed doses.')
});
export type InterventionRecommendationInput = z.infer<typeof InterventionRecommendationInputSchema>;

// Output Schema
const InterventionRecommendationOutputSchema = z.object({
  recommendations: z.array(z.object({
    type: z.string().describe('The type of intervention (e.g., "Dosage Adjustment", "Tele-consult", "Financial Referral", "Nurse Follow-up", "Mental Health Support").'),
    description: z.string().describe('A detailed explanation of the recommended intervention.'),
    priority: z.enum(['High', 'Medium', 'Low']).describe('The priority level of the intervention.'),
    riskFactorAddressed: z.string().describe('The primary risk factor this intervention aims to address (e.g., "Financial", "Side Effects", "Emotional", "Travel", "Engagement").')
  })).describe('A list of personalized intervention recommendations.')
});
export type InterventionRecommendationOutput = z.infer<typeof InterventionRecommendationOutputSchema>;

// Wrapper function
export async function generateInterventionRecommendations(
  input: InterventionRecommendationInput
): Promise<InterventionRecommendationOutput> {
  return interventionRecommendationFlow(input);
}

// Prompt definition
const interventionRecommendationPrompt = ai.definePrompt({
  name: 'interventionRecommendationPrompt',
  input: { schema: InterventionRecommendationInputSchema },
  output: { schema: InterventionRecommendationOutputSchema },
  prompt: `You are an AI-powered clinical assistant specialized in preventing patient treatment dropout.
Your goal is to provide personalized intervention recommendations based on the patient's comprehensive risk profile.

Analyze the provided patient data:
- Clinical Overview:
  - Diagnosis: {{{diagnosis}}}
  - Treatment Phase: {{{treatmentPhase}}}
  - Medication Plan: {{{medicationPlan}}}
  - Lab Progress: {{{labProgress}}}
  - Completion Percentage: {{{completionPercentage}}}%

- AI Risk Panel (Risk Breakdown):
  {{#each riskBreakdown}}
  - {{{@key}}}: {{{this}}}%
  {{/each}}

- Behavioral Timeline:
  {{#each behavioralTimeline}}
  - {{{this}}}
  {{/each}}

Based on this information, generate a list of 1 to 5 highly personalized and actionable intervention recommendations. For each recommendation, specify its type, a detailed description, its priority (High, Medium, Low), and the primary risk factor it addresses.
Focus on addressing the highest contributing risk factors and recent behavioral patterns.

Consider the following types of recommendations:
- Adjust dosage
- Schedule tele-consult
- Refer to financial counselor
- Trigger nurse follow-up
- Assign mental health support
- Provide travel assistance
- Offer patient engagement resources

Example for 'recommendations' field:
[{
  "type": "Refer to financial counselor",
  "description": "Patient shows high financial risk and payment delays. Connect them with a financial counselor to explore aid options and installment plans.",
  "priority": "High",
  "riskFactorAddressed": "Financial"
}]
`
});

// Flow definition
const interventionRecommendationFlow = ai.defineFlow(
  {
    name: 'interventionRecommendationFlow',
    inputSchema: InterventionRecommendationInputSchema,
    outputSchema: InterventionRecommendationOutputSchema,
  },
  async (input) => {
    const {output} = await interventionRecommendationPrompt(input);
    return output!;
  }
);
