'use client';

import { generateDoctorRiskSummaryAction } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import type { Patient } from '@/lib/types';
import { FileText, Loader2, Wand2 } from 'lucide-react';
import { useState, useTransition } from 'react';

export default function DoctorSummary({ patient }: { patient: Patient }) {
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, startLoadingTransition] = useTransition();
  const { toast } = useToast();

  const handleGenerate = () => {
    startLoadingTransition(async () => {
      const riskFactors = patient.riskBreakdown.map(factor => ({
        factor: factor.name,
        percentage: factor.score,
      }));

      const behavioralTimelineSummary = patient.behavioralTimeline
        .map(e => e.description)
        .slice(0, 3) // Take the 3 most recent
        .join(', ');

      const input = {
        patientName: patient.name,
        diagnosis: patient.diagnosis,
        overallRiskScore: patient.riskScore,
        riskFactors: riskFactors,
        behavioralTimelineSummary,
      };

      const result = await generateDoctorRiskSummaryAction(input);
      if (result.success && result.data) {
        setSummary(result.data.summary);
        toast({ title: 'AI Summary Generated' });
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
          <FileText className="text-primary" />
          <span>Doctor's AI Summary</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {summary ? (
          <div className="space-y-4">
             <p className="text-sm text-muted-foreground">{summary}</p>
             <Button onClick={handleGenerate} disabled={isLoading} className="w-full mt-4" variant="outline">
                {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Wand2 className="mr-2 h-4 w-4" />
                )}
                Regenerate Summary
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <p className="mb-4 text-muted-foreground">Generate a quick narrative summary of the patient's risk factors.</p>
            <Button onClick={handleGenerate} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="mr-2 h-4 w-4" />
              )}
              Generate Summary
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
