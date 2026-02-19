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
import {
  Bell,
  AlertTriangle,
  CheckCircle2,
  Clock,
  User,
  Activity,
  X,
} from 'lucide-react';

interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  patient?: string;
  patientId?: string;
  time: string;
  read: boolean;
}

export default function NurseAlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      type: 'critical',
      title: 'Missed Medication',
      message: 'Patient has missed 3 consecutive medication doses. Immediate follow-up required.',
      patient: 'Mohan Singh',
      patientId: 'PT-1003',
      time: '10 min ago',
      read: false,
    },
    {
      id: '2',
      type: 'critical',
      title: 'High Risk Alert',
      message: 'Risk score increased to 92%. Patient showing signs of dropout behavior.',
      patient: 'Mohan Singh',
      patientId: 'PT-1003',
      time: '25 min ago',
      read: false,
    },
    {
      id: '3',
      type: 'warning',
      title: 'Appointment Missed',
      message: 'Patient did not show up for scheduled appointment today.',
      patient: 'Lakshmi Rao',
      patientId: 'PT-1006',
      time: '1 hour ago',
      read: false,
    },
    {
      id: '4',
      type: 'warning',
      title: 'Low Adherence',
      message: 'Adherence rate dropped below 60%. Consider intervention.',
      patient: 'Ramesh Kumar',
      patientId: 'PT-1001',
      time: '2 hours ago',
      read: true,
    },
    {
      id: '5',
      type: 'info',
      title: 'Follow-up Due',
      message: 'Scheduled follow-up call is due in 30 minutes.',
      patient: 'Sunita Devi',
      patientId: 'PT-1002',
      time: '3 hours ago',
      read: true,
    },
  ]);

  const markAsRead = (id: string) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, read: true } : a));
  };

  const dismissAlert = (id: string) => {
    setAlerts(alerts.filter(a => a.id !== id));
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'warning': return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'info': return <Bell className="h-5 w-5 text-blue-500" />;
    }
  };

  const getAlertStyle = (type: string, read: boolean) => {
    if (read) return 'bg-muted/50 border-muted';
    switch (type) {
      case 'critical': return 'bg-red-50 border-red-200 dark:bg-red-950/30';
      case 'warning': return 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950/30';
      case 'info': return 'bg-blue-50 border-blue-200 dark:bg-blue-950/30';
    }
  };

  const unreadCount = alerts.filter(a => !a.read).length;
  const criticalCount = alerts.filter(a => a.type === 'critical' && !a.read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Bell className="h-8 w-8 text-teal-600" />
            Alerts
          </h1>
          <p className="text-muted-foreground">
            Patient alerts and notifications
          </p>
        </div>
        <Button variant="outline" onClick={() => setAlerts(alerts.map(a => ({ ...a, read: true })))}>
          Mark All as Read
        </Button>
      </div>

      {/* Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className={criticalCount > 0 ? 'border-red-300' : ''}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalCount}</div>
            <p className="text-xs text-muted-foreground">Require immediate action</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Unread</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{unreadCount}</div>
            <p className="text-xs text-muted-foreground">Pending review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alerts.length}</div>
            <p className="text-xs text-muted-foreground">All alerts</p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts List */}
      <Card>
        <CardHeader>
          <CardTitle>All Alerts</CardTitle>
          <CardDescription>Click to view patient details or take action</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border ${getAlertStyle(alert.type, alert.read)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex gap-3">
                    {getAlertIcon(alert.type)}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{alert.title}</h4>
                        {!alert.read && (
                          <Badge variant="secondary" className="text-xs">New</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{alert.message}</p>
                      {alert.patient && (
                        <div className="flex items-center gap-2 text-sm">
                          <User className="h-3 w-3" />
                          <span>{alert.patient}</span>
                          <span className="text-muted-foreground">({alert.patientId})</span>
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground">{alert.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!alert.read && (
                      <Button size="sm" variant="ghost" onClick={() => markAsRead(alert.id)}>
                        <CheckCircle2 className="h-4 w-4" />
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" onClick={() => dismissAlert(alert.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {alert.type === 'critical' && !alert.read && (
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" variant="destructive">
                      Take Action
                    </Button>
                    <Button size="sm" variant="outline">
                      View Patient
                    </Button>
                  </div>
                )}
              </div>
            ))}
            {alerts.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                No alerts at the moment
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
