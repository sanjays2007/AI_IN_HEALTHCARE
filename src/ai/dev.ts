import { config } from 'dotenv';
config();

import '@/ai/flows/doctor-risk-summary-generation-flow.ts';
import '@/ai/flows/patient-nudge-generation-flow.ts';
import '@/ai/flows/intervention-recommendation-generation-flow.ts';
import '@/ai/flows/predictive-intervention-simulation-flow.ts';
import '@/ai/flows/personalized-education-generation-flow.ts';
