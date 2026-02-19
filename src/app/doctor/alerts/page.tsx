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
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Bell,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Pill,
  Heart,
  DollarSign,
  CheckCircle2,
  Circle,
  ChevronRight,
  Filter,
  Check,
  ClipboardList,
} from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import {
  mockDoctorAlerts,
  DoctorAlert,
  formatDateTime,
  getAlertPriorityColor,
} from '@/lib/doctor-data';

export default function DoctorAlertsPage() {
  const [alerts, setAlerts] = useState(mockDoctorAlerts);
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('unread');
  const [showActionDialog, setShowActionDialog] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<DoctorAlert | null>(null);
  const [actionType, setActionType] = useState('');
  const [actionNotes, setActionNotes] = useState('');
  const { toast } = useToast();

  const getAlertIcon = (type: DoctorAlert['type']) => {
    switch (type) {
      case 'risk_increase': return <TrendingUp className="h-5 w-5 text-red-500" />;
      case 'missed_appointments': return <Calendar className="h-5 w-5 text-orange-500" />;
      case 'severe_side_effect': return <Pill className="h-5 w-5 text-red-500" />;
      case 'emotional_distress': return <Heart className="h-5 w-5 text-purple-500" />;
      case 'financial_instability': return <DollarSign className="h-5 w-5 text-orange-500" />;
      case 'treatment_milestone': return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      default: return <AlertTriangle className="h-5 w-5" />;
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    if (priorityFilter !== 'all' && alert.priority !== priorityFilter) return false;
    if (statusFilter === 'unread' && alert.isRead) return false;
    if (statusFilter === 'read' && !alert.isRead) return false;
    if (statusFilter === 'action_required' && !alert.actionRequired) return false;
    return true;
  });

  const markAsRead = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, isRead: true } : a));
  };

  const markAllAsRead = () => {
    setAlerts(prev => prev.map(a => ({ ...a, isRead: true })));
  };

  const handleTakeAction = (alert: DoctorAlert) => {
    setSelectedAlert(alert);
    setActionType('');
    setActionNotes('');
    setShowActionDialog(true);
  };

  const submitAction = () => {
    if (!actionType) {
      toast({ variant: "destructive", title: "Please select an action type" });
      return;
    }

    setAlerts(prev => prev.map(a => 
      a.id === selectedAlert?.id 
        ? { ...a, actionTaken: actionType + (actionNotes ? `: ${actionNotes}` : ''), isRead: true }
        : a
    ));

    toast({
      title: "Action Recorded",
      description: `${actionType} has been recorded for ${selectedAlert?.patientName}`,
    });

    setShowActionDialog(false);
  };

  const unreadCount = alerts.filter(a => !a.isRead).length;
  const actionRequiredCount = alerts.filter(a => a.actionRequired && !a.actionTaken).length;
  const criticalCount = alerts.filter(a => a.priority === 'critical' && !a.isRead).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Bell className="h-8 w-8 text-orange-600" />
            Smart Alerts
          </h1>
          <p className="text-muted-foreground">
            Real-time notifications for patient risk changes
          </p>
        </div>
        <Button variant="outline" onClick={markAllAsRead} disabled={unreadCount === 0}>
          <Check className="h-4 w-4 mr-2" />
          Mark All as Read
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className={statusFilter === 'unread' ? 'ring-2 ring-blue-500' : ''}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread</CardTitle>
            <Circle className="h-4 w-4 text-blue-500 fill-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unreadCount}</div>
            <Button 
              variant="link" 
              className="p-0 h-auto text-xs"
              onClick={() => setStatusFilter('unread')}
            >
              View unread alerts
            </Button>
          </CardContent>
        </Card>

        <Card className="border-red-200 dark:border-red-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalCount}</div>
            <Button 
              variant="link" 
              className="p-0 h-auto text-xs text-red-600"
              onClick={() => setPriorityFilter('critical')}
            >
              View critical alerts
            </Button>
          </CardContent>
        </Card>

        <Card className="border-orange-200 dark:border-orange-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Action Required</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{actionRequiredCount}</div>
            <Button 
              variant="link" 
              className="p-0 h-auto text-xs text-orange-600"
              onClick={() => setStatusFilter('action_required')}
            >
              View pending actions
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alerts.length}</div>
            <Button 
              variant="link" 
              className="p-0 h-auto text-xs"
              onClick={() => { setStatusFilter('all'); setPriorityFilter('all'); }}
            >
              View all alerts
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filters:</span>
            </div>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="unread">Unread Only</SelectItem>
                <SelectItem value="read">Read Only</SelectItem>
                <SelectItem value="action_required">Action Required</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground ml-auto">
              Showing {filteredAlerts.length} of {alerts.length} alerts
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
              <p className="text-lg font-medium">No alerts match your filters</p>
              <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
            </CardContent>
          </Card>
        ) : (
          filteredAlerts.map((alert) => (
            <Card 
              key={alert.id}
              className={`transition-all ${
                !alert.isRead ? 'border-l-4 border-l-blue-500' : ''
              } ${
                alert.priority === 'critical' ? 'bg-red-50/50 dark:bg-red-900/10 border-red-200' :
                alert.priority === 'high' ? 'bg-orange-50/50 dark:bg-orange-900/10 border-orange-200' :
                ''
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-full ${
                    alert.priority === 'critical' ? 'bg-red-100 dark:bg-red-900/30' :
                    alert.priority === 'high' ? 'bg-orange-100 dark:bg-orange-900/30' :
                    alert.priority === 'moderate' ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                    'bg-green-100 dark:bg-green-900/30'
                  }`}>
                    {getAlertIcon(alert.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Link 
                        href={`/doctor/patients/${alert.patientId}`}
                        className="font-semibold text-blue-600 hover:underline"
                      >
                        {alert.patientName}
                      </Link>
                      <Badge variant={alert.priority === 'critical' ? 'destructive' : 'outline'}>
                        {alert.priority}
                      </Badge>
                      {alert.actionRequired && !alert.actionTaken && (
                        <Badge variant="default" className="bg-orange-500">
                          Action Required
                        </Badge>
                      )}
                      {!alert.isRead && (
                        <span className="h-2 w-2 rounded-full bg-blue-500" />
                      )}
                    </div>
                    <h3 className="font-medium">{alert.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{alert.description}</p>
                    {alert.actionTaken && (
                      <p className="text-sm text-green-600 mt-1">
                        <CheckCircle2 className="h-3 w-3 inline mr-1" />
                        Action taken: {alert.actionTaken}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      {formatDateTime(alert.createdAt)}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    {alert.actionRequired && !alert.actionTaken && (
                      <Button 
                        size="sm" 
                        variant="default"
                        onClick={() => handleTakeAction(alert)}
                      >
                        <ClipboardList className="h-4 w-4 mr-1" />
                        Take Action
                      </Button>
                    )}
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/doctor/patients/${alert.patientId}`}>
                        View Patient
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                    {!alert.isRead && (
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => markAsRead(alert.id)}
                      >
                        Mark as Read
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Take Action Dialog */}
      <Dialog open={showActionDialog} onOpenChange={setShowActionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Take Action on Alert</DialogTitle>
            <DialogDescription>
              Record the action taken for this alert
            </DialogDescription>
          </DialogHeader>
          {selectedAlert && (
            <div className="space-y-4 py-4">
              <div className="p-3 rounded-lg border bg-muted/50">
                <p className="font-semibold">{selectedAlert.patientName}</p>
                <p className="text-sm">{selectedAlert.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{selectedAlert.description}</p>
              </div>
              <div className="space-y-2">
                <Label>Action Taken</Label>
                <Select value={actionType} onValueChange={setActionType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select action type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Called patient">Called patient</SelectItem>
                    <SelectItem value="Scheduled appointment">Scheduled appointment</SelectItem>
                    <SelectItem value="Adjusted medication">Adjusted medication</SelectItem>
                    <SelectItem value="Referred to specialist">Referred to specialist</SelectItem>
                    <SelectItem value="Referred to counseling">Referred to counseling</SelectItem>
                    <SelectItem value="Referred to financial aid">Referred to financial aid</SelectItem>
                    <SelectItem value="Sent nurse for follow-up">Sent nurse for follow-up</SelectItem>
                    <SelectItem value="No action needed">No action needed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Notes (Optional)</Label>
                <Textarea
                  placeholder="Add any additional notes..."
                  value={actionNotes}
                  onChange={(e) => setActionNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowActionDialog(false)}>
              Cancel
            </Button>
            <Button onClick={submitAction}>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Record Action
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
