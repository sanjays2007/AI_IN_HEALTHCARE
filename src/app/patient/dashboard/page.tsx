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
import { useToast } from '@/hooks/use-toast';
import {
  CalendarCheck,
  Pill,
  Heart,
  AlertTriangle,
  TrendingUp,
  Clock,
  FileText,
  ChevronRight,
  Sun,
  Sunset,
  Moon,
  Coffee,
  CheckCircle2,
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

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  timing: 'morning-before' | 'morning-after' | 'afternoon' | 'night';
  timingLabel: string;
  scheduledTime: string;
  taken: boolean;
}

const initialMedications: Medication[] = [
  { id: '1', name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', timing: 'morning-after', timingLabel: 'After Breakfast', scheduledTime: '8:30 AM', taken: false },
  { id: '2', name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', timing: 'morning-before', timingLabel: 'Before Breakfast', scheduledTime: '7:00 AM', taken: false },
  { id: '3', name: 'Aspirin', dosage: '81mg', frequency: 'Once daily', timing: 'afternoon', timingLabel: 'After Lunch', scheduledTime: '1:00 PM', taken: false },
  { id: '4', name: 'Vitamin D', dosage: '1000IU', frequency: 'Once daily', timing: 'night', timingLabel: 'After Dinner', scheduledTime: '8:00 PM', taken: false },
];

const recentAlerts = [
  { id: '1', message: 'Upcoming appointment in 6 days', type: 'info' },
  { id: '2', message: 'Complete your weekly mood check-in', type: 'reminder' },
];

const getTimingIcon = (timing: string) => {
  switch (timing) {
    case 'morning-before':
    case 'morning-after':
      return <Sun className="h-4 w-4 text-yellow-500" />;
    case 'afternoon':
      return <Sunset className="h-4 w-4 text-orange-500" />;
    case 'night':
      return <Moon className="h-4 w-4 text-indigo-500" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

const getTimingColor = (timing: string) => {
  switch (timing) {
    case 'morning-before':
    case 'morning-after':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
    case 'afternoon':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100';
    case 'night':
      return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100';
    default:
      return '';
  }
};

export default function PatientDashboardPage() {
  const [medications, setMedications] = useState<Medication[]>(initialMedications);
  const { toast } = useToast();
  
  const takenMeds = medications.filter(m => m.taken).length;
  const adherencePercent = Math.round((takenMeds / medications.length) * 100);

  const handleTakeMedication = (id: string) => {
    setMedications(prev => prev.map(med => 
      med.id === id ? { ...med, taken: true } : med
    ));
    
    const med = medications.find(m => m.id === id);
    toast({
      title: "Medication Taken",
      description: `${med?.name} ${med?.dosage} marked as taken.`,
    });
  };

  // Get current time-based reminder
  const getCurrentReminder = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 9) {
      return { message: "Good morning! Time for your morning medications", timing: 'morning' };
    } else if (hour >= 12 && hour < 14) {
      return { message: "Lunch time! Don't forget your afternoon dose", timing: 'afternoon' };
    } else if (hour >= 19 && hour < 22) {
      return { message: "Evening reminder: Take your night medications", timing: 'night' };
    }
    return null;
  };

  const currentReminder = getCurrentReminder();
  const pendingMeds = medications.filter(m => !m.taken);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {patientData.name}</h1>
        <p className="text-muted-foreground">
          Here&apos;s an overview of your health journey
        </p>
      </div>

      {/* Medication Reminder Alert */}
      {pendingMeds.length > 0 && (
        <Card className="border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950">
          <CardContent className="flex items-center gap-4 py-4">
            <div className="rounded-full bg-orange-100 p-2 dark:bg-orange-900">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium">Medication Reminder</p>
              <p className="text-sm text-muted-foreground">
                You have {pendingMeds.length} medication{pendingMeds.length > 1 ? 's' : ''} pending for today
              </p>
            </div>
            <Button size="sm" variant="outline" asChild>
              <Link href="#medications">View Schedule</Link>
            </Button>
          </CardContent>
        </Card>
      )}

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
        <Card id="medications">
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
                  className={`p-4 rounded-lg border ${
                    med.taken 
                      ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-900' 
                      : 'bg-muted/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`h-3 w-3 rounded-full ${med.taken ? 'bg-green-500' : 'bg-orange-400'}`} />
                      <div>
                        <p className="font-medium">{med.name}</p>
                        <p className="text-xs text-muted-foreground">{med.dosage} - {med.frequency}</p>
                      </div>
                    </div>
                    {med.taken ? (
                      <Badge variant="default" className="bg-green-600">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Taken
                      </Badge>
                    ) : (
                      <Button 
                        size="sm" 
                        onClick={() => handleTakeMedication(med.id)}
                        className="bg-primary hover:bg-primary/90"
                      >
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        Mark as Taken
                      </Button>
                    )}
                  </div>
                  {/* Timing Reminder */}
                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-dashed">
                    {getTimingIcon(med.timing)}
                    <Badge variant="secondary" className={getTimingColor(med.timing)}>
                      {med.timingLabel}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {med.scheduledTime}
                    </span>
                  </div>
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
