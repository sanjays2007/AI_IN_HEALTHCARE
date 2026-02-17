'use client';

import { getInterventionRecommendationsAction, logInterventionAction } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import type { Intervention, Patient } from '@/lib/types';
import { Bot, Check, Loader2, ThumbsDown, ThumbsUp, Wand2 } from 'lucide-react';
import { useState, useTransition } from 'react';

export default function RecommendationPanel({ patient }: { patient: Patient }) {
  const [recommendations, setRecommendations] = useState<Intervention[]>([]);
  const [isLoading, startLoadingTransition] = useTransition();
  const [isLogging, startLoggingTransition] = useTransition();
  const { toast } = useToast();

  const handleGenerate = () => {
    startLoadingTransition(async () => {
      const input = {
        diagnosis: patient.diagnosis,
        treatmentPhase: patient.treatmentPhase,
        medicationPlan: patient.medicationPlan,
        labProgress: patient.labProgress,
        completionPercentage: patient.completionPercentage,
        riskBreakdown: patient.riskBreakdown.reduce((acc, curr) => ({...acc, [curr.name.toLowerCase().replace(' ', '')]: curr.score}), {} as any),
        behavioralTimeline: patient.behavioralTimeline.map(e => e.description),
      };

      const result = await getInterventionRecommendationsAction(input);
      if (result.success && result.data) {
        setRecommendations(result.data.recommendations);
        toast({ title: 'AI Recommendations Generated', description: 'Review the suggestions below.' });
      } else {
        toast({
          variant: 'destructive',
          title: 'Generation Failed',
          description: result.error,
        });
      }
    });
  };

  const handleAction = (intervention: Intervention, action: 'Accepted' | 'Rejected') => {
    startLoggingTransition(async () => {
        const { success, message } = await logInterventionAction(patient.id, intervention, action);
        if (success) {
            toast({
                title: `Intervention ${action}`,
                description: `${intervention.type} has been logged.`,
            });
            setRecommendations(prev => prev.filter(r => r.type !== intervention.type));
        } else {
            toast({ variant: 'destructive', title: 'Error', description: message });
        }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="text-primary" />
          <span>AI Recommendation Panel</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recommendations.length === 0 ? (
          <div className="text-center">
            <p className="mb-4 text-muted-foreground">Generate AI-powered intervention suggestions.</p>
            <Button onClick={handleGenerate} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="mr-2 h-4 w-4" />
              )}
              Generate Recommendations
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <div key={index} className="p-3 rounded-lg border bg-card-foreground/5">
                <p className="font-semibold">{rec.type}</p>
                <p className="text-sm text-muted-foreground">{rec.description}</p>
                <div className="flex items-center justify-between mt-2">
                  <div className="text-xs font-medium">
                    Priority: <span className={rec.priority === 'High' ? 'text-destructive' : ''}>{rec.priority}</span>
                  </div>
                  <div className="flex gap-2">
                     <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => handleAction(rec, 'Accepted')} disabled={isLogging}>
                        <ThumbsUp className="h-4 w-4 text-green-500" />
                    </Button>
                     <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => handleAction(rec, 'Rejected')} disabled={isLogging}>
                        <ThumbsDown className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
             <Button onClick={handleGenerate} disabled={isLoading} className="w-full mt-4">
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="mr-2 h-4 w-4" />
              )}
              Regenerate
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
