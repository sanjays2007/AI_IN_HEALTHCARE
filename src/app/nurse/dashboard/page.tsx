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
  Users,
  ClipboardList,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Activity,
  Phone,
  Clock,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';
import {
  mockNurseStats,
  mockPatientAssignments,
  mockFollowUps,
  mockTodayAppointments,
  getStatusColor,
  getPriorityColor,
  getRiskColor,
} from '@/lib/nurse-data';

export default function NurseDashboard() {
  const stats = mockNurseStats;
  const criticalPatients = mockPatientAssignments.filter(p => p.status === 'critical');
  const pendingFollowUps = mockFollowUps.filter(f => f.status === 'pending').slice(0, 4);
  const upcomingAppointments = mockTodayAppointments.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Good Morning, Nurse Smith!</h1>
        <p className="text-muted-foreground">
          Here's your patient care overview for today
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assigned Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.assignedPatients}</div>
            <p className="text-xs text-muted-foreground">Under your care</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Follow-ups</CardTitle>
            <ClipboardList className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingFollowUps}</div>
            <p className="text-xs text-muted-foreground">Awaiting action</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completedToday}</div>
            <p className="text-xs text-muted-foreground">Tasks done</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.criticalAlerts}</div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Risk</CardTitle>
            <Activity className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.highRiskPatients}</div>
            <p className="text-xs text-muted-foreground">Risk score &gt;70%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.appointmentsToday}</div>
            <p className="text-xs text-muted-foreground">Scheduled today</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Critical Patients */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  Critical Patients
                </CardTitle>
                <CardDescription>Patients requiring immediate attention</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/nurse/patients?status=critical">
                  View All <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {criticalPatients.length > 0 ? (
              <div className="space-y-4">
                {criticalPatients.map((patient) => (
                  <div key={patient.id} className="flex items-center justify-between p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{patient.patientName}</p>
                        <Badge className={getStatusColor(patient.status)}>{patient.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{patient.condition}</p>
                      <p className="text-xs text-muted-foreground">
                        Last visit: {new Date(patient.lastVisit).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-xl font-bold ${getRiskColor(patient.riskScore)}`}>
                        {patient.riskScore}%
                      </p>
                      <p className="text-xs text-muted-foreground">Risk Score</p>
                      <Button size="sm" variant="destructive" className="mt-2">
                        <Phone className="h-3 w-3 mr-1" /> Call
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No critical patients at the moment
              </p>
            )}
          </CardContent>
        </Card>

        {/* Pending Follow-ups */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5 text-teal-600" />
                  Pending Follow-ups
                </CardTitle>
                <CardDescription>Scheduled patient check-ins</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/nurse/follow-ups">
                  View All <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingFollowUps.map((followUp) => (
                <div key={followUp.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{followUp.patientName}</p>
                      <Badge className={getPriorityColor(followUp.priority)}>{followUp.priority}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{followUp.reason}</p>
                  </div>
                  <div className="text-right text-sm">
                    <p className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {followUp.scheduledTime}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {followUp.type === 'phone' ? '📞' : followUp.type === 'visit' ? '🏥' : '💬'}
                      {' '}{followUp.type}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Today's Schedule */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  Today's Appointments
                </CardTitle>
                <CardDescription>Patient visits scheduled for today</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/nurse/schedule">
                  Full Schedule <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingAppointments.map((apt) => (
                <div key={apt.id} className="flex items-center gap-4 p-3 rounded-lg border">
                  <div className="text-center min-w-[60px]">
                    <p className="text-lg font-bold">{apt.time}</p>
                    <p className="text-xs text-muted-foreground">{apt.duration} min</p>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{apt.patientName}</p>
                    <p className="text-sm text-muted-foreground">{apt.doctor} • {apt.room}</p>
                  </div>
                  <Badge variant="outline" className="capitalize">{apt.type}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions & Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-teal-600" />
              Performance Today
            </CardTitle>
            <CardDescription>Your task completion stats</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Follow-up Calls</span>
                <span className="font-medium">8/12 completed</span>
              </div>
              <Progress value={67} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Vitals Recorded</span>
                <span className="font-medium">15/18 completed</span>
              </div>
              <Progress value={83} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Medication Reminders</span>
                <span className="font-medium">22/25 sent</span>
              </div>
              <Progress value={88} className="h-2" />
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-medium mb-3">Quick Actions</h4>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="justify-start">
                  <Phone className="h-4 w-4 mr-2" />
                  Make Call
                </Button>
                <Button variant="outline" className="justify-start">
                  <Activity className="h-4 w-4 mr-2" />
                  Record Vitals
                </Button>
                <Button variant="outline" className="justify-start">
                  <ClipboardList className="h-4 w-4 mr-2" />
                  Log Follow-up
                </Button>
                <Button variant="outline" className="justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Visit
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
