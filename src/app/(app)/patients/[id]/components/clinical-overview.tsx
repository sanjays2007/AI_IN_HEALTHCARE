import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { Patient } from '@/lib/types';

export default function ClinicalOverview({ patient }: { patient: Patient }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Clinical Overview</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Treatment Phase</p>
            <p className="font-medium">{patient.treatmentPhase}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Medication</p>
            <p className="font-medium">{patient.medicationPlan}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Lab Progress</p>
            <p className="font-medium">{patient.labProgress}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Last Visit</p>
            <p className="font-medium">{new Date(patient.lastVisit).toLocaleDateString()}</p>
          </div>
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-1">Treatment Completion</p>
          <div className="flex items-center gap-2">
            <Progress value={patient.completionPercentage} className="h-3" />
            <span className="text-sm font-medium">{patient.completionPercentage}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
