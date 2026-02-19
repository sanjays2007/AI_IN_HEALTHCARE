'use server';
/**
 * @fileOverview A Genkit flow for generating financial assistance guidance for patients.
 *
 * - generateFinancialAssistance - A function that generates financial guidance.
 * - FinancialAssistanceInput - The input type for the function.
 * - FinancialAssistanceOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FinancialAssistanceInputSchema = z.object({
  patientName: z.string().describe('The name of the patient.'),
  diagnosis: z.string().describe("The patient's primary diagnosis."),
  incomeLevel: z.enum(['Low', 'Medium', 'High']).describe("The patient's estimated income level."),
  primaryRiskFactor: z.string().describe('The primary risk factor identified for the patient.'),
});
export type FinancialAssistanceInput = z.infer<typeof FinancialAssistanceInputSchema>;

const FinancialAssistanceOutputSchema = z.object({
  eligibleSchemes: z.array(z.object({
      schemeName: z.string().describe('Name of the government or NGO scheme.'),
      description: z.string().describe('A brief description of the scheme and its benefits.'),
      howToApply: z.string().describe('Simple steps on how to apply for the scheme.'),
  })).describe('A list of potential financial aid schemes the patient may be eligible for.'),
  costSavingTips: z.array(z.object({
      tip: z.string().describe('A specific cost-saving suggestion.'),
      details: z.string().describe('More details about the suggestion, e.g., how to get generic medicines.'),
  })).describe('Actionable tips for reducing treatment-related costs.'),
  financialCounselingAdvice: z.string().describe('General financial counseling advice in simple language.'),
});
export type FinancialAssistanceOutput = z.infer<typeof FinancialAssistanceOutputSchema>;


export async function generateFinancialAssistance(input: FinancialAssistanceInput): Promise<FinancialAssistanceOutput> {
  return financialAssistanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'financialAssistancePrompt',
  input: {schema: FinancialAssistanceInputSchema},
  output: {schema: FinancialAssistanceOutputSchema},
  prompt: `You are a healthcare financial advisor for rural patients in India. Your goal is to provide clear, simple, and actionable financial guidance for a patient named {{patientName}}.

Patient Details:
- Diagnosis: {{diagnosis}}
- Income Level: {{incomeLevel}}
- Primary Risk Factor: {{primaryRiskFactor}}

Based on this information, generate a financial assistance plan. The language must be simple and easy to understand.

1.  **Eligible Schemes**: Identify 2-3 potential government or NGO schemes the patient might be eligible for. For each scheme, provide the name, a simple description of its benefits, and easy-to-follow application steps. Examples include Ayushman Bharat (PM-JAY), state-specific health schemes, or programs for specific diseases like TB (Nikshay Poshan Yojana).

2.  **Cost-Saving Tips**: Provide 2-3 practical tips for reducing costs. Focus on things like opting for generic medicines from Jan Aushadhi Kendras, inquiring about hospital travel subsidies, or using government-run diagnostic labs.

3.  **Financial Counseling Advice**: Write a short, encouraging paragraph of general financial advice. Focus on the importance of planning expenses and not hesitating to ask the hospital's social worker or financial counselor for help.

Generate the full response in the required JSON format.
`,
});

const financialAssistanceFlow = ai.defineFlow(
  {
    name: 'financialAssistanceFlow',
    inputSchema: FinancialAssistanceInputSchema,
    outputSchema: FinancialAssistanceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
