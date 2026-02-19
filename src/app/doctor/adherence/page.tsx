'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Activity,
  Pill,
  Calendar,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';
import {
  mockPatientRiskProfiles,
  getRiskBadgeVariant,
} from '@/lib/doctor-data';

export default function AdherenceMonitorPage() {
  const [patients] = useState(mockPatientRiskProfiles);
  const [sortBy, setSortBy] = useState<'medication' | 'appointment' | 'communication'>('medication');

  const sortedPatients = [...patients].sort((a, b) => {
    switch (sortBy) {
      case 'medication':
        return a.medicationAdherence - b.medicationAdherence;
      case 'appointment':
        return a.appointmentAdherence - b.appointmentAdherence;
      case 'communication':
        return a.communicationResponseRate - b.communicationResponseRate;
      default:
        return 0;
    }
  });

  const getAdherenceColor = (value: number) => {
    if (value >= 80) return { text: 'text-green-600', bg: '[&>div]:bg-green-500', label: 'Good' };
    if (value >= 60) return { text: 'text-yellow-600', bg: '[&>div]:bg-yellow-500', label: 'Fair' };
    return { text: 'text-red-600', bg: '[&>div]:bg-red-500', label: 'Poor' };
  };

  // Calculate averages
  const avgMedication = Math.round(patients.reduce((sum, p) => sum + p.medicationAdherence, 0) / patients.length);
  const avgAppointment = Math.round(patients.reduce((sum, p) => sum + p.appointmentAdherence, 0) / patients.length);
  const avgCommunication = Math.round(patients.reduce((sum, p) => sum + p.communicationResponseRate, 0) / patients.length);

  const poorAdherenceCount = patients.filter(p => p.medicationAdherence < 60 || p.appointmentAdherence < 60).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Activity className="h-8 w-8 text-blue-600" />
          Adherence Monitoring
        </h1>
        <p className="text-muted-foreground">
          Track patient treatment compliance across all metrics
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Medication</CardTitle>
            <Pill className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getAdherenceColor(avgMedication).text}`}>
              {avgMedication}%
            </div>
            <Progress value={avgMedication} className={`h-2 mt-2 ${getAdherenceColor(avgMedication).bg}`} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Appointment</CardTitle>
            <Calendar className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getAdherenceColor(avgAppointment).text}`}>
              {avgAppointment}%
            </div>
            <Progress value={avgAppointment} className={`h-2 mt-2 ${getAdherenceColor(avgAppointment).bg}`} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Communication</CardTitle>
            <MessageSquare className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getAdherenceColor(avgCommunication).text}`}>
              {avgCommunication}%
            </div>
            <Progress value={avgCommunication} className={`h-2 mt-2 ${getAdherenceColor(avgCommunication).bg}`} />
          </CardContent>
        </Card>

        <Card className="border-red-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Poor Adherence</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{poorAdherenceCount}</div>
            <p className="text-xs text-muted-foreground">Patients needing attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Sort Options */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">Sort by lowest:</span>
        <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="medication">Medication Adherence</SelectItem>
            <SelectItem value="appointment">Appointment Adherence</SelectItem>
            <SelectItem value="communication">Communication Rate</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Patient Adherence List */}
      <div className="space-y-3">
        {sortedPatients.map((patient) => {
          const medColor = getAdherenceColor(patient.medicationAdherence);
          const apptColor = getAdherenceColor(patient.appointmentAdherence);
          const commColor = getAdherenceColor(patient.communicationResponseRate);
          const needsAttention = patient.medicationAdherence < 60 || patient.appointmentAdherence < 60;

          return (
            <Card 
              key={patient.id}
              className={needsAttention ? 'border-red-200 bg-red-50/50 dark:bg-red-900/10' : ''}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Link 
                        href={`/doctor/patients/${patient.id}`}
                        className="font-semibold text-blue-600 hover:underline"
                      >
                        {patient.name}
                      </Link>
                      <Badge variant={getRiskBadgeVariant(patient.riskCategory)}>
                        {patient.riskCategory}
                      </Badge>
                      {needsAttention && (
                        <Badge variant="destructive" className="ml-auto">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Needs Attention
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {patient.diagnosis} • {patient.treatmentType}
                    </p>

                    <div className="grid gap-3 md:grid-cols-3">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-1">
                            <Pill className="h-3 w-3" />
                            Medication
                          </span>
                          <span className={`font-bold ${medColor.text}`}>
                            {patient.medicationAdherence}%
                          </span>
                        </div>
                        <Progress value={patient.medicationAdherence} className={`h-2 ${medColor.bg}`} />
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Appointments
                          </span>
                          <span className={`font-bold ${apptColor.text}`}>
                            {patient.appointmentAdherence}%
                          </span>
                        </div>
                        <Progress value={patient.appointmentAdherence} className={`h-2 ${apptColor.bg}`} />
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            Communication
                          </span>
                          <span className={`font-bold ${commColor.text}`}>
                            {patient.communicationResponseRate}%
                          </span>
                        </div>
                        <Progress value={patient.communicationResponseRate} className={`h-2 ${commColor.bg}`} />
                      </div>
                    </div>
                  </div>

                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/doctor/patients/${patient.id}`}>
                      View
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
