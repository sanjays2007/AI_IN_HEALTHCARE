'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bell, 
  CheckCircle2, 
  AlertCircle, 
  Heart,
  Info,
  Trash2,
  Check,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { mockSmartAlerts, SmartAlert } from '@/lib/patient-data';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<SmartAlert[]>(mockSmartAlerts);

  const markAsRead = (id: string) => {
    setAlerts(prev => prev.map(alert =>
      alert.id === id ? { ...alert, isRead: true } : alert
    ));
  };

  const markAllAsRead = () => {
    setAlerts(prev => prev.map(alert => ({ ...alert, isRead: true })));
  };

  const deleteAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const unreadAlerts = alerts.filter(a => !a.isRead);
  const readAlerts = alerts.filter(a => a.isRead);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'Success': return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'Warning': return <AlertCircle className="h-5 w-5 text-orange-600" />;
      case 'Reminder': return <Bell className="h-5 w-5 text-blue-600" />;
      case 'Support': return <Heart className="h-5 w-5 text-pink-600" />;
      case 'Info': return <Info className="h-5 w-5 text-gray-600" />;
      default: return <Bell className="h-5 w-5" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'Success': return 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800';
      case 'Warning': return 'bg-orange-50 border-orange-200 dark:bg-orange-950 dark:border-orange-800';
      case 'Reminder': return 'bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800';
      case 'Support': return 'bg-pink-50 border-pink-200 dark:bg-pink-950 dark:border-pink-800';
      case 'Info': return 'bg-gray-50 border-gray-200 dark:bg-gray-900 dark:border-gray-700';
      default: return '';
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'Success': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'Warning': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100';
      case 'Reminder': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'Support': return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-100';
      case 'Info': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
      default: return '';
    }
  };

  const AlertCard = ({ alert }: { alert: SmartAlert }) => (
    <div className={`rounded-lg border p-4 ${getAlertColor(alert.type)} ${!alert.isRead ? 'ring-2 ring-primary ring-offset-2' : ''}`}>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 mt-1">
          {getAlertIcon(alert.type)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge className={getTypeBadgeColor(alert.type)}>{alert.type}</Badge>
                {!alert.isRead && (
                  <Badge variant="default" className="text-xs">New</Badge>
                )}
                {alert.actionRequired && (
                  <Badge variant="destructive" className="text-xs">Action Required</Badge>
                )}
              </div>
              <h3 className="font-semibold">{alert.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
              <p className="text-xs text-muted-foreground mt-2">
                {new Date(alert.date).toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3">
            {alert.actionUrl && (
              <Button size="sm" asChild>
                <Link href={alert.actionUrl}>
                  Take Action
                  <ExternalLink className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            )}
            {!alert.isRead && (
              <Button size="sm" variant="outline" onClick={() => markAsRead(alert.id)}>
                <Check className="mr-1 h-3 w-3" />
                Mark as Read
              </Button>
            )}
            <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteAlert(alert.id)}>
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Alerts & Nudges</h1>
          <p className="text-muted-foreground">Important notifications and supportive messages</p>
        </div>
        {unreadAlerts.length > 0 && (
          <Button variant="outline" onClick={markAllAsRead}>
            <Check className="mr-2 h-4 w-4" />
            Mark All as Read
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alerts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Unread</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{unreadAlerts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Action Required</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {alerts.filter(a => a.actionRequired).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Support Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pink-600">
              {alerts.filter(a => a.type === 'Support' || a.type === 'Success').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="unread" className="space-y-4">
        <TabsList>
          <TabsTrigger value="unread" className="relative">
            Unread
            {unreadAlerts.length > 0 && (
              <span className="ml-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                {unreadAlerts.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="all">All Alerts</TabsTrigger>
          <TabsTrigger value="action">Action Required</TabsTrigger>
        </TabsList>

        <TabsContent value="unread" className="space-y-4">
          {unreadAlerts.length > 0 ? (
            <div className="space-y-3">
              {unreadAlerts.map(alert => (
                <AlertCard key={alert.id} alert={alert} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
                <p className="text-lg font-medium">All caught up!</p>
                <p className="text-sm text-muted-foreground">You have no unread alerts</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          {alerts.length > 0 ? (
            <div className="space-y-3">
              {alerts.map(alert => (
                <AlertCard key={alert.id} alert={alert} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">No alerts</p>
                <p className="text-sm text-muted-foreground">You don&apos;t have any alerts yet</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="action" className="space-y-4">
          {alerts.filter(a => a.actionRequired).length > 0 ? (
            <div className="space-y-3">
              {alerts.filter(a => a.actionRequired).map(alert => (
                <AlertCard key={alert.id} alert={alert} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
                <p className="text-lg font-medium">No actions required</p>
                <p className="text-sm text-muted-foreground">You&apos;re all set!</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Info Card */}
      <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-1">About Smart Nudges</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Our smart notification system sends you personalized messages to keep you engaged and supported throughout your treatment. 
                These aren&apos;t just reminders - they&apos;re designed to provide encouragement, recognize your progress, and offer help when you might need it.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
