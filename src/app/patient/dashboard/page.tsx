'use client';

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
  CalendarCheck,
  Pill,
  Heart,
  AlertTriangle,
  TrendingUp,
  Clock,
  FileText,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';

// Mock patient data
const patientData = {
  name: 'John Patient',
  adherenceScore: 85,
  nextAppointment: '2026-02-25T10:00:00',
  activeMedications: 4,
  completedMedications: 3,
  upcomingAppointments: 2,
  recentMoodScore: 7,
  riskLevel: 'low' as const,
};

const upcomingAppointments = [
  { id: '1', type: 'Check-up', doctor: 'Dr. Evans', date: '2026-02-25', time: '10:00 AM' },
  { id: '2', type: 'Lab Work', doctor: 'Lab', date: '2026-03-01', time: '9:00 AM' },
];

const medications = [
  { id: '1', name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', nextDose: '6:00 PM', taken: true },
  { id: '2', name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', nextDose: '8:00 AM', taken: true },
  { id: '3', name: 'Aspirin', dosage: '81mg', frequency: 'Once daily', nextDose: '8:00 AM', taken: true },
  { id: '4', name: 'Vitamin D', dosage: '1000IU', frequency: 'Once daily', nextDose: '8:00 AM', taken: false },
];

const recentAlerts = [
  { id: '1', message: 'Upcoming appointment in 6 days', type: 'info' },
  { id: '2', message: 'Complete your weekly mood check-in', type: 'reminder' },
];

export default function PatientDashboardPage() {
  const takenMeds = medications.filter(m => m.taken).length;
  const adherencePercent = Math.round((takenMeds / medications.length) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {patientData.name}</h1>
        <p className="text-muted-foreground">
          Here&apos;s an overview of your health journey
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Adherence Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{patientData.adherenceScore}%</div>
            <Progress value={patientData.adherenceScore} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">Great progress!</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today&apos;s Medications</CardTitle>
            <Pill className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{takenMeds}/{medications.length}</div>
            <Progress value={adherencePercent} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {medications.length - takenMeds} remaining today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Appointment</CardTitle>
            <CalendarCheck className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Feb 25</div>
            <p className="text-xs text-muted-foreground mt-2">
              Check-up with Dr. Evans at 10:00 AM
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mood Score</CardTitle>
            <Heart className="h-4 w-4 text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{patientData.recentMoodScore}/10</div>
            <p className="text-xs text-muted-foreground mt-2">
              Last check-in: Yesterday
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Medications */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Today&apos;s Medications</CardTitle>
              <CardDescription>Track your daily medication intake</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/patient/medications">
                View All <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {medications.map((med) => (
                <div
                  key={med.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-3 w-3 rounded-full ${med.taken ? 'bg-green-500' : 'bg-orange-400'}`} />
                    <div>
                      <p className="font-medium">{med.name}</p>
                      <p className="text-xs text-muted-foreground">{med.dosage} - {med.frequency}</p>
                    </div>
                  </div>
                  <Badge variant={med.taken ? 'default' : 'outline'}>
                    {med.taken ? 'Taken' : 'Pending'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>Your scheduled visits</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/patient/appointments">
                View All <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <CalendarCheck className="h-5 w-5 text-purple-500" />
                    <div>
                      <p className="font-medium">{apt.type}</p>
                      <p className="text-xs text-muted-foreground">{apt.doctor}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{apt.date}</p>
                    <p className="text-xs text-muted-foreground">{apt.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Alerts</CardTitle>
            <CardDescription>Important notifications for you</CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/patient/alerts">
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentAlerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
              >
                <AlertTriangle className={`h-5 w-5 ${alert.type === 'info' ? 'text-blue-500' : 'text-orange-500'}`} />
                <p className="text-sm">{alert.message}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-4">
        <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" asChild>
          <Link href="/patient/mood">
            <Heart className="h-6 w-6" />
            <span>Mood Check-in</span>
          </Link>
        </Button>
        <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" asChild>
          <Link href="/patient/side-effects">
            <AlertTriangle className="h-6 w-6" />
            <span>Report Side Effect</span>
          </Link>
        </Button>
        <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" asChild>
          <Link href="/patient/education">
            <FileText className="h-6 w-6" />
            <span>Education Center</span>
          </Link>
        </Button>
        <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" asChild>
          <Link href="/patient/support">
            <Clock className="h-6 w-6" />
            <span>Get Support</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
