'use server';
/**
 * @fileOverview This file provides a Genkit flow for doctors to generate a narrative summary
 * of a patient's primary dropout risk factors. It takes patient details, risk scores,
 * and behavioral indicators as input and returns a concise summary.
 *
 * - generateDoctorRiskSummary - A function that triggers the AI generation process.
 * - DoctorRiskSummaryGenerationInput - The input type for the generateDoctorRiskSummary function.
 * - DoctorRiskSummaryGenerationOutput - The return type for the generateDoctorRiskSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DoctorRiskSummaryGenerationInputSchema = z.object({
  patientName: z.string().describe("The patient's name."),
  diagnosis: z.string().describe("The patient's primary diagnosis."),
  overallRiskScore: z
    .number()
    .min(0)
    .max(100)
    .describe('The overall dropout risk score for the patient (0-100%).'),
  riskFactors: z
    .array(
      z.object({
        factor: z
          .string()
          .describe('The name of the risk factor (e.g., Financial, Side Effects).'),
        percentage: z
          .number()
          .min(0)
          .max(100)
          .describe('The percentage contribution of this factor to the overall risk.'),
      })
    )
    .describe('An array detailing various dropout risk factors and their contributions.'),
  behavioralTimelineSummary: z
    .string()
    .describe(
      'A concise summary of observed behavioral patterns from the patient\'s timeline (e.g., "increasing appointment gaps", "payment delays").'
    ),
});
export type DoctorRiskSummaryGenerationInput = z.infer<
  typeof DoctorRiskSummaryGenerationInputSchema
>;

const DoctorRiskSummaryGenerationOutputSchema = z.object({
  summary: z.string().describe('A narrative summary of the patient\'s primary dropout risk factors.'),
});
export type DoctorRiskSummaryGenerationOutput = z.infer<
  typeof DoctorRiskSummaryGenerationOutputSchema
>;

export async function generateDoctorRiskSummary(
  input: DoctorRiskSummaryGenerationInput
): Promise<DoctorRiskSummaryGenerationOutput> {
  return doctorRiskSummaryGenerationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'doctorRiskSummaryGenerationPrompt',
  input: {schema: DoctorRiskSummaryGenerationInputSchema},
  output: {schema: DoctorRiskSummaryGenerationOutputSchema},
  prompt: `You are an expert clinical assistant tasked with providing a concise, narrative summary of a patient's primary dropout risk factors.
Focus on identifying the most significant contributors to the patient's risk based on the provided data.

Patient Name: {{{patientName}}}
Diagnosis: {{{diagnosis}}}
Overall Dropout Risk Score: {{{overallRiskScore}}}%

Risk Factor Breakdown:
{{#each riskFactors}}
- {{{factor}}}: {{{percentage}}}%
{{/each}}

Behavioral Timeline Observations: {{{behavioralTimelineSummary}}}

Based on the above information, generate a narrative summary of this patient's primary dropout risk factors. The summary should be easy for a doctor to quickly understand the root causes and prioritize their review.`,
});

const doctorRiskSummaryGenerationFlow = ai.defineFlow(
  {
    name: 'doctorRiskSummaryGenerationFlow',
    inputSchema: DoctorRiskSummaryGenerationInputSchema,
    outputSchema: DoctorRiskSummaryGenerationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
