'use client';

import { generateFinancialAssistanceAction } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import type { Patient } from '@/lib/types';
import { Banknote, Loader2 } from 'lucide-react';
import { useState, useTransition } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

type AssistanceData = {
    eligibleSchemes: {
        schemeName: string;
        description: string;
        howToApply: string;
    }[];
    costSavingTips: {
        tip: string;
        details: string;
    }[];
    financialCounselingAdvice: string;
};


export default function FinancialAssistance({ patient }: { patient: Patient }) {
  const [assistance, setAssistance] = useState<AssistanceData | null>(null);
  const [isGenerating, startGeneratingTransition] = useTransition();
  const { toast } = useToast();

  const handleGenerate = () => {
    startGeneratingTransition(async () => {
      const input = {
        patientName: patient.name,
        diagnosis: patient.diagnosis,
        incomeLevel: patient.incomeLevel,
        primaryRiskFactor: patient.primaryRiskFactor,
      };

      const result = await generateFinancialAssistanceAction(input);
      if (result.success && result.data) {
        setAssistance(result.data);
        toast({ title: 'Financial Assistance Plan Generated' });
      } else {
        toast({
          variant: 'destructive',
          title: 'Generation Failed',
          description: result.error,
        });
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Banknote className="text-primary" />
          <span>Financial Assistance</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {assistance ? (
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Eligible Schemes</AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-4">
                  {assistance.eligibleSchemes.map((scheme, i) => (
                    <li key={i} className="text-sm">
                      <p className="font-semibold">{scheme.schemeName}</p>
                      <p className="text-muted-foreground">{scheme.description}</p>
                      <p className="mt-1 text-xs"><span className="font-medium">How to apply:</span> {scheme.howToApply}</p>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Cost Saving Tips</AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-3">
                  {assistance.costSavingTips.map((tip, i) => (
                    <li key={i} className="text-sm">
                        <p className="font-semibold">{tip.tip}</p>
                        <p className="text-muted-foreground">{tip.details}</p>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Financial Counseling</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground">{assistance.financialCounselingAdvice}</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ) : (
          <div className="space-y-4 text-center">
            <p className="text-muted-foreground text-sm">Generate a financial assistance plan including eligible government schemes, cost-saving tips, and counseling for the patient.</p>
            <Button onClick={handleGenerate} disabled={isGenerating} className="w-full">
            {isGenerating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Analyze Financial Options
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
