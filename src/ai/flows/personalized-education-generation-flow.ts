'use server';
/**
 * @fileOverview A Genkit flow for generating personalized educational content for patients.
 *
 * - generatePersonalizedEducation - A function that generates a patient-specific education plan.
 * - PersonalizedEducationInput - The input type for the generatePersonalizedEducation function.
 * - PersonalizedEducationOutput - The return type for the generatePersonalizedEducation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedEducationInputSchema = z.object({
  patientName: z.string().describe('The name of the patient for personalization.'),
  diagnosis: z.string().describe("The patient's primary diagnosis."),
  riskFactors: z.array(z.string()).describe('A list of the patient\'s primary risk factors (e.g., "Financial", "Side Effects").'),
  language: z.string().default('English').describe('The desired language for the educational content.'),
});
export type PersonalizedEducationInput = z.infer<typeof PersonalizedEducationInputSchema>;

const PersonalizedEducationOutputSchema = z.object({
  title: z.string().describe('A clear, simple title for the educational content.'),
  content: z.string().describe('The AI-generated educational content in simple, easy-to-understand language. Should be in Markdown format.'),
});
export type PersonalizedEducationOutput = z.infer<typeof PersonalizedEducationOutputSchema>;

export async function generatePersonalizedEducation(input: PersonalizedEducationInput): Promise<PersonalizedEducationOutput> {
  return personalizedEducationGenerationFlow(input);
}

const personalizedEducationGenerationPrompt = ai.definePrompt({
  name: 'personalizedEducationGenerationPrompt',
  input: {schema: PersonalizedEducationInputSchema},
  output: {schema: PersonalizedEducationOutputSchema},
  prompt: `You are a health educator creating personalized content for a patient named {{patientName}}. The content must be in {{language}}.
The patient's diagnosis is {{diagnosis}}.
Their main challenges (risk factors) are:
{{#each riskFactors}}
- {{this}}
{{/each}}

Your task is to generate a short, encouraging, and easy-to-understand educational article for the patient.
The tone should be supportive and clear, avoiding complex medical jargon.
The content should be in Markdown format.

1.  **Title**: Create a simple title, like "Understanding Your Treatment for {{diagnosis}}".
2.  **Content**:
    *   Start with a supportive opening addressed to {{patientName}}.
    *   Briefly explain what {{diagnosis}} is in simple terms.
    *   For each risk factor in the list, provide one or two practical tips or pieces of advice to help them manage it. For example, for "Financial" risk, suggest talking to a hospital financial counselor. For "Side Effects", advise them to track symptoms and communicate with their doctor.
    *   End with an encouraging closing statement.

Generate the title and content based on these instructions.`,
});

const personalizedEducationGenerationFlow = ai.defineFlow(
  {
    name: 'personalizedEducationGenerationFlow',
    inputSchema: PersonalizedEducationInputSchema,
    outputSchema: PersonalizedEducationOutputSchema,
  },
  async input => {
    const {output} = await personalizedEducationGenerationPrompt(input);
    return output!;
  }
);
