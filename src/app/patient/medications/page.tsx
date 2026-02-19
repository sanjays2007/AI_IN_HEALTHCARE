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
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import {
  Pill,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Info,
  Bell,
  ChevronRight,
} from 'lucide-react';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  timeOfDay: string[];
  instructions: string;
  prescribedBy: string;
  startDate: string;
  refillDate: string;
  pillsRemaining: number;
  totalPills: number;
  takenToday: boolean[];
  sideEffects?: string[];
}

const mockMedications: Medication[] = [
  {
    id: '1',
    name: 'Metformin',
    dosage: '500mg',
    frequency: 'Twice daily',
    timeOfDay: ['8:00 AM', '6:00 PM'],
    instructions: 'Take with meals to reduce stomach upset',
    prescribedBy: 'Dr. Sarah Evans',
    startDate: '2025-12-10',
    refillDate: '2026-03-10',
    pillsRemaining: 45,
    totalPills: 60,
    takenToday: [true, false],
    sideEffects: ['Nausea', 'Stomach upset'],
  },
  {
    id: '2',
    name: 'Lisinopril',
    dosage: '10mg',
    frequency: 'Once daily',
    timeOfDay: ['8:00 AM'],
    instructions: 'Take in the morning. Avoid potassium supplements.',
    prescribedBy: 'Dr. Michael Chen',
    startDate: '2026-01-15',
    refillDate: '2026-03-15',
    pillsRemaining: 25,
    totalPills: 30,
    takenToday: [true],
  },
  {
    id: '3',
    name: 'Aspirin',
    dosage: '81mg',
    frequency: 'Once daily',
    timeOfDay: ['8:00 AM'],
    instructions: 'Take with food or water',
    prescribedBy: 'Dr. Sarah Evans',
    startDate: '2025-11-01',
    refillDate: '2026-04-01',
    pillsRemaining: 60,
    totalPills: 90,
    takenToday: [true],
  },
  {
    id: '4',
    name: 'Vitamin D',
    dosage: '1000IU',
    frequency: 'Once daily',
    timeOfDay: ['8:00 AM'],
    instructions: 'Take with a fatty meal for better absorption',
    prescribedBy: 'Dr. Sarah Evans',
    startDate: '2025-10-01',
    refillDate: '2026-04-15',
    pillsRemaining: 80,
    totalPills: 90,
    takenToday: [false],
  },
];

export default function MedicationsPage() {
  const [medications, setMedications] = useState<Medication[]>(mockMedications);
  const { toast } = useToast();

  const handleTakeMedication = (medId: string, doseIndex: number) => {
    setMedications(prev =>
      prev.map(med => {
        if (med.id === medId) {
          const newTakenToday = [...med.takenToday];
          newTakenToday[doseIndex] = !newTakenToday[doseIndex];
          return {
            ...med,
            takenToday: newTakenToday,
            pillsRemaining: newTakenToday[doseIndex]
              ? med.pillsRemaining - 1
              : med.pillsRemaining + 1,
          };
        }
        return med;
      })
    );

    toast({
      title: 'Medication Updated',
      description: 'Your medication log has been updated.',
    });
  };

  const totalDoses = medications.reduce((acc, med) => acc + med.timeOfDay.length, 0);
  const takenDoses = medications.reduce(
    (acc, med) => acc + med.takenToday.filter(Boolean).length,
    0
  );
  const adherencePercent = Math.round((takenDoses / totalDoses) * 100);

  const needsRefill = medications.filter(med => {
    const refillDate = new Date(med.refillDate);
    const today = new Date();
    const daysUntilRefill = Math.ceil((refillDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilRefill <= 14 || med.pillsRemaining < 10;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Medications</h1>
        <p className="text-muted-foreground">
          Track and manage your daily medications
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today&apos;s Progress</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{takenDoses}/{totalDoses} doses</div>
            <Progress value={adherencePercent} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {adherencePercent}% completed today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Medications</CardTitle>
            <Pill className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{medications.length}</div>
            <p className="text-xs text-muted-foreground mt-2">
              Prescribed medications
            </p>
          </CardContent>
        </Card>

        <Card className={needsRefill.length > 0 ? 'border-orange-200 dark:border-orange-900' : ''}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Refills Needed</CardTitle>
            <AlertTriangle className={`h-4 w-4 ${needsRefill.length > 0 ? 'text-orange-500' : 'text-muted-foreground'}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{needsRefill.length}</div>
            <p className="text-xs text-muted-foreground mt-2">
              {needsRefill.length > 0 ? 'Schedule refills soon' : 'All stocked up'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Medications List */}
      <Tabs defaultValue="today" className="space-y-4">
        <TabsList>
          <TabsTrigger value="today">Today&apos;s Schedule</TabsTrigger>
          <TabsTrigger value="all">All Medications</TabsTrigger>
          <TabsTrigger value="refills">Refills</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Today&apos;s Medication Schedule</CardTitle>
              <CardDescription>Check off medications as you take them</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {medications.map(med =>
                med.timeOfDay.map((time, index) => (
                  <div
                    key={`${med.id}-${index}`}
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      med.takenToday[index]
                        ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-900'
                        : 'bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <Checkbox
                        checked={med.takenToday[index]}
                        onCheckedChange={() => handleTakeMedication(med.id, index)}
                      />
                      <div>
                        <p className="font-medium">
                          {med.name} - {med.dosage}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {med.frequency} • {time}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{time}</span>
                      <Badge variant={med.takenToday[index] ? 'default' : 'outline'}>
                        {med.takenToday[index] ? 'Taken' : 'Pending'}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          {medications.map(med => (
            <Card key={med.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Pill className="h-5 w-5 text-blue-500" />
                      {med.name}
                    </CardTitle>
                    <CardDescription>{med.dosage} - {med.frequency}</CardDescription>
                  </div>
                  <Badge variant="outline">{med.timeOfDay.join(', ')}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Info className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Instructions:</span>
                    </div>
                    <p className="text-sm">{med.instructions}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Next Refill:</span>
                      <span>{new Date(med.refillDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Pill className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Pills Remaining:</span>
                      <span>{med.pillsRemaining} of {med.totalPills}</span>
                    </div>
                    <Progress value={(med.pillsRemaining / med.totalPills) * 100} className="h-2" />
                  </div>
                </div>
                {med.sideEffects && med.sideEffects.length > 0 && (
                  <div className="pt-2 border-t">
                    <p className="text-sm text-muted-foreground mb-2">Possible side effects:</p>
                    <div className="flex flex-wrap gap-2">
                      {med.sideEffects.map(effect => (
                        <Badge key={effect} variant="secondary">{effect}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                <div className="text-xs text-muted-foreground">
                  Prescribed by {med.prescribedBy} on {new Date(med.startDate).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="refills" className="space-y-4">
          {needsRefill.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
                <h3 className="text-lg font-semibold">All Stocked Up!</h3>
                <p className="text-muted-foreground">No medications need refilling at this time.</p>
              </CardContent>
            </Card>
          ) : (
            needsRefill.map(med => {
              const refillDate = new Date(med.refillDate);
              const today = new Date();
              const daysUntilRefill = Math.ceil((refillDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

              return (
                <Card key={med.id} className="border-orange-200 dark:border-orange-900">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-orange-500" />
                          {med.name}
                        </CardTitle>
                        <CardDescription>{med.dosage}</CardDescription>
                      </div>
                      <Badge variant="destructive">
                        {daysUntilRefill <= 0 ? 'Refill Now' : `${daysUntilRefill} days left`}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm">
                          <span className="text-muted-foreground">Pills remaining: </span>
                          {med.pillsRemaining}
                        </p>
                        <p className="text-sm">
                          <span className="text-muted-foreground">Refill by: </span>
                          {refillDate.toLocaleDateString()}
                        </p>
                      </div>
                      <Button>
                        Request Refill
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>
      </Tabs>

      {/* Medication Reminders */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Reminder Settings
          </CardTitle>
          <CardDescription>Configure how and when you receive medication reminders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
            <div>
              <p className="font-medium">Push Notifications</p>
              <p className="text-sm text-muted-foreground">Get reminded 15 minutes before each dose</p>
            </div>
            <Badge variant="default">Enabled</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
