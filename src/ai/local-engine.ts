/**
 * Local AI Engine - Rule-based + Template-based ML
 * Completely free, no API keys required.
 * Uses decision trees, weighted scoring, and NLG templates.
 */

// ==================== UTILITY FUNCTIONS ====================

/** Weighted random variation to make outputs realistic (+/- range%) */
function vary(base: number, range: number = 5): number {
  const variation = (Math.random() - 0.5) * 2 * range;
  return Math.round(Math.max(0, Math.min(100, base + variation)) * 10) / 10;
}

/** Pick a random item from an array */
function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ==================== INTERVENTION IMPACT MODEL ====================
// Decision-tree based intervention impact scores
const INTERVENTION_IMPACT: Record<string, { reduction: number; description: string }> = {
  'financial support': { reduction: 22, description: 'Financial support directly addresses cost barriers, reducing economic stress that leads to missed treatments.' },
  'financial counselor': { reduction: 20, description: 'Financial counseling helps patients navigate aid programs and payment plans, reducing dropout from cost concerns.' },
  'financial referral': { reduction: 20, description: 'Connecting patients with financial resources removes a primary barrier to treatment continuation.' },
  'adjust dosage': { reduction: 15, description: 'Dosage adjustment can reduce side effects while maintaining efficacy, improving adherence.' },
  'dosage adjustment': { reduction: 15, description: 'Modifying the dosage helps manage side effects and improves patient tolerance of the treatment.' },
  'tele-consult': { reduction: 12, description: 'Tele-consultations eliminate travel burden and provide timely clinical guidance without requiring physical visits.' },
  'schedule tele-consult': { reduction: 12, description: 'Scheduling a tele-consult provides convenient access to care, reducing missed appointments.' },
  'nurse follow-up': { reduction: 18, description: 'Proactive nurse follow-ups catch early warning signs and provide personalized support.' },
  'mental health': { reduction: 16, description: 'Mental health support addresses emotional barriers that significantly affect treatment adherence.' },
  'mental health support': { reduction: 16, description: 'Professional mental health care helps patients cope with treatment-related anxiety and depression.' },
  'home visit': { reduction: 25, description: 'Home visits remove all travel barriers and provide in-person care in a comfortable environment.' },
  'peer support': { reduction: 10, description: 'Peer support groups provide emotional validation and practical tips from others in similar situations.' },
  'travel assistance': { reduction: 14, description: 'Transport assistance removes physical access barriers preventing patients from attending appointments.' },
  'family meeting': { reduction: 13, description: 'Family meetings strengthen the support system and improve understanding of the treatment process.' },
  'engagement resources': { reduction: 8, description: 'Educational and engagement resources help patients understand their treatment, increasing motivation.' },
  'schedule adjustment': { reduction: 10, description: 'Flexible scheduling accommodates patient constraints and reduces appointment conflicts.' },
};

/** Find the best matching intervention impact */
export function getInterventionImpact(interventionType: string): { reduction: number; description: string } {
  const lower = interventionType.toLowerCase();
  for (const [key, value] of Object.entries(INTERVENTION_IMPACT)) {
    if (lower.includes(key)) {
      return value;
    }
  }
  // Default fallback
  return { reduction: 10, description: `The proposed intervention "${interventionType}" is expected to provide moderate improvement in treatment adherence by addressing underlying risk factors.` };
}

// ==================== RISK ANALYSIS ENGINE ====================

interface RiskFactor {
  factor: string;
  percentage: number;
}

/** Classify risk level */
export function classifyRisk(score: number): 'Critical' | 'High' | 'Moderate' | 'Low' {
  if (score >= 75) return 'Critical';
  if (score >= 50) return 'High';
  if (score >= 25) return 'Moderate';
  return 'Low';
}

/** Generate a narrative risk summary using templates */
export function generateRiskNarrative(
  patientName: string,
  diagnosis: string,
  overallRiskScore: number,
  riskFactors: RiskFactor[],
  behavioralSummary: string
): string {
  const riskLevel = classifyRisk(overallRiskScore);
  const sorted = [...riskFactors].sort((a, b) => b.percentage - a.percentage);
  const topFactors = sorted.slice(0, 3);
  const primaryFactor = topFactors[0];

  // Build narrative sections
  const opening = riskLevel === 'Critical'
    ? `**CRITICAL ALERT**: ${patientName} presents with a critically elevated dropout risk score of ${overallRiskScore}%, requiring immediate clinical attention.`
    : riskLevel === 'High'
    ? `${patientName} shows a high dropout risk score of ${overallRiskScore}%, indicating significant concern for treatment discontinuation.`
    : riskLevel === 'Moderate'
    ? `${patientName} has a moderate dropout risk score of ${overallRiskScore}%. While not immediately critical, proactive monitoring is recommended.`
    : `${patientName} currently presents with a low dropout risk score of ${overallRiskScore}%. Continue standard monitoring and support.`;

  const diagnosisSection = `The patient is undergoing treatment for **${diagnosis}**.`;

  const factorAnalysis = topFactors.map((f, i) => {
    const rank = i === 0 ? 'primary' : i === 1 ? 'secondary' : 'tertiary';
    const severity = f.percentage >= 30 ? 'significantly elevated' : f.percentage >= 20 ? 'notably present' : 'a contributing factor';
    return `The ${rank} risk contributor is **${f.factor}** at ${f.percentage}%, which is ${severity}.`;
  }).join(' ');

  const behaviorSection = behavioralSummary
    ? `Behavioral analysis reveals: ${behavioralSummary}. These patterns ${primaryFactor && primaryFactor.percentage >= 30 ? 'strongly correlate with' : 'may be related to'} the elevated ${primaryFactor?.factor || 'overall'} risk.`
    : '';

  const recommendation = riskLevel === 'Critical'
    ? `**Immediate Action Required**: Prioritize a multidisciplinary case review focusing on ${primaryFactor?.factor || 'the primary risk drivers'}. Consider scheduling an urgent consultation or intervention.`
    : riskLevel === 'High'
    ? `**Recommended Action**: Schedule a follow-up within 48 hours and consider targeted interventions for ${primaryFactor?.factor || 'the leading risk factors'}.`
    : `**Monitoring Plan**: Continue regular check-ins and monitor for any escalation in ${topFactors.map(f => f.factor).join(', ')}.`;

  return [opening, diagnosisSection, factorAnalysis, behaviorSection, recommendation]
    .filter(Boolean)
    .join('\n\n');
}

// ==================== INTERVENTION RECOMMENDATION ENGINE ====================

interface RiskBreakdown {
  financial: number;
  sideEffects: number;
  emotional: number;
  travel: number;
  engagement: number;
}

interface Recommendation {
  type: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  riskFactorAddressed: string;
}

const INTERVENTION_RULES: Array<{
  factor: keyof RiskBreakdown;
  label: string;
  thresholdHigh: number;
  thresholdMedium: number;
  interventions: Array<{ type: string; descriptionTemplate: string }>;
}> = [
  {
    factor: 'financial',
    label: 'Financial',
    thresholdHigh: 30,
    thresholdMedium: 15,
    interventions: [
      { type: 'Refer to Financial Counselor', descriptionTemplate: 'Patient shows elevated financial risk ({score}%). Connect with a financial counselor to explore government aid programs (Ayushman Bharat, state schemes), installment plans, and emergency financial support to prevent cost-driven dropout.' },
      { type: 'Emergency Financial Aid Application', descriptionTemplate: 'Given the financial stress level ({score}%), initiate an emergency financial aid application to subsidize ongoing treatment costs.' },
    ],
  },
  {
    factor: 'sideEffects',
    label: 'Side Effects',
    thresholdHigh: 25,
    thresholdMedium: 15,
    interventions: [
      { type: 'Dosage Adjustment Review', descriptionTemplate: 'Side effect risk is at {score}%. Review current medication plan for potential dosage adjustments or alternative formulations to improve tolerance.' },
      { type: 'Schedule Tele-consult for Symptom Management', descriptionTemplate: 'Patient reports side effect concerns ({score}% risk). Schedule a tele-consultation to assess symptoms and adjust the care plan.' },
    ],
  },
  {
    factor: 'emotional',
    label: 'Emotional',
    thresholdHigh: 25,
    thresholdMedium: 15,
    interventions: [
      { type: 'Assign Mental Health Support', descriptionTemplate: 'Emotional risk is elevated at {score}%. Recommend counseling sessions and consider referral to the mental health support team.' },
      { type: 'Peer Support Group Enrollment', descriptionTemplate: 'Patient may benefit from peer support (emotional risk: {score}%). Enroll in a support group for patients with similar conditions.' },
    ],
  },
  {
    factor: 'travel',
    label: 'Travel',
    thresholdHigh: 25,
    thresholdMedium: 15,
    interventions: [
      { type: 'Arrange Travel Assistance', descriptionTemplate: 'Travel burden is significant ({score}%). Arrange transport assistance or subsidized travel to reduce access barriers.' },
      { type: 'Switch to Tele-consult Where Possible', descriptionTemplate: 'Given travel risk ({score}%), convert non-essential in-person visits to tele-consultations.' },
    ],
  },
  {
    factor: 'engagement',
    label: 'Engagement',
    thresholdHigh: 25,
    thresholdMedium: 15,
    interventions: [
      { type: 'Trigger Nurse Follow-up', descriptionTemplate: 'Patient engagement is declining ({score}%). Schedule a proactive nurse follow-up call to re-engage and assess barriers.' },
      { type: 'Send Personalized Engagement Resources', descriptionTemplate: 'Engagement risk at {score}%. Deliver personalized educational content and motivational nudges to improve adherence.' },
    ],
  },
];

/** Generate intervention recommendations using rule-based decision tree */
export function generateInterventionRecommendations(
  riskBreakdown: RiskBreakdown,
  diagnosis: string,
  treatmentPhase: string,
  completionPercentage: number,
  behavioralTimeline: string[]
): Recommendation[] {
  const recommendations: Recommendation[] = [];

  // Sort risk factors by severity
  const factors: Array<{ key: keyof RiskBreakdown; value: number }> = Object.entries(riskBreakdown)
    .map(([key, value]) => ({ key: key as keyof RiskBreakdown, value: value as number }))
    .sort((a, b) => b.value - a.value);

  for (const { key, value } of factors) {
    const rule = INTERVENTION_RULES.find(r => r.factor === key);
    if (!rule) continue;

    if (value >= rule.thresholdHigh) {
      const intervention = rule.interventions[0];
      recommendations.push({
        type: intervention.type,
        description: intervention.descriptionTemplate.replace('{score}', String(value)),
        priority: 'High',
        riskFactorAddressed: rule.label,
      });
    } else if (value >= rule.thresholdMedium) {
      const intervention = rule.interventions[1] || rule.interventions[0];
      recommendations.push({
        type: intervention.type,
        description: intervention.descriptionTemplate.replace('{score}', String(value)),
        priority: 'Medium',
        riskFactorAddressed: rule.label,
      });
    }
  }

  // Check behavioral patterns for additional recommendations
  const timelineText = behavioralTimeline.join(' ').toLowerCase();
  if (timelineText.includes('missed') && timelineText.includes('appointment') && recommendations.length < 5) {
    recommendations.push({
      type: 'Schedule Adjustment',
      description: 'Behavioral patterns indicate recurring missed appointments. Consider flexible scheduling, reminders, or switching some visits to tele-consults.',
      priority: 'Medium',
      riskFactorAddressed: 'Engagement',
    });
  }
  if (timelineText.includes('mood') && (timelineText.includes('decline') || timelineText.includes('low')) && recommendations.length < 5) {
    if (!recommendations.some(r => r.riskFactorAddressed === 'Emotional')) {
      recommendations.push({
        type: 'Mental Health Check-in',
        description: 'Recent behavioral data suggests mood decline. A proactive mental health check-in is recommended.',
        priority: 'Medium',
        riskFactorAddressed: 'Emotional',
      });
    }
  }

  // Limit to 5 max, ensure at least 1
  if (recommendations.length === 0) {
    recommendations.push({
      type: 'Routine Nurse Follow-up',
      description: `Patient is ${completionPercentage}% through treatment for ${diagnosis}. Current risk levels are manageable. Schedule a routine check-in to maintain engagement.`,
      priority: 'Low',
      riskFactorAddressed: 'Engagement',
    });
  }

  return recommendations.slice(0, 5);
}

// ==================== PREDICTIVE SIMULATION ENGINE ====================

/** Simulate dropout probability change using weighted scoring model */
export function simulateIntervention(
  currentProbability: number,
  interventionType: string,
  patientContext?: string
): { simulatedProbability: number; description: string } {
  const impact = getInterventionImpact(interventionType);
  let reduction = vary(impact.reduction, 3);

  // Context-based adjustments
  if (patientContext) {
    const ctx = patientContext.toLowerCase();
    if (ctx.includes('critical') || ctx.includes('high risk')) reduction *= 1.15;
    if (ctx.includes('early') || ctx.includes('initial')) reduction *= 1.1;
    if (ctx.includes('final') || ctx.includes('late stage')) reduction *= 0.85;
    if (ctx.includes('non-compliant') || ctx.includes('resistant')) reduction *= 0.7;
  }

  const simulatedProbability = Math.round(Math.max(2, currentProbability - reduction) * 10) / 10;

  return {
    simulatedProbability,
    description: impact.description,
  };
}

// ==================== PATIENT NUDGE ENGINE ====================

const NUDGE_TEMPLATES: Record<string, string[]> = {
  supportive: [
    "Hi {name}, we understand that managing your treatment can feel overwhelming sometimes. We noticed {action}. Please know that your care team is here for you — don't hesitate to reach out if you need any help. Your health journey matters to us! 💙",
    "Dear {name}, we're thinking of you! We saw that {action}. Remember, it's okay to ask for support. Your well-being is our priority, and we're just a call away. Stay strong — you're doing better than you think! 🌟",
    "Hello {name}, just checking in. We noticed {action}. Life can get busy, but your health is important. Let us know if there's anything we can do to make your treatment easier. We're rooting for you! 🤗",
  ],
  urgent: [
    "Important update for {name}: We noticed {action}. It's crucial that we address this soon to keep your treatment on track. Please contact your care team or visit the hospital at your earliest convenience. We want to help! ⚠️",
    "Hi {name}, this is a priority message. We've observed that {action}. To avoid any disruption to your recovery, please reach out to us today. Your health can't wait, and neither should you. 📞",
    "Attention {name}: {action}. This needs prompt attention. Please schedule a visit or call us immediately so we can support you through this. Your treatment progress depends on timely action. 🚨",
  ],
  informative: [
    "Hi {name}, here's an update for you. We noticed {action}. {context}We want you to be informed about all your options. Check your patient portal for more details, or ask your care team during your next visit. 📋",
    "Dear {name}, just a quick note: {action}. {context}Stay informed and stay engaged — knowledge is a powerful tool in your health journey! If you have questions, we're always here to help. ℹ️",
    "Hello {name}, we wanted to share some information with you. {action}. {context}Understanding your treatment helps you make the best decisions. Reach out anytime if you'd like to discuss further. 📖",
  ],
  motivational: [
    "Amazing progress, {name}! 🎉 {action}. Every step forward counts, and you're proving that persistence pays off. Keep up the fantastic work — your care team is cheering you on!",
    "You're doing incredible, {name}! We noticed {action}. Remember how far you've come. You're stronger than you know, and your dedication to your health is truly inspiring. Keep going! 💪",
    "Way to go, {name}! 🌟 {action}. You're making real progress on your treatment journey. Stay positive, stay committed — great health outcomes are ahead!",
  ],
};

/** Generate a personalized nudge message */
export function generateNudge(
  patientName: string,
  treatmentPhase: string,
  lastActionDetails: string,
  tone: 'supportive' | 'urgent' | 'informative' | 'motivational' = 'supportive',
  specificContext?: string
): string {
  const templates = NUDGE_TEMPLATES[tone] || NUDGE_TEMPLATES.supportive;
  let message = pick(templates);

  message = message.replace(/{name}/g, patientName);
  message = message.replace(/{action}/g, lastActionDetails);
  message = message.replace(/{context}/g, specificContext ? specificContext + ' ' : '');

  return message;
}

// ==================== EDUCATION CONTENT ENGINE ====================

const DIAGNOSIS_INFO: Record<string, string> = {
  'tuberculosis': "Tuberculosis (TB) is a bacterial infection that mainly affects the lungs. It is treatable and curable with a proper course of antibiotics, usually lasting 6-9 months. Completing the entire treatment is essential — stopping early can make the bacteria resistant to medicines.",
  'tb': "Tuberculosis (TB) is a bacterial infection that mainly affects the lungs. It is treatable and curable with a proper course of antibiotics, usually lasting 6-9 months. Completing the entire treatment is essential — stopping early can make the bacteria resistant to medicines.",
  'diabetes': "Diabetes is a condition where your body has difficulty managing blood sugar levels. With proper medication, diet, and exercise, diabetes can be well controlled. Regular monitoring and staying on your treatment plan is key to living a healthy life.",
  'cancer': "Cancer involves abnormal cell growth in the body. Treatment options vary but may include chemotherapy, radiation, surgery, or a combination of these. While the journey can be challenging, many cancers are treatable, especially with early detection and consistent treatment.",
  'hiv': "HIV (Human Immunodeficiency Virus) weakens the immune system over time. With modern antiretroviral therapy (ART), people with HIV can live long, healthy lives. The key is taking your medication every day as prescribed — consistency is crucial.",
  'hypertension': "High blood pressure (Hypertension) means the force of blood against your artery walls is consistently too high. It can be managed with medication, a balanced diet, regular exercise, and stress management. Regular check-ups help you stay on track.",
  'depression': "Depression is a medical condition that affects your mood, thoughts, and daily activities. It's not a sign of weakness — it's a health condition that responds well to treatment, including therapy and medication. Seeking help is a sign of strength.",
  'default': "Your condition requires ongoing medical attention and treatment. While every health journey has its challenges, with proper care, regular check-ups, and following your treatment plan, you can achieve the best possible outcomes.",
};

const RISK_FACTOR_TIPS: Record<string, string[]> = {
  'financial': [
    "💰 **Managing Costs**: Talk to the hospital's financial counselor about payment plans and government aid programs. You may be eligible for schemes like Ayushman Bharat (PM-JAY) that cover treatment costs.",
    "📋 **Cost-Saving Tip**: Ask your doctor about generic medicines — they work just as well but cost much less. Jan Aushadhi Kendras offer quality medicines at affordable prices.",
  ],
  'side effects': [
    "📝 **Tracking Side Effects**: Keep a simple diary of any side effects you experience — when they happen, how long they last, and how severe they feel. Share this with your doctor at every visit.",
    "💊 **Managing Discomfort**: Some side effects are temporary and improve over time. Your doctor can also adjust your dosage or prescribe supportive medication to help you feel better.",
  ],
  'emotional': [
    "🧠 **Mental Well-being**: It's completely normal to feel anxious or down during treatment. Consider talking to a counselor or joining a patient support group — sharing your feelings helps!",
    "🌿 **Self-Care Tips**: Practice simple relaxation techniques like deep breathing or light walking. Even 10 minutes of mindful activity can significantly improve your mood.",
  ],
  'travel': [
    "🚌 **Travel Support**: Ask your hospital about transport subsidies or community health worker visits. Some treatments can also be done via tele-consultation, saving you a trip.",
    "📍 **Closer Care**: Check if there's a local sub-center or PHC that can provide some of your treatment services closer to home.",
  ],
  'engagement': [
    "📱 **Stay Connected**: Set phone reminders for your medications and appointments. Using your patient app regularly helps you stay on top of your treatment plan.",
    "👥 **Support System**: Involve a family member or friend in your treatment journey — having someone to remind and encourage you makes a big difference.",
  ],
  'default': [
    "✅ **Stay on Track**: Follow your treatment plan consistently and attend all scheduled appointments. Don't skip doses or visits, even if you feel better.",
    "🗣️ **Communicate**: Always share any concerns or changes in how you feel with your care team. No question is too small when it comes to your health.",
  ],
};

/** Generate personalized education content */
export function generateEducation(
  patientName: string,
  diagnosis: string,
  riskFactors: string[],
  language: string = 'English'
): { title: string; content: string } {
  const diagKey = diagnosis.toLowerCase();
  const diagInfo = DIAGNOSIS_INFO[diagKey] || DIAGNOSIS_INFO['default'];

  const title = `Understanding Your Treatment for ${diagnosis}`;

  let content = `## Hello, ${patientName}! 👋\n\n`;
  content += `We've prepared this guide especially for you to help you understand your treatment and feel more confident about your health journey.\n\n`;
  content += `### About ${diagnosis}\n\n${diagInfo}\n\n`;
  content += `---\n\n### Tips for Your Specific Challenges\n\n`;

  for (const factor of riskFactors) {
    const factorKey = factor.toLowerCase();
    const tips = RISK_FACTOR_TIPS[factorKey] || RISK_FACTOR_TIPS['default'];
    content += `#### Handling ${factor}\n\n`;
    for (const tip of tips) {
      content += `${tip}\n\n`;
    }
  }

  content += `---\n\n### Remember, ${patientName}! 💙\n\n`;
  content += `You are not alone in this journey. Your care team is here to support you every step of the way. `;
  content += `Don't hesitate to ask questions, share concerns, or seek help whenever you need it. `;
  content += `Every day you continue your treatment is a step towards better health. **You've got this!** 🌟\n`;

  return { title, content };
}

// ==================== FINANCIAL ASSISTANCE ENGINE ====================

interface FinancialScheme {
  schemeName: string;
  description: string;
  howToApply: string;
}

interface CostSavingTip {
  tip: string;
  details: string;
}

const GOVERNMENT_SCHEMES: FinancialScheme[] = [
  {
    schemeName: 'Ayushman Bharat (PM-JAY)',
    description: 'A government health insurance scheme providing free coverage up to ₹5 lakh per family per year for secondary and tertiary care hospitalization.',
    howToApply: 'Visit the nearest Common Service Centre (CSC) or Ayushman Bharat centre at the hospital. Carry your Aadhaar card and ration card. The hospital help desk can assist you with verification.',
  },
  {
    schemeName: 'Rashtriya Swasthya Bima Yojana (RSBY)',
    description: 'Health insurance for families below the poverty line, covering hospitalization expenses and transport costs.',
    howToApply: 'Contact your local panchayat office or district hospital social worker. Carry your BPL card and family details for enrollment.',
  },
  {
    schemeName: 'Pradhan Mantri Jan Arogya Yojana',
    description: 'Provides cashless and paperless access to health insurance cover for hospital expenses, especially for economically weaker sections.',
    howToApply: 'Check your eligibility on the mera.pmjay.gov.in website or call the helpline 14555. Visit the Ayushman Mitra at any empanelled hospital.',
  },
  {
    schemeName: 'State Health Insurance Scheme',
    description: 'Many states offer their own health insurance programs for low-income families. Coverage varies but often includes hospitalization and treatment costs.',
    howToApply: 'Visit your district hospital\'s help desk or contact the state health department. Carry your state ID, income certificate, and Aadhaar for enrollment.',
  },
  {
    schemeName: 'Hospital Charity/Welfare Fund',
    description: 'Most government and many private hospitals maintain a Patient Welfare Fund for patients who cannot afford treatment costs.',
    howToApply: 'Speak to the hospital social worker or Patient Welfare Officer. They can guide you through the application process and required documentation.',
  },
];

const TB_SCHEMES: FinancialScheme[] = [
  {
    schemeName: 'Nikshay Poshan Yojana',
    description: 'A government scheme that provides ₹500 per month directly to TB patients during their treatment period, to help with nutrition.',
    howToApply: 'Your TB treatment centre should register you automatically. Ensure your name and bank account details are updated with the DOTS provider. Check status on the Nikshay portal.',
  },
];

const GENERAL_COST_TIPS: CostSavingTip[] = [
  {
    tip: 'Use Jan Aushadhi Kendras for Generic Medicines',
    details: 'Jan Aushadhi Kendras (Pradhan Mantri Bhartiya Janaushadhi Kendras) offer quality generic medicines at 50-90% less cost than branded ones. Ask your doctor to prescribe generic medicines and purchase from the nearest Jan Aushadhi store.',
  },
  {
    tip: 'Use Government Diagnostic Labs',
    details: 'Government hospitals and PHCs offer free or very low-cost blood tests, X-rays, and other investigations. Ask your doctor if your tests can be done at a government facility.',
  },
  {
    tip: 'Inquire About Hospital Travel Subsidies',
    details: 'Many hospitals provide travel allowances or arrange shared transport for patients coming from far distances. Ask the Patient Welfare Officer about available travel support.',
  },
  {
    tip: 'Explore NGO Support Programs',
    details: 'Organizations like Indian Cancer Society, Tata Trusts, and other NGOs offer financial aid for treatment. Ask your hospital social worker for contact details of relevant NGOs in your area.',
  },
  {
    tip: 'Apply for Income-based Fee Waivers',
    details: 'Government hospitals often have a fee waiver system for patients below the poverty line. Carry your income certificate and BPL card to apply for reduced rates.',
  },
];

/** Generate financial assistance guidance */
export function generateFinancialGuidance(
  patientName: string,
  diagnosis: string,
  incomeLevel: 'Low' | 'Medium' | 'High',
  primaryRiskFactor: string
): {
  eligibleSchemes: FinancialScheme[];
  costSavingTips: CostSavingTip[];
  financialCounselingAdvice: string;
} {
  // Select schemes based on income and diagnosis
  let schemes: FinancialScheme[] = [];
  const diagLower = diagnosis.toLowerCase();

  // Always include primary government scheme
  schemes.push(GOVERNMENT_SCHEMES[0]); // Ayushman Bharat

  // Add TB-specific schemes
  if (diagLower.includes('tb') || diagLower.includes('tuberculosis')) {
    schemes.push(...TB_SCHEMES);
  }

  // Add income-based schemes
  if (incomeLevel === 'Low') {
    schemes.push(GOVERNMENT_SCHEMES[1]); // RSBY
    schemes.push(GOVERNMENT_SCHEMES[4]); // Hospital Welfare Fund
  } else if (incomeLevel === 'Medium') {
    schemes.push(GOVERNMENT_SCHEMES[3]); // State schemes
    schemes.push(GOVERNMENT_SCHEMES[4]); // Hospital Welfare Fund
  } else {
    schemes.push(GOVERNMENT_SCHEMES[2]); // PM-JAY
  }

  // Limit to 3
  schemes = schemes.slice(0, 3);

  // Select cost-saving tips
  const tips = incomeLevel === 'Low'
    ? GENERAL_COST_TIPS.slice(0, 3)
    : incomeLevel === 'Medium'
    ? [GENERAL_COST_TIPS[0], GENERAL_COST_TIPS[2], GENERAL_COST_TIPS[3]]
    : [GENERAL_COST_TIPS[0], GENERAL_COST_TIPS[3], GENERAL_COST_TIPS[4]];

  // Generate counseling advice
  const financialCounselingAdvice = `Dear ${patientName}, managing finances during treatment can feel stressful, but please remember that help is available. Start by speaking with the hospital's Patient Welfare Officer or social worker — they are trained to help patients like you navigate financial challenges. Plan your expenses for the month, and don't hesitate to ask about installment options if a large payment is due. ${incomeLevel === 'Low' ? 'As a priority, check your eligibility for government schemes — many patients receive free or heavily subsidized treatment. ' : ''}Remember, your health is the most important investment you can make. No one should have to stop treatment because of money worries. We are here to help you find a way through. Stay strong! 💙`;

  return {
    eligibleSchemes: schemes,
    costSavingTips: tips,
    financialCounselingAdvice,
  };
}
