'use server';
/**
 * @fileOverview A Genkit flow for generating personalized, empathetic nudges and alerts for patients.
 *
 * - generatePatientNudge - A function that generates a patient-specific nudge message.
 * - PatientNudgeInput - The input type for the generatePatientNudge function.
 * - PatientNudgeOutput - The return type for the generatePatientNudge function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PatientNudgeInputSchema = z.object({
  patientName: z.string().describe('The name of the patient for personalization.'),
  treatmentPhase: z
    .string()
    .describe('The current phase of the patient\'s treatment (e.g., "early", "mid-treatment", "final stages").'),
  lastActionDetails: z
    .string()
    .describe('Details about the patient\'s most recent relevant activity or status (e.g., "rescheduled twice this month", "side effects reported", "80% through treatment").'),
  specificContext: z
    .string()
    .optional()
    .describe('Any additional specific details to make the nudge more relevant (e.g., appointment date, specific financial aid type).'),
  tone: z
    .enum(['supportive', 'urgent', 'informative', 'motivational'])
    .default('supportive')
    .describe('The desired tone of the nudge message.'),
});
export type PatientNudgeInput = z.infer<typeof PatientNudgeInputSchema>;

const PatientNudgeOutputSchema = z.object({
  nudgeMessage: z.string().describe('The AI-generated empathetic and contextual nudge message.'),
});
export type PatientNudgeOutput = z.infer<typeof PatientNudgeOutputSchema>;

export async function generatePatientNudge(input: PatientNudgeInput): Promise<PatientNudgeOutput> {
  return patientNudgeGenerationFlow(input);
}

const patientNudgeGenerationPrompt = ai.definePrompt({
  name: 'patientNudgeGenerationPrompt',
  input: {schema: PatientNudgeInputSchema},
  output: {schema: PatientNudgeOutputSchema},
  prompt: `You are a compassionate and supportive health assistant designed to help patients stay engaged with their treatment. Your goal is to provide personalized, empathetic nudges and alerts.

Generate a short, clear, and encouraging message for {{patientName}}.
Consider their current treatment phase: '{{treatmentPhase}}'.
The most recent relevant activity or status is: '{{lastActionDetails}}'.
{{#if specificContext}}Additional context: '{{specificContext}}'.{{/if}}

The message should be {{tone}} in tone, aim to support their adherence, and remind them of important actions without feeling generic. Avoid overly medical jargon.

Example nudges:
- "Hi {{patientName}}, it looks like you've rescheduled your appointments a couple of times this month. Is there anything we can do to help you stay on track? Your well-being is our priority!"
- "Dear {{patientName}}, we noticed you reported some side effects recently. Your doctor will review this soon, and we'll reach out if further action is needed. We're here to support you."
- "Hello {{patientName}}, great news! Financial support options are available for your treatment. Please check the 'Financial Support' section in your app or contact your financial counselor for more details."
- "Wonderful job, {{patientName}}! You're 80% through your treatment journey. Keep going; you're doing great!"

Now, generate the message based on the provided information, ensuring it is empathetic and directly addresses the context.`,
});

const patientNudgeGenerationFlow = ai.defineFlow(
  {
    name: 'patientNudgeGenerationFlow',
    inputSchema: PatientNudgeInputSchema,
    outputSchema: PatientNudgeOutputSchema,
  },
  async input => {
    const {output} = await patientNudgeGenerationPrompt(input);
    return output!;
  }
);
