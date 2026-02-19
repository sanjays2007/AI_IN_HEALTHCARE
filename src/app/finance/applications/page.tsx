'use client';

import { useState } from 'react';
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Download,
  MessageSquare,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  mockApplications,
  getStatusColor,
  getPriorityColor,
  getCategoryColor,
  formatCurrency,
  FinancialApplication,
} from '@/lib/finance-data';

export default function FinanceApplicationsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedApplication, setSelectedApplication] = useState<FinancialApplication | null>(null);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [reviewNotes, setReviewNotes] = useState('');
  const [approvedAmount, setApprovedAmount] = useState('');

  const filteredApplications = mockApplications.filter((app) => {
    const matchesSearch =
      app.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || app.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const pendingApps = filteredApplications.filter(
    (a) => a.status === 'pending' || a.status === 'under-review'
  );
  const approvedApps = filteredApplications.filter(
    (a) => a.status === 'approved' || a.status === 'disbursed'
  );
  const rejectedApps = filteredApplications.filter((a) => a.status === 'rejected');

  const handleReview = (application: FinancialApplication) => {
    setSelectedApplication(application);
    setApprovedAmount(application.requestedAmount.toString());
    setReviewNotes('');
    setShowReviewDialog(true);
  };

  const ApplicationCard = ({ application }: { application: FinancialApplication }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold">{application.id}</span>
              <Badge className={getStatusColor(application.status)}>
                {application.status.replace('-', ' ')}
              </Badge>
              <Badge className={getPriorityColor(application.priority)}>
                {application.priority}
              </Badge>
            </div>
            <p className="text-lg font-medium">{application.patientName}</p>
            <p className="text-sm text-muted-foreground mb-2">
              Patient ID: {application.patientId}
            </p>
            <div className="flex items-center gap-3 mb-2">
              <Badge variant="outline" className={getCategoryColor(application.category)}>
                {application.category}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Applied: {new Date(application.applicationDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Requested</p>
                <p className="font-semibold">{formatCurrency(application.requestedAmount)}</p>
              </div>
              {application.approvedAmount && (
                <div>
                  <p className="text-xs text-muted-foreground">Approved</p>
                  <p className="font-semibold text-green-600">
                    {formatCurrency(application.approvedAmount)}
                  </p>
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-2">{application.notes}</p>
            {application.documents.length > 0 && (
              <div className="flex items-center gap-2 mt-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {application.documents.length} document(s)
                </span>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Button variant="outline" size="sm" onClick={() => setSelectedApplication(application)}>
              <Eye className="h-4 w-4 mr-1" /> View
            </Button>
            {(application.status === 'pending' || application.status === 'under-review') && (
              <Button
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={() => handleReview(application)}
              >
                Review
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Financial Aid Applications</h1>
        <p className="text-muted-foreground">Review and process financial assistance requests</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{pendingApps.length}</p>
                <p className="text-sm text-muted-foreground">Pending Review</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{approvedApps.length}</p>
                <p className="text-sm text-muted-foreground">Approved</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <XCircle className="h-8 w-8 text-red-500" />
              <div>
                <p className="text-2xl font-bold">{rejectedApps.length}</p>
                <p className="text-sm text-muted-foreground">Rejected</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{filteredApplications.length}</p>
                <p className="text-sm text-muted-foreground">Total Applications</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by patient name or application ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="under-review">Under Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="disbursed">Disbursed</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="transport">Transport</SelectItem>
                <SelectItem value="medication">Medication</SelectItem>
                <SelectItem value="treatment">Treatment</SelectItem>
                <SelectItem value="emergency">Emergency</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Applications Tabs */}
      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">
            Pending ({pendingApps.length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved ({approvedApps.length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected ({rejectedApps.length})
          </TabsTrigger>
          <TabsTrigger value="all">
            All ({filteredApplications.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingApps.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No pending applications</p>
              </CardContent>
            </Card>
          ) : (
            pendingApps.map((app) => <ApplicationCard key={app.id} application={app} />)
          )}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          {approvedApps.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No approved applications</p>
              </CardContent>
            </Card>
          ) : (
            approvedApps.map((app) => <ApplicationCard key={app.id} application={app} />)
          )}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          {rejectedApps.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <XCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No rejected applications</p>
              </CardContent>
            </Card>
          ) : (
            rejectedApps.map((app) => <ApplicationCard key={app.id} application={app} />)
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          {filteredApplications.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No applications found</p>
              </CardContent>
            </Card>
          ) : (
            filteredApplications.map((app) => <ApplicationCard key={app.id} application={app} />)
          )}
        </TabsContent>
      </Tabs>

      {/* Review Dialog */}
      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Review Application</DialogTitle>
            <DialogDescription>
              Review and make a decision on this financial aid application.
            </DialogDescription>
          </DialogHeader>

          {selectedApplication && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Application ID</span>
                  <span className="font-medium">{selectedApplication.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Patient</span>
                  <span className="font-medium">{selectedApplication.patientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Category</span>
                  <Badge className={getCategoryColor(selectedApplication.category)}>
                    {selectedApplication.category}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Requested Amount</span>
                  <span className="font-semibold">
                    {formatCurrency(selectedApplication.requestedAmount)}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="approved-amount">Approved Amount</Label>
                <Input
                  id="approved-amount"
                  type="number"
                  value={approvedAmount}
                  onChange={(e) => setApprovedAmount(e.target.value)}
                  placeholder="Enter approved amount"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="review-notes">Review Notes</Label>
                <Textarea
                  id="review-notes"
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Add notes about your decision..."
                  rows={3}
                />
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowReviewDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setShowReviewDialog(false);
                // Handle rejection
              }}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject
            </Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={() => {
                setShowReviewDialog(false);
                // Handle approval
              }}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
