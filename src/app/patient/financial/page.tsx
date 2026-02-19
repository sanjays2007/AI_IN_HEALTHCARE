'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  DollarSign, 
  CreditCard, 
  FileText, 
  Upload, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Wallet,
  Calendar,
  TrendingDown,
  HeartPulse,
  Landmark
} from 'lucide-react';
import { mockFinancialInfo } from '@/lib/patient-data';

export default function FinancialPage() {
  const [financialInfo, setFinancialInfo] = useState(mockFinancialInfo);
  const [aidDialogOpen, setAidDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const paymentProgress = (financialInfo.paidAmount / financialInfo.totalCost) * 100;

  const handleApplyAid = () => {
    setFinancialInfo(prev => ({
      ...prev,
      financialAidStatus: 'Pending',
    }));
    setAidDialogOpen(false);
    toast({
      title: "Application Submitted",
      description: "Your financial aid application has been submitted. We'll review it within 3-5 business days.",
    });
  };

  const handleUploadDocument = (docName: string) => {
    setUploading(true);
    setTimeout(() => {
      setFinancialInfo(prev => ({
        ...prev,
        documents: prev.documents.map(doc => 
          doc.name === docName ? { ...doc, status: 'Pending' as const } : doc
        ),
      }));
      setUploading(false);
      toast({
        title: "Document Uploaded",
        description: `${docName} has been uploaded and is pending verification.`,
      });
    }, 1500);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"><CheckCircle2 className="mr-1 h-3 w-3" />Approved</Badge>;
      case 'Pending':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"><Clock className="mr-1 h-3 w-3" />Pending</Badge>;
      case 'Rejected':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"><AlertCircle className="mr-1 h-3 w-3" />Rejected</Badge>;
      case 'Verified':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"><CheckCircle2 className="mr-1 h-3 w-3" />Verified</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Financial Support</h1>
        <p className="text-muted-foreground">Manage your treatment costs and access financial assistance</p>
      </div>

      {/* Financial Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <DollarSign className="h-4 w-4" />
              Total Cost
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${financialInfo.totalCost.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <Wallet className="h-4 w-4" />
              Amount Paid
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${financialInfo.paidAmount.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <TrendingDown className="h-4 w-4" />
              Outstanding
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">${financialInfo.outstandingBalance.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <HeartPulse className="h-4 w-4" />
              Aid Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {getStatusBadge(financialInfo.financialAidStatus)}
          </CardContent>
        </Card>
      </div>

      {/* Payment Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Progress
          </CardTitle>
          <CardDescription>Track your payment journey</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between mb-2 text-sm">
              <span>Paid: ${financialInfo.paidAmount.toLocaleString()}</span>
              <span>Remaining: ${financialInfo.outstandingBalance.toLocaleString()}</span>
            </div>
            <Progress value={paymentProgress} className="h-4" />
            <p className="text-center text-sm mt-2 font-medium">{paymentProgress.toFixed(1)}% Complete</p>
          </div>

          {financialInfo.installmentPlan && (
            <div className="rounded-lg bg-muted p-4">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Installment Plan Active
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Next Payment Due</p>
                  <p className="font-medium">{new Date(financialInfo.nextPaymentDue).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Amount Due</p>
                  <p className="font-medium">${financialInfo.nextPaymentAmount.toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button className="flex-1">
              <CreditCard className="mr-2 h-4 w-4" />
              Make Payment
            </Button>
            <Button variant="outline" className="flex-1">
              View Payment History
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Financial Aid Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HeartPulse className="h-5 w-5" />
            Financial Aid Programs
          </CardTitle>
          <CardDescription>Assistance programs you may qualify for</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {financialInfo.financialAidStatus === 'Approved' ? (
            <div className="rounded-lg bg-green-50 border border-green-200 p-4 dark:bg-green-950 dark:border-green-800">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <h4 className="font-medium text-green-800 dark:text-green-200">Financial Aid Approved!</h4>
              </div>
              <p className="text-sm text-green-700 dark:text-green-300">
                Your financial aid application has been approved. The assistance will be applied to your upcoming payments.
              </p>
            </div>
          ) : financialInfo.financialAidStatus === 'Pending' ? (
            <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-4 dark:bg-yellow-950 dark:border-yellow-800">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-yellow-600" />
                <h4 className="font-medium text-yellow-800 dark:text-yellow-200">Application Under Review</h4>
              </div>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Your financial aid application is being reviewed. We&apos;ll notify you within 3-5 business days.
              </p>
            </div>
          ) : (
            <Dialog open={aidDialogOpen} onOpenChange={setAidDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full md:w-auto">
                  <HeartPulse className="mr-2 h-4 w-4" />
                  Apply for Financial Aid
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Financial Aid Application</DialogTitle>
                  <DialogDescription>
                    Complete this form to apply for financial assistance with your treatment costs.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Annual Household Income</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select income range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="under25k">Under $25,000</SelectItem>
                        <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                        <SelectItem value="50k-75k">$50,000 - $75,000</SelectItem>
                        <SelectItem value="75k-100k">$75,000 - $100,000</SelectItem>
                        <SelectItem value="over100k">Over $100,000</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Number of Dependents</Label>
                    <Input type="number" placeholder="0" min="0" />
                  </div>
                  <div className="space-y-2">
                    <Label>Employment Status</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="employed">Employed Full-Time</SelectItem>
                        <SelectItem value="parttime">Employed Part-Time</SelectItem>
                        <SelectItem value="selfemployed">Self-Employed</SelectItem>
                        <SelectItem value="unemployed">Unemployed</SelectItem>
                        <SelectItem value="retired">Retired</SelectItem>
                        <SelectItem value="disabled">On Disability</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Additional Information</Label>
                    <Textarea placeholder="Describe your financial situation or any hardships..." />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setAidDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleApplyAid}>Submit Application</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          {/* Eligible Schemes */}
          <div>
            <h4 className="font-medium mb-3">Eligible Government & Hospital Programs</h4>
            <div className="grid gap-3">
              {financialInfo.eligibleSchemes.map((scheme, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Landmark className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">{scheme}</span>
                  </div>
                  <Button size="sm" variant="outline">Learn More</Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Document Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Required Documents
          </CardTitle>
          <CardDescription>Upload documents for financial aid verification</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {financialInfo.documents.map((doc, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{doc.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {doc.status === 'Verified' ? 'Document verified' :
                       doc.status === 'Pending' ? 'Pending verification' :
                       'Document required'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(doc.status)}
                  {doc.status === 'Rejected' && (
                    <Button size="sm" variant="outline" onClick={() => handleUploadDocument(doc.name)} disabled={uploading}>
                      <Upload className="mr-1 h-4 w-4" />
                      Re-upload
                    </Button>
                  )}
                  {doc.status !== 'Verified' && doc.status !== 'Pending' && (
                    <Button size="sm" variant="outline" onClick={() => handleUploadDocument(doc.name)} disabled={uploading}>
                      <Upload className="mr-1 h-4 w-4" />
                      Upload
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contact Info */}
      <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
            Questions About Billing?
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-blue-700 dark:text-blue-300">
          <p className="mb-4">
            Our financial counseling team is here to help you understand your options and find solutions.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="border-blue-300">
              Schedule Financial Counseling
            </Button>
            <Button variant="outline" className="border-blue-300">
              Call Billing Department
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

