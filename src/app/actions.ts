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
import {
  generatePersonalizedEducation,
  type PersonalizedEducationInput,
} from '@/ai/flows/personalized-education-generation-flow';
import {
  generateFinancialAssistance,
  type FinancialAssistanceInput,
} from '@/ai/flows/financial-assistance-generation-flow';


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

export async function generatePersonalizedEducationAction(input: PersonalizedEducationInput) {
  try {
    const result = await generatePersonalizedEducation(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error generating personalized education:', error);
    return { success: false, error: 'Failed to generate content. Please try again.' };
  }
}

export async function generateFinancialAssistanceAction(input: FinancialAssistanceInput) {
  try {
    const result = await generateFinancialAssistance(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error generating financial assistance:', error);
    return { success: false, error: 'Failed to generate guidance. Please try again.' };
  }
}

export async function generateArticleContentAction(input: { title: string; category: string; summary: string }) {
  try {
    const apiKey = process.env.GOOGLE_GENAI_API_KEY;
    
    if (!apiKey || apiKey === 'your_api_key_here') {
      // Return fallback content if no API key
      return {
        success: true,
        data: {
          content: generateFallbackContent(input.title, input.category, input.summary),
        },
      };
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a healthcare education content writer. Generate a detailed, patient-friendly article based on the following:

Title: ${input.title}
Category: ${input.category}
Summary: ${input.summary}

Requirements:
- Write in clear, simple language that patients can understand
- Include practical tips and actionable advice
- Be empathetic and supportive in tone
- Structure with headings using markdown (##, ###)
- Include key takeaways at the end
- Keep the content accurate and medically sound
- Length: 400-600 words

Generate the full article content now:`
            }],
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Gemini API request failed');
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || generateFallbackContent(input.title, input.category, input.summary);

    return { success: true, data: { content } };
  } catch (error) {
    console.error('Error generating article content:', error);
    return {
      success: true,
      data: {
        content: generateFallbackContent(input.title, input.category, input.summary),
      },
    };
  }
}

function generateFallbackContent(title: string, category: string, summary: string): string {
  return `## ${title}

${summary}

### Understanding the Basics

${category} is an important aspect of your overall health. Taking time to understand and manage it properly can significantly improve your quality of life.

### Key Points to Remember

1. **Stay Consistent**: Whether it's medication, exercise, or dietary changes, consistency is key to seeing results.

2. **Communicate with Your Healthcare Team**: Don't hesitate to ask questions or report any concerns. Your healthcare providers are here to help.

3. **Monitor Your Progress**: Keep track of your symptoms, medications, and any changes you notice. This information helps your care team make better decisions.

4. **Take Care of Your Mental Health**: Managing a health condition can be stressful. It's okay to seek support when you need it.

### Practical Tips

- Set reminders for medications and appointments
- Keep a health journal to track your symptoms
- Stay hydrated and maintain a balanced diet
- Get adequate rest and sleep
- Don't skip scheduled check-ups

### When to Seek Help

Contact your healthcare provider if you experience:
- New or worsening symptoms
- Side effects from medications
- Questions about your treatment plan
- Emotional distress related to your condition

### Key Takeaways

- Knowledge is power – understanding your condition helps you manage it better
- You're not alone – your healthcare team and support system are here for you
- Small, consistent changes lead to big improvements over time
- Always follow your prescribed treatment plan

*Remember: This information is for educational purposes. Always consult with your healthcare provider for personalized medical advice.*`;
}
