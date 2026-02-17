'use client';

import { runPredictiveSimulationAction } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import type { Patient } from '@/lib/types';
import { BrainCircuit, Loader2 } from 'lucide-react';
import { useState, useTransition } from 'react';

const interventionOptions = [
  'Financial support added',
  'Adjust dosage',
  'Schedule tele-consult',
  'Refer to financial counselor',
  'Trigger nurse follow-up',
  'Assign mental health support',
];

type SimulationResult = {
  simulatedDropoutProbability: number;
  interventionEffectDescription: string;
  noInterventionDropoutProbability: number;
};

export default function SimulationTool({ patient }: { patient: Patient }) {
  const [selectedIntervention, setSelectedIntervention] = useState<string | null>(null);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [isSimulating, startSimulatingTransition] = useTransition();
  const { toast } = useToast();

  const handleSimulate = () => {
    if (!selectedIntervention) {
      toast({
        variant: 'destructive',
        title: 'Select an intervention',
        description: 'You must choose an intervention to simulate its effect.',
      });
      return;
    }

    startSimulatingTransition(async () => {
      const input = {
        currentDropoutProbability: patient.riskScore,
        interventionType: selectedIntervention,
        patientContext: `Diagnosis: ${patient.diagnosis}, Primary Risk: ${patient.primaryRiskFactor}`,
      };
      const response = await runPredictiveSimulationAction(input);

      if (response.success && response.data) {
        setResult(response.data);
      } else {
        toast({
          variant: 'destructive',
          title: 'Simulation Failed',
          description: response.error,
        });
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BrainCircuit className="text-primary" />
          <span>Predictive Simulation</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Select onValueChange={setSelectedIntervention} disabled={isSimulating}>
            <SelectTrigger>
              <SelectValue placeholder="Select intervention to simulate" />
            </SelectTrigger>
            <SelectContent>
              {interventionOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleSimulate} disabled={isSimulating || !selectedIntervention} className="w-full">
            {isSimulating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Simulate Impact
          </Button>

          {result && (
            <div className="mt-4 space-y-4 rounded-lg border bg-card-foreground/5 p-4 animate-in fade-in-50">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-sm text-muted-foreground">Without Intervention</p>
                  <p className="text-4xl font-bold text-destructive">{result.noInterventionDropoutProbability}%</p>
                  <p className="text-xs text-muted-foreground">Dropout Probability</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">With Intervention</p>
                  <p className="text-4xl font-bold text-green-500">{result.simulatedDropoutProbability}%</p>
                   <p className="text-xs text-muted-foreground">Dropout Probability</p>
                </div>
              </div>
              <div>
                <p className="font-semibold text-sm">AI Rationale:</p>
                <p className="text-sm text-muted-foreground">{result.interventionEffectDescription}</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
