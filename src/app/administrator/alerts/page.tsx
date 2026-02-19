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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Bell,
  AlertTriangle,
  Building2,
  Brain,
  IndianRupee,
  Clock,
  CheckCircle2,
  XCircle,
  Filter,
  Eye,
  Trash2,
} from 'lucide-react';
import {
  mockSystemAlerts,
  getAlertPriorityColor,
  getAlertPriorityBadge,
  SystemAlert,
} from '@/lib/admin-data';
import { useToast } from '@/hooks/use-toast';

export default function AlertsPage() {
  const { toast } = useToast();
  const [alerts, setAlerts] = useState<SystemAlert[]>(mockSystemAlerts);
  const [filter, setFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  const filteredAlerts = alerts.filter(alert => {
    const matchesReadFilter = filter === 'all' || 
      (filter === 'unread' && !alert.isRead) ||
      (filter === 'read' && alert.isRead) ||
      (filter === 'actionRequired' && alert.actionRequired);
    
    const matchesPriority = priorityFilter === 'all' || alert.priority === priorityFilter;
    
    return matchesReadFilter && matchesPriority;
  });

  const markAsRead = (id: string) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, isRead: true } : a));
    toast({
      title: 'Alert Read',
      description: 'Alert has been marked as read.',
    });
  };

  const markAllAsRead = () => {
    setAlerts(alerts.map(a => ({ ...a, isRead: true })));
    toast({
      title: 'All Alerts Read',
      description: 'All alerts have been marked as read.',
    });
  };

  const deleteAlert = (id: string) => {
    setAlerts(alerts.filter(a => a.id !== id));
    toast({
      title: 'Alert Deleted',
      description: 'Alert has been removed.',
    });
  };

  const getAlertIcon = (type: SystemAlert['type']) => {
    switch (type) {
      case 'dropout_spike': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'threshold_breach': return <Building2 className="h-5 w-5 text-orange-500" />;
      case 'budget_exceeded': return <IndianRupee className="h-5 w-5 text-yellow-500" />;
      case 'ai_error': return <Brain className="h-5 w-5 text-purple-500" />;
      case 'staff_delay': return <Clock className="h-5 w-5 text-blue-500" />;
      case 'system': return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHrs / 24);

    if (diffHrs < 1) return 'Just now';
    if (diffHrs < 24) return `${diffHrs} hours ago`;
    if (diffDays === 1) return 'Yesterday';
    return date.toLocaleDateString();
  };

  const unreadCount = alerts.filter(a => !a.isRead).length;
  const criticalCount = alerts.filter(a => a.priority === 'critical' && !a.isRead).length;
  const actionRequiredCount = alerts.filter(a => a.actionRequired && !a.isRead).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Bell className="h-8 w-8 text-purple-600" />
            Global Alert Center
          </h1>
          <p className="text-muted-foreground">
            System-wide notifications and alerts requiring attention
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={markAllAsRead} disabled={unreadCount === 0}>
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Mark All Read
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alerts.length}</div>
            <p className="text-xs text-muted-foreground">{unreadCount} unread</p>
          </CardContent>
        </Card>
        <Card className={criticalCount > 0 ? 'border-red-200 dark:border-red-800' : ''}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${criticalCount > 0 ? 'text-red-600' : ''}`}>
              {criticalCount}
            </div>
            <p className="text-xs text-muted-foreground">Require immediate action</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Action Required</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{actionRequiredCount}</div>
            <p className="text-xs text-muted-foreground">Pending response</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved Today</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {alerts.filter(a => a.isRead).length}
            </div>
            <p className="text-xs text-muted-foreground">Marked as read</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filters:</span>
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Alerts</SelectItem>
                <SelectItem value="unread">Unread Only</SelectItem>
                <SelectItem value="read">Read</SelectItem>
                <SelectItem value="actionRequired">Action Required</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[180px]">
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
          </div>
        </CardContent>
      </Card>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <CheckCircle2 className="h-12 w-12 mx-auto text-green-500 mb-4" />
              <p className="text-lg font-medium">All Clear!</p>
              <p className="text-muted-foreground">No alerts matching your filters</p>
            </CardContent>
          </Card>
        ) : (
          filteredAlerts.map((alert) => (
            <Card 
              key={alert.id}
              className={`transition-colors ${!alert.isRead ? 'border-l-4 border-l-purple-500 bg-muted/30' : ''} ${alert.priority === 'critical' ? 'border-red-200 dark:border-red-800' : ''}`}
            >
              <CardContent className="py-4">
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-full ${getAlertPriorityColor(alert.priority)}/20`}>
                    {getAlertIcon(alert.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={`font-medium ${!alert.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {alert.title}
                      </h4>
                      <Badge variant={getAlertPriorityBadge(alert.priority) as any} className="capitalize">
                        {alert.priority}
                      </Badge>
                      {alert.actionRequired && (
                        <Badge variant="outline" className="text-orange-600 border-orange-300">
                          Action Required
                        </Badge>
                      )}
                      {!alert.isRead && (
                        <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                          New
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{alert.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{formatTime(alert.timestamp)}</span>
                      {alert.department && (
                        <span className="flex items-center gap-1">
                          <Building2 className="h-3 w-3" />
                          {alert.department}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {!alert.isRead && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => markAsRead(alert.id)}
                        title="Mark as read"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteAlert(alert.id)}
                      title="Delete"
                      className="text-muted-foreground hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Alert Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Alert Configuration</CardTitle>
          <CardDescription>Configure when alerts are triggered</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="p-4 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Dropout Spike</span>
                <Badge>Active</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Alert when department dropout rate increases by more than 5% in 7 days
              </p>
            </div>
            <div className="p-4 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Risk Threshold</span>
                <Badge>Active</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Alert when department average risk score exceeds 60
              </p>
            </div>
            <div className="p-4 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Budget Alert</span>
                <Badge>Active</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Alert when financial aid budget exceeds 80% utilization
              </p>
            </div>
            <div className="p-4 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">AI Accuracy Drop</span>
                <Badge>Active</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Alert when prediction accuracy drops below 80%
              </p>
            </div>
            <div className="p-4 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Staff Response</span>
                <Badge>Active</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Alert when average response time exceeds 4 hours
              </p>
            </div>
            <div className="p-4 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">System Health</span>
                <Badge variant="secondary">Paused</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Alert on system performance degradation
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
