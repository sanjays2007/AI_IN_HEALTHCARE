'use client';

import { useState } from 'react';
import {
  Bell,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  User,
  Eye,
  X,
  Check,
  Filter,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatCurrency } from '@/lib/finance-data';
import { useToast } from '@/hooks/use-toast';

interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  category: 'application' | 'budget' | 'disbursement' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionRequired: boolean;
  relatedId?: string;
  amount?: number;
}

export default function FinanceAlertsPage() {
  const { toast } = useToast();
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      type: 'critical',
      category: 'application',
      title: 'Urgent Application Pending',
      message: 'Emergency fund application from Mohan Singh requires immediate review.',
      timestamp: '2026-02-18T10:30:00',
      read: false,
      actionRequired: true,
      relatedId: 'FA-002',
      amount: 25000,
    },
    {
      id: '2',
      type: 'warning',
      category: 'budget',
      title: 'Budget Threshold Alert',
      message: 'Treatment Costs category has reached 72% utilization.',
      timestamp: '2026-02-18T09:15:00',
      read: false,
      actionRequired: false,
    },
    {
      id: '3',
      type: 'info',
      category: 'disbursement',
      title: 'Disbursement Processed',
      message: 'Payment of ₹45,000 to Sunita Devi has been successfully processed.',
      timestamp: '2026-02-17T16:45:00',
      read: false,
      actionRequired: false,
      relatedId: 'D-002',
      amount: 45000,
    },
    {
      id: '4',
      type: 'critical',
      category: 'application',
      title: 'Multiple Pending Reviews',
      message: '5 applications pending for more than 3 days.',
      timestamp: '2026-02-17T14:00:00',
      read: true,
      actionRequired: true,
    },
    {
      id: '5',
      type: 'warning',
      category: 'budget',
      title: 'Medication Support Near Limit',
      message: 'Medication Support budget is at 72.5% with ₹85,000 pending.',
      timestamp: '2026-02-17T11:30:00',
      read: true,
      actionRequired: false,
    },
    {
      id: '6',
      type: 'success',
      category: 'disbursement',
      title: 'Batch Processing Complete',
      message: '8 disbursements completed successfully totaling ₹1,20,000.',
      timestamp: '2026-02-16T17:00:00',
      read: true,
      actionRequired: false,
      amount: 120000,
    },
    {
      id: '7',
      type: 'info',
      category: 'system',
      title: 'Monthly Report Generated',
      message: 'January 2026 financial aid report is ready for review.',
      timestamp: '2026-02-15T09:00:00',
      read: true,
      actionRequired: false,
    },
  ]);

  const [filterType, setFilterType] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filteredAlerts = alerts.filter((alert) => {
    const matchesType = filterType === 'all' || alert.type === filterType;
    const matchesCategory = filterCategory === 'all' || alert.category === filterCategory;
    return matchesType && matchesCategory;
  });

  const unreadCount = alerts.filter((a) => !a.read).length;
  const criticalCount = alerts.filter((a) => a.type === 'critical' && !a.read).length;
  const actionRequiredCount = alerts.filter((a) => a.actionRequired).length;

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
  };

  const getAlertStyles = (type: Alert['type'], read: boolean) => {
    const opacity = read ? 'opacity-70' : '';
    switch (type) {
      case 'critical':
        return `bg-red-50 border-red-200 ${opacity}`;
      case 'warning':
        return `bg-yellow-50 border-yellow-200 ${opacity}`;
      case 'info':
        return `bg-blue-50 border-blue-200 ${opacity}`;
      case 'success':
        return `bg-green-50 border-green-200 ${opacity}`;
    }
  };

  const getCategoryIcon = (category: Alert['category']) => {
    switch (category) {
      case 'application':
        return <FileText className="h-4 w-4" />;
      case 'budget':
        return <DollarSign className="h-4 w-4" />;
      case 'disbursement':
        return <DollarSign className="h-4 w-4" />;
      case 'system':
        return <Bell className="h-4 w-4" />;
    }
  };

  const markAsRead = (id: string) => {
    setAlerts(alerts.map((a) => (a.id === id ? { ...a, read: true } : a)));
    toast({
      title: 'Alert Read',
      description: 'Alert has been marked as read.',
    });
  };

  const dismissAlert = (id: string) => {
    setAlerts(alerts.filter((a) => a.id !== id));
    toast({
      title: 'Alert Dismissed',
      description: 'Alert has been removed from your list.',
    });
  };

  const markAllAsRead = () => {
    setAlerts(alerts.map((a) => ({ ...a, read: true })));
    toast({
      title: 'All Alerts Read',
      description: 'All alerts have been marked as read.',
    });
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Alerts & Notifications</h1>
          <p className="text-muted-foreground">Stay updated on important activities</p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={markAllAsRead}>
            <Check className="h-4 w-4 mr-2" />
            Mark All as Read
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-red-500" />
              <div>
                <p className="text-2xl font-bold">{criticalCount}</p>
                <p className="text-sm text-muted-foreground">Critical Alerts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Bell className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{unreadCount}</p>
                <p className="text-sm text-muted-foreground">Unread</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{actionRequiredCount}</p>
                <p className="text-sm text-muted-foreground">Action Required</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-gray-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-gray-500" />
              <div>
                <p className="text-2xl font-bold">{alerts.length}</p>
                <p className="text-sm text-muted-foreground">Total Alerts</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="success">Success</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="application">Applications</SelectItem>
                <SelectItem value="budget">Budget</SelectItem>
                <SelectItem value="disbursement">Disbursement</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No alerts matching your filters</p>
            </CardContent>
          </Card>
        ) : (
          filteredAlerts.map((alert) => (
            <Card
              key={alert.id}
              className={`border ${getAlertStyles(alert.type, alert.read)}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <div className="mt-1">{getAlertIcon(alert.type)}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{alert.title}</h3>
                        {!alert.read && (
                          <Badge className="bg-emerald-100 text-emerald-700">New</Badge>
                        )}
                        {alert.actionRequired && (
                          <Badge variant="destructive">Action Required</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{alert.message}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          {getCategoryIcon(alert.category)}
                          <span className="capitalize">{alert.category}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTimestamp(alert.timestamp)}
                        </span>
                        {alert.relatedId && (
                          <span className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            {alert.relatedId}
                          </span>
                        )}
                        {alert.amount && (
                          <span className="flex items-center gap-1 font-medium text-emerald-600">
                            <DollarSign className="h-3 w-3" />
                            {formatCurrency(alert.amount)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {alert.actionRequired && (
                      <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => toast({ title: 'Opening Review', description: `Reviewing ${alert.relatedId || 'item'}...` })}>
                        <Eye className="h-4 w-4 mr-1" />
                        Review
                      </Button>
                    )}
                    {!alert.read && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => markAsRead(alert.id)}
                        title="Mark as read"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => dismissAlert(alert.id)}
                      title="Dismiss"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
