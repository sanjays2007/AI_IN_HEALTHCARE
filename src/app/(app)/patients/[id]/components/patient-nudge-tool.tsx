'use client';

import { generatePatientNudgeAction } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import type { Patient } from '@/lib/types';
import { Hand, Loader2, MessageSquareQuote } from 'lucide-react';
import { useState, useTransition } from 'react';

const nudgeTones = ['supportive', 'urgent', 'informative', 'motivational'];

export default function PatientNudgeTool({ patient }: { patient: Patient }) {
  const [tone, setTone] = useState<string>('supportive');
  const [specificContext, setSpecificContext] = useState<string>('');
  const [nudge, setNudge] = useState<string | null>(null);
  const [isGenerating, startGeneratingTransition] = useTransition();
  const { toast } = useToast();

  const handleGenerate = () => {
    startGeneratingTransition(async () => {
      const lastAction = patient.behavioralTimeline[0];
      const input = {
        patientName: patient.name,
        treatmentPhase: patient.treatmentPhase,
        lastActionDetails: lastAction ? `${lastAction.description}: ${lastAction.details}` : 'No recent actions logged.',
        specificContext: specificContext || undefined,
        tone: tone as any,
      };

      const result = await generatePatientNudgeAction(input);

      if (result.success && result.data) {
        setNudge(result.data.nudgeMessage);
        toast({ title: 'Patient Nudge Generated' });
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
          <MessageSquareQuote className="text-primary" />
          <span>Patient Nudge Tool</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Select onValueChange={setTone} defaultValue={tone} disabled={isGenerating}>
            <SelectTrigger>
              <SelectValue placeholder="Select a tone" />
            </SelectTrigger>
            <SelectContent>
              {nudgeTones.map((option) => (
                <SelectItem key={option} value={option} className="capitalize">
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Textarea
            placeholder="Add specific context (optional)..."
            value={specificContext}
            onChange={(e) => setSpecificContext(e.target.value)}
            disabled={isGenerating}
            rows={2}
          />
          <Button onClick={handleGenerate} disabled={isGenerating} className="w-full">
            {isGenerating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Hand className="mr-2 h-4 w-4" />
            )}
            Generate Nudge
          </Button>

          {nudge && (
            <div className="mt-4 space-y-2 rounded-lg border bg-card-foreground/5 p-4 animate-in fade-in-50">
              <p className="font-semibold text-sm">Generated Message:</p>
              <p className="text-sm text-muted-foreground">{nudge}</p>
              <Button variant="secondary" size="sm" className="w-full mt-2" onClick={() => {
                  navigator.clipboard.writeText(nudge);
                  toast({ title: 'Copied to clipboard!' });
                }}>
                Copy Message
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
