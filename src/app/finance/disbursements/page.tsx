'use client';

import { useState } from 'react';
import {
  Search,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  CreditCard,
  Building,
  Smartphone,
  Banknote,
  Download,
  Send,
  RefreshCw,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { Label } from '@/components/ui/label';
import {
  mockDisbursements,
  mockApplications,
  getDisbursementStatusColor,
  getCategoryColor,
  formatCurrency,
  Disbursement,
} from '@/lib/finance-data';
import { useToast } from '@/hooks/use-toast';

export default function FinanceDisbursementsPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [showProcessDialog, setShowProcessDialog] = useState(false);
  const [selectedDisbursement, setSelectedDisbursement] = useState<Disbursement | null>(null);

  // Extend disbursements data for demo
  const extendedDisbursements: Disbursement[] = [
    ...mockDisbursements,
    {
      id: 'D-004',
      applicationId: 'FA-012',
      patientId: 'PT-1012',
      patientName: 'Kavita Mehta',
      amount: 18000,
      category: 'medication',
      disbursementDate: '2026-02-18',
      method: 'cheque',
      status: 'processed',
      reference: 'CHQ456789',
    },
    {
      id: 'D-005',
      applicationId: 'FA-015',
      patientId: 'PT-1015',
      patientName: 'Suresh Reddy',
      amount: 8000,
      category: 'transport',
      disbursementDate: '2026-02-18',
      method: 'cash',
      status: 'pending',
      reference: 'CASH-001',
    },
  ];

  const filteredDisbursements = extendedDisbursements.filter((d) => {
    const matchesSearch =
      d.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.reference.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || d.status === statusFilter;
    const matchesMethod = methodFilter === 'all' || d.method === methodFilter;
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const pendingDisbursements = extendedDisbursements.filter((d) => d.status === 'pending');
  const completedDisbursements = extendedDisbursements.filter((d) => d.status === 'completed');
  const totalPending = pendingDisbursements.reduce((sum, d) => sum + d.amount, 0);
  const totalDisbursed = completedDisbursements.reduce((sum, d) => sum + d.amount, 0);

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'bank-transfer':
        return <Building className="h-4 w-4" />;
      case 'upi':
        return <Smartphone className="h-4 w-4" />;
      case 'cheque':
        return <CreditCard className="h-4 w-4" />;
      case 'cash':
        return <Banknote className="h-4 w-4" />;
      default:
        return <DollarSign className="h-4 w-4" />;
    }
  };

  const handleProcess = (disbursement: Disbursement) => {
    setSelectedDisbursement(disbursement);
    setShowProcessDialog(true);
  };

  // Get approved applications ready for disbursement
  const readyForDisbursement = mockApplications.filter((a) => a.status === 'approved');

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Disbursements</h1>
          <p className="text-muted-foreground">Track and process financial aid payments</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => toast({ title: 'New Disbursement', description: 'Opening new disbursement form...' })}>
          <Send className="h-4 w-4 mr-2" />
          New Disbursement
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{pendingDisbursements.length}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{completedDisbursements.length}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-xl font-bold">{formatCurrency(totalPending)}</p>
                <p className="text-sm text-muted-foreground">Pending Amount</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-emerald-500" />
              <div>
                <p className="text-xl font-bold">{formatCurrency(totalDisbursed)}</p>
                <p className="text-sm text-muted-foreground">Total Disbursed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ready for Disbursement */}
      {readyForDisbursement.length > 0 && (
        <Card className="border-emerald-200 bg-emerald-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-emerald-700 flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Ready for Disbursement ({readyForDisbursement.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {readyForDisbursement.map((app) => (
                <div
                  key={app.id}
                  className="flex items-center justify-between p-3 bg-white rounded-lg border"
                >
                  <div>
                    <p className="font-medium">{app.patientName}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(app.approvedAmount || app.requestedAmount)}
                    </p>
                  </div>
                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => toast({ title: 'Processing', description: `Initiating disbursement for ${app.patientName}...` })}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by patient name, ID or reference..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processed">Processed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={methodFilter} onValueChange={setMethodFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Filter by method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                <SelectItem value="upi">UPI</SelectItem>
                <SelectItem value="cheque">Cheque</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => toast({ title: 'Exporting Data', description: 'Preparing disbursements export...' })}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Disbursements Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Disbursements</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDisbursements.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No disbursements found</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredDisbursements.map((disbursement) => (
                  <TableRow key={disbursement.id}>
                    <TableCell className="font-medium">{disbursement.id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{disbursement.patientName}</p>
                        <p className="text-xs text-muted-foreground">
                          {disbursement.patientId}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold text-emerald-600">
                      {formatCurrency(disbursement.amount)}
                    </TableCell>
                    <TableCell>
                      <Badge className={getCategoryColor(disbursement.category)}>
                        {disbursement.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getMethodIcon(disbursement.method)}
                        <span className="capitalize">
                          {disbursement.method.replace('-', ' ')}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {disbursement.reference}
                      </code>
                    </TableCell>
                    <TableCell>
                      {new Date(disbursement.disbursementDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge className={getDisbursementStatusColor(disbursement.status)}>
                        {disbursement.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {disbursement.status === 'pending' && (
                          <Button
                            size="sm"
                            className="bg-emerald-600 hover:bg-emerald-700"
                            onClick={() => handleProcess(disbursement)}
                          >
                            Process
                          </Button>
                        )}
                        {disbursement.status === 'failed' && (
                          <Button size="sm" variant="outline" onClick={() => toast({ title: 'Retrying', description: `Retrying disbursement ${disbursement.id}...` })}>
                            <RefreshCw className="h-4 w-4 mr-1" />
                            Retry
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Process Dialog */}
      <Dialog open={showProcessDialog} onOpenChange={setShowProcessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Process Disbursement</DialogTitle>
            <DialogDescription>
              Confirm the payment details before processing.
            </DialogDescription>
          </DialogHeader>

          {selectedDisbursement && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Disbursement ID</span>
                  <span className="font-medium">{selectedDisbursement.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Patient</span>
                  <span className="font-medium">{selectedDisbursement.patientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Amount</span>
                  <span className="font-bold text-emerald-600">
                    {formatCurrency(selectedDisbursement.amount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Method</span>
                  <div className="flex items-center gap-2">
                    {getMethodIcon(selectedDisbursement.method)}
                    <span className="capitalize">
                      {selectedDisbursement.method.replace('-', ' ')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Transaction Reference</Label>
                <Input defaultValue={selectedDisbursement.reference} />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowProcessDialog(false)}>
              Cancel
            </Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={() => {
                setShowProcessDialog(false);
                toast({
                  title: 'Disbursement Processed',
                  description: `${formatCurrency(selectedDisbursement?.amount || 0)} has been disbursed to ${selectedDisbursement?.patientName}.`,
                });
              }}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Confirm & Process
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
