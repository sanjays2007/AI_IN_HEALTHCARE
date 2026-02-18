'use client';

import { generatePersonalizedEducationAction } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import type { Patient } from '@/lib/types';
import { BookOpen, Loader2 } from 'lucide-react';
import { useState, useTransition } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type EducationContent = {
  title: string;
  content: string;
};

export default function PersonalizedEducation({ patient }: { patient: Patient }) {
  const [education, setEducation] = useState<EducationContent | null>(null);
  const [language, setLanguage] = useState<string>('English');
  const [isGenerating, startGeneratingTransition] = useTransition();
  const { toast } = useToast();

  const handleGenerate = () => {
    startGeneratingTransition(async () => {
      const input = {
        patientName: patient.name,
        diagnosis: patient.diagnosis,
        riskFactors: patient.riskBreakdown.map(rf => rf.name),
        language: language,
      };

      const result = await generatePersonalizedEducationAction(input);
      if (result.success && result.data) {
        setEducation(result.data);
        toast({ title: 'Personalized Education Generated' });
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
          <BookOpen className="text-primary" />
          <span>Personalized Education</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {education ? (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">{education.title}</h3>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{education.content}</p>
             <Button onClick={handleGenerate} disabled={isGenerating} className="w-full mt-4" variant="outline">
                {isGenerating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : "Regenerate"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4 text-center">
            <p className="text-muted-foreground text-sm">Generate a simple, personalized education plan for the patient based on their diagnosis and risk factors.</p>
            <div className="flex gap-2">
                <Select onValueChange={setLanguage} defaultValue={language} disabled={isGenerating}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="Spanish">Spanish</SelectItem>
                        <SelectItem value="Hindi">Hindi</SelectItem>
                    </SelectContent>
                </Select>
                <Button onClick={handleGenerate} disabled={isGenerating} className="flex-grow">
                {isGenerating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Generate
                </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
