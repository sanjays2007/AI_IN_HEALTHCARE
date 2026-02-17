import { patients } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Image from 'next/image';
import ClinicalOverview from './components/clinical-overview';
import RiskPanel from './components/risk-panel';
import BehavioralTimeline from './components/behavioral-timeline';
import RecommendationPanel from './components/recommendation-panel';
import SimulationTool from './components/simulation-tool';
import { Badge } from '@/components/ui/badge';
import type { Metadata } from 'next';

type PatientDetailPageProps = {
  params: { id: string };
};

export async function generateMetadata({ params }: PatientDetailPageProps): Promise<Metadata> {
  const patient = patients.find((p) => p.id === params.id);
  if (!patient) {
    return { title: 'Patient Not Found' };
  }
  return {
    title: `Risk Profile - ${patient.name}`,
  };
}

export default function PatientDetailPage({ params }: PatientDetailPageProps) {
  const patient = patients.find((p) => p.id === params.id);

  if (!patient) {
    notFound();
  }

  const riskBadgeVariant = patient.riskCategory === 'Critical' ? 'destructive' : 'default';
  const riskBadgeClass = patient.riskCategory === 'High' 
    ? 'bg-yellow-500/80 text-yellow-foreground hover:bg-yellow-500/90'
    : patient.riskCategory === 'Medium'
    ? 'bg-blue-500/80 text-white hover:bg-blue-500/90'
    : 'bg-green-500/80 text-white hover:bg-green-500/90';

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-primary">
            <AvatarImage asChild src={patient.avatarUrl}>
              <Image src={patient.avatarUrl} alt={patient.name} width={64} height={64} data-ai-hint="person portrait" />
            </AvatarImage>
            <AvatarFallback className="text-xl">{patient.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{patient.name}</h1>
            <p className="text-muted-foreground">{patient.diagnosis}</p>
          </div>
        </div>
        <Badge variant={riskBadgeVariant} className={`text-lg px-4 py-2 ${patient.riskCategory !== 'Critical' ? riskBadgeClass : ''}`}>
          {patient.riskCategory} Risk
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3 flex flex-col gap-6">
          <ClinicalOverview patient={patient} />
          <BehavioralTimeline events={patient.behavioralTimeline} />
        </div>
        <div className="lg:col-span-2 flex flex-col gap-6">
          <RiskPanel patient={patient} />
          <RecommendationPanel patient={patient} />
          <SimulationTool patient={patient} />
        </div>
      </div>
    </div>
  );
}
