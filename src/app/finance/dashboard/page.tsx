'use client';

import { useState } from 'react';
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  DollarSign,
  PiggyBank,
  TrendingUp,
  AlertTriangle,
  Eye,
  ArrowRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  mockFinanceStats,
  mockApplications,
  mockDisbursements,
  mockBudgetCategories,
  getStatusColor,
  getPriorityColor,
  getCategoryColor,
  formatCurrency,
  FinancialApplication,
} from '@/lib/finance-data';
import { useToast } from '@/hooks/use-toast';

export default function FinanceDashboardPage() {
  const { toast } = useToast();
  const stats = mockFinanceStats;
  const pendingApplications = mockApplications.filter(
    (a) => a.status === 'pending' || a.status === 'under-review'
  );
  const recentDisbursements = mockDisbursements.slice(0, 5);
  
  const [showAppDialog, setShowAppDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [selectedApp, setSelectedApp] = useState<FinancialApplication | null>(null);
  const [newApp, setNewApp] = useState({
    patientName: '',
    patientId: '',
    category: '',
    amount: '',
    notes: '',
  });
  
  const handleViewApp = (app: FinancialApplication) => {
    setSelectedApp(app);
    setShowDetailDialog(true);
  };
  
  const handleNewApplication = () => {
    setShowAppDialog(false);
    setNewApp({ patientName: '', patientId: '', category: '', amount: '', notes: '' });
    toast({
      title: 'Application Created',
      description: `New application for ${newApp.patientName} has been submitted for review.`,
    });
  };
  
  const handleProcessDisbursement = () => {
    toast({
      title: 'Redirecting...',
      description: 'Opening disbursements page.',
    });
  };
  
  const handleGenerateReport = () => {
    toast({
      title: 'Report Generated',
      description: 'Monthly financial report is being prepared for download.',
    });
  };
  
  const handleViewUrgent = () => {
    toast({
      title: 'Urgent Cases',
      description: `${pendingApplications.filter(a => a.priority === 'high' || a.priority === 'urgent').length} urgent cases require immediate attention.`,
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Finance Dashboard</h1>
        <p className="text-muted-foreground">
          Financial aid overview and pending applications
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Applications
            </CardTitle>
            <FileText className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalApplications}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Review
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingReview}</div>
            <p className="text-xs text-muted-foreground">Awaiting decision</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Approved This Month
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approvedThisMonth}</div>
            <p className="text-xs text-muted-foreground">February 2026</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Rejected This Month
            </CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.rejectedThisMonth}</div>
            <p className="text-xs text-muted-foreground">February 2026</p>
          </CardContent>
        </Card>
      </div>

      {/* Financial Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-emerald-50 border-emerald-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-emerald-700">
              Total Disbursed
            </CardTitle>
            <DollarSign className="h-5 w-5 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-700">
              {formatCurrency(stats.totalDisbursed)}
            </div>
            <p className="text-xs text-emerald-600">This fiscal year</p>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">
              Budget Remaining
            </CardTitle>
            <PiggyBank className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">
              {formatCurrency(stats.budgetRemaining)}
            </div>
            <p className="text-xs text-blue-600">Of ₹25,00,000 allocated</p>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">
              Avg. Processing Time
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">
              {stats.avgProcessingDays} days
            </div>
            <p className="text-xs text-purple-600">From submission to decision</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pending Applications */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Pending Applications</CardTitle>
              <p className="text-sm text-muted-foreground">
                {pendingApplications.length} applications need review
              </p>
            </div>
            <Button variant="outline" size="sm">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingApplications.slice(0, 4).map((app) => (
                <div
                  key={app.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{app.patientName}</p>
                      <Badge className={getPriorityColor(app.priority)}>
                        {app.priority}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className={getCategoryColor(app.category)}>
                        {app.category}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {formatCurrency(app.requestedAmount)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Applied: {new Date(app.applicationDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(app.status)}>
                      {app.status.replace('-', ' ')}
                    </Badge>
                    <Button variant="ghost" size="sm" onClick={() => handleViewApp(app)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Budget Utilization */}
        <Card>
          <CardHeader>
            <CardTitle>Budget Utilization</CardTitle>
            <p className="text-sm text-muted-foreground">
              Category-wise spending breakdown
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockBudgetCategories.map((budget) => {
                const utilizedPercent = (budget.utilized / budget.allocated) * 100;
                const pendingPercent = (budget.pending / budget.allocated) * 100;
                return (
                  <div key={budget.category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{budget.category}</span>
                      <span className="text-sm text-muted-foreground">
                        {formatCurrency(budget.utilized)} / {formatCurrency(budget.allocated)}
                      </span>
                    </div>
                    <div className="relative">
                      <Progress value={utilizedPercent} className="h-2" />
                      {pendingPercent > 0 && (
                        <div
                          className="absolute top-0 h-2 bg-yellow-300 rounded-r"
                          style={{
                            left: `${utilizedPercent}%`,
                            width: `${Math.min(pendingPercent, 100 - utilizedPercent)}%`,
                          }}
                        />
                      )}
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{utilizedPercent.toFixed(0)}% utilized</span>
                      {budget.pending > 0 && (
                        <span className="text-yellow-600">
                          {formatCurrency(budget.pending)} pending
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Disbursements */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Disbursements</CardTitle>
            <p className="text-sm text-muted-foreground">
              Latest payment transactions
            </p>
          </div>
          <Button variant="outline" size="sm">
            View All <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentDisbursements.map((disbursement) => (
              <div
                key={disbursement.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                    <DollarSign className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-medium">{disbursement.patientName}</p>
                    <p className="text-sm text-muted-foreground">
                      {disbursement.method.replace('-', ' ')} • {disbursement.reference}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-emerald-600">
                    {formatCurrency(disbursement.amount)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(disbursement.disbursementDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Button onClick={() => setShowAppDialog(true)} className="h-auto py-4 flex-col bg-emerald-600 hover:bg-emerald-700">
              <FileText className="h-5 w-5 mb-2" />
              <span>New Application</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col" onClick={handleProcessDisbursement}>
              <DollarSign className="h-5 w-5 mb-2" />
              <span>Process Disbursement</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col" onClick={handleGenerateReport}>
              <TrendingUp className="h-5 w-5 mb-2" />
              <span>Generate Report</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col" onClick={handleViewUrgent}>
              <AlertTriangle className="h-5 w-5 mb-2" />
              <span>View Urgent Cases</span>
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* New Application Dialog */}
      <Dialog open={showAppDialog} onOpenChange={setShowAppDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>New Financial Aid Application</DialogTitle>
            <DialogDescription>Create a new application for patient financial assistance</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Patient Name</Label>
                <Input value={newApp.patientName} onChange={(e) => setNewApp({...newApp, patientName: e.target.value})} placeholder="Enter name" />
              </div>
              <div className="space-y-2">
                <Label>Patient ID</Label>
                <Input value={newApp.patientId} onChange={(e) => setNewApp({...newApp, patientId: e.target.value})} placeholder="PT-XXXX" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={newApp.category} onValueChange={(v) => setNewApp({...newApp, category: v})}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="medication">Medication</SelectItem>
                    <SelectItem value="treatment">Treatment</SelectItem>
                    <SelectItem value="transport">Transport</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Requested Amount (₹)</Label>
                <Input type="number" value={newApp.amount} onChange={(e) => setNewApp({...newApp, amount: e.target.value})} placeholder="Enter amount" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea value={newApp.notes} onChange={(e) => setNewApp({...newApp, notes: e.target.value})} placeholder="Additional details..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAppDialog(false)}>Cancel</Button>
            <Button onClick={handleNewApplication} className="bg-emerald-600 hover:bg-emerald-700">Submit Application</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Application Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>{selectedApp?.id}</DialogDescription>
          </DialogHeader>
          {selectedApp && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Patient Name</p>
                  <p className="font-medium">{selectedApp.patientName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Patient ID</p>
                  <p className="font-medium">{selectedApp.patientId}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <Badge className={getCategoryColor(selectedApp.category)}>{selectedApp.category}</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Priority</p>
                  <Badge className={getPriorityColor(selectedApp.priority)}>{selectedApp.priority}</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Requested Amount</p>
                  <p className="font-medium">{formatCurrency(selectedApp.requestedAmount)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge className={getStatusColor(selectedApp.status)}>{selectedApp.status}</Badge>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Notes</p>
                <p className="text-sm">{selectedApp.notes}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
