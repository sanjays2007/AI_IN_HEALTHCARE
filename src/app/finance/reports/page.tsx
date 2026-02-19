'use client';

import { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Download,
  Calendar,
  FileText,
  PieChart,
  DollarSign,
  Users,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockBudgetCategories, formatCurrency } from '@/lib/finance-data';
import { useToast } from '@/hooks/use-toast';

export default function FinanceReportsPage() {
  const { toast } = useToast();
  const [reportPeriod, setReportPeriod] = useState('this-month');
  const [reportType, setReportType] = useState('summary');

  // Mock monthly data
  const monthlyData = [
    { month: 'Jan', applications: 35, approved: 28, disbursed: 580000 },
    { month: 'Feb', applications: 42, approved: 35, disbursed: 720000 },
    { month: 'Mar', applications: 38, approved: 30, disbursed: 650000 },
    { month: 'Apr', applications: 45, approved: 38, disbursed: 780000 },
    { month: 'May', applications: 48, approved: 40, disbursed: 820000 },
    { month: 'Jun', applications: 52, approved: 44, disbursed: 890000 },
  ];

  // Mock category distribution
  const categoryDistribution = [
    { category: 'Treatment', percentage: 45, amount: 828000, color: 'bg-pink-500' },
    { category: 'Medication', percentage: 28, amount: 515200, color: 'bg-purple-500' },
    { category: 'Transport', percentage: 17, amount: 312800, color: 'bg-cyan-500' },
    { category: 'Emergency', percentage: 8, amount: 147200, color: 'bg-red-500' },
    { category: 'Other', percentage: 2, amount: 36800, color: 'bg-gray-500' },
  ];

  const totalDisbursed = categoryDistribution.reduce((sum, c) => sum + c.amount, 0);

  // KPIs
  const kpis = {
    approvalRate: 84,
    avgProcessingTime: 3.2,
    beneficiaries: 156,
    avgDisbursement: 11827,
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Financial Reports</h1>
          <p className="text-muted-foreground">Analytics and insights for financial aid program</p>
        </div>
        <div className="flex gap-2">
          <Select value={reportPeriod} onValueChange={setReportPeriod}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
              <SelectItem value="this-quarter">This Quarter</SelectItem>
              <SelectItem value="this-year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => toast({ title: 'Exporting Report', description: 'Preparing financial report for download...' })}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-emerald-50 border-emerald-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-600">Approval Rate</p>
                <p className="text-3xl font-bold text-emerald-700">{kpis.approvalRate}%</p>
                <div className="flex items-center gap-1 text-emerald-600 text-xs mt-1">
                  <TrendingUp className="h-3 w-3" />
                  <span>+5% from last month</span>
                </div>
              </div>
              <CheckCircle className="h-10 w-10 text-emerald-300" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600">Avg. Processing Time</p>
                <p className="text-3xl font-bold text-blue-700">{kpis.avgProcessingTime} days</p>
                <div className="flex items-center gap-1 text-blue-600 text-xs mt-1">
                  <TrendingDown className="h-3 w-3" />
                  <span>-0.5 days improvement</span>
                </div>
              </div>
              <Clock className="h-10 w-10 text-blue-300" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600">Total Beneficiaries</p>
                <p className="text-3xl font-bold text-purple-700">{kpis.beneficiaries}</p>
                <div className="flex items-center gap-1 text-purple-600 text-xs mt-1">
                  <TrendingUp className="h-3 w-3" />
                  <span>+12 this month</span>
                </div>
              </div>
              <Users className="h-10 w-10 text-purple-300" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600">Avg. Disbursement</p>
                <p className="text-3xl font-bold text-orange-700">
                  {formatCurrency(kpis.avgDisbursement)}
                </p>
                <div className="flex items-center gap-1 text-orange-600 text-xs mt-1">
                  <span>Per beneficiary</span>
                </div>
              </div>
              <DollarSign className="h-10 w-10 text-orange-300" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Tabs */}
      <Tabs defaultValue="summary" className="space-y-4">
        <TabsList>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="categories">Category Analysis</TabsTrigger>
          <TabsTrigger value="budget">Budget Status</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Monthly Summary Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Monthly Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monthlyData.map((data, index) => (
                    <div key={data.month} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-8 text-sm font-medium">{data.month}</span>
                        <div className="w-32">
                          <Progress
                            value={(data.approved / data.applications) * 100}
                            className="h-2"
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-muted-foreground">
                          {data.approved}/{data.applications} approved
                        </span>
                        <span className="font-medium text-emerald-600">
                          {formatCurrency(data.disbursed)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Category Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Category Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryDistribution.map((cat) => (
                    <div key={cat.category} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${cat.color}`} />
                          <span className="text-sm font-medium">{cat.category}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {cat.percentage}%
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${cat.color}`}
                            style={{ width: `${cat.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-24 text-right">
                          {formatCurrency(cat.amount)}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div className="pt-4 border-t">
                    <div className="flex justify-between">
                      <span className="font-semibold">Total Disbursed</span>
                      <span className="font-bold text-emerald-600">
                        {formatCurrency(totalDisbursed)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Application & Approval Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Visual trend representation */}
                <div className="h-64 flex items-end gap-4 border-b pb-4">
                  {monthlyData.map((data) => (
                    <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full flex gap-1 justify-center" style={{ height: '200px' }}>
                        <div
                          className="w-6 bg-blue-200 rounded-t"
                          style={{ height: `${(data.applications / 60) * 100}%` }}
                          title={`${data.applications} applications`}
                        />
                        <div
                          className="w-6 bg-emerald-500 rounded-t"
                          style={{ height: `${(data.approved / 60) * 100}%` }}
                          title={`${data.approved} approved`}
                        />
                      </div>
                      <span className="text-sm font-medium">{data.month}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-200 rounded" />
                    <span className="text-sm">Applications</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-emerald-500 rounded" />
                    <span className="text-sm">Approved</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Disbursement Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monthlyData.map((data, index) => {
                    const prevAmount = index > 0 ? monthlyData[index - 1].disbursed : data.disbursed;
                    const change = ((data.disbursed - prevAmount) / prevAmount) * 100;
                    return (
                      <div key={data.month} className="flex items-center justify-between">
                        <span className="font-medium">{data.month} 2026</span>
                        <div className="flex items-center gap-3">
                          <span className="text-emerald-600 font-semibold">
                            {formatCurrency(data.disbursed)}
                          </span>
                          {index > 0 && (
                            <Badge
                              variant="outline"
                              className={
                                change >= 0
                                  ? 'text-green-600 border-green-200'
                                  : 'text-red-600 border-red-200'
                              }
                            >
                              {change >= 0 ? '+' : ''}
                              {change.toFixed(1)}%
                            </Badge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                    <div className="flex items-center gap-2 text-emerald-700">
                      <TrendingUp className="h-4 w-4" />
                      <span className="font-medium">Growing Demand</span>
                    </div>
                    <p className="text-sm text-emerald-600 mt-1">
                      Applications increased by 48% in the last 6 months
                    </p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 text-blue-700">
                      <Clock className="h-4 w-4" />
                      <span className="font-medium">Faster Processing</span>
                    </div>
                    <p className="text-sm text-blue-600 mt-1">
                      Average processing time reduced from 5 days to 3.2 days
                    </p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex items-center gap-2 text-purple-700">
                      <Users className="h-4 w-4" />
                      <span className="font-medium">High Impact</span>
                    </div>
                    <p className="text-sm text-purple-600 mt-1">
                      156 patients supported with financial aid this year
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-3">
            {categoryDistribution.map((cat) => (
              <Card key={cat.category}>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded ${cat.color}`} />
                    {cat.category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-3xl font-bold">{formatCurrency(cat.amount)}</p>
                      <p className="text-sm text-muted-foreground">
                        {cat.percentage}% of total disbursements
                      </p>
                    </div>
                    <Progress value={cat.percentage} className="h-2" />
                    <div className="text-sm text-muted-foreground">
                      <p>Avg. per application: {formatCurrency(Math.round(cat.amount / 28))}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="budget" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Budget Utilization by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mockBudgetCategories.map((budget) => {
                  const utilizedPercent = (budget.utilized / budget.allocated) * 100;
                  const remainingPercent = 100 - utilizedPercent;
                  const remaining = budget.allocated - budget.utilized;
                  return (
                    <div key={budget.category} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{budget.category}</span>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={
                              utilizedPercent > 80
                                ? 'text-red-600 border-red-200'
                                : utilizedPercent > 60
                                ? 'text-yellow-600 border-yellow-200'
                                : 'text-green-600 border-green-200'
                            }
                          >
                            {utilizedPercent.toFixed(0)}% used
                          </Badge>
                        </div>
                      </div>
                      <div className="h-4 bg-gray-100 rounded-full overflow-hidden flex">
                        <div
                          className="bg-emerald-500 h-full"
                          style={{ width: `${utilizedPercent}%` }}
                        />
                        {budget.pending > 0 && (
                          <div
                            className="bg-yellow-400 h-full"
                            style={{
                              width: `${(budget.pending / budget.allocated) * 100}%`,
                            }}
                          />
                        )}
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Utilized: {formatCurrency(budget.utilized)}
                        </span>
                        <span className="text-muted-foreground">
                          Remaining: {formatCurrency(remaining)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Available Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Available Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {[
              { name: 'Monthly Disbursement Report', icon: FileText },
              { name: 'Category-wise Analysis', icon: PieChart },
              { name: 'Beneficiary Demographics', icon: Users },
              { name: 'Budget Utilization Report', icon: BarChart3 },
            ].map((report) => (
              <Button
                key={report.name}
                variant="outline"
                className="h-auto py-4 flex-col justify-center"
                onClick={() => toast({ title: 'Downloading Report', description: `${report.name} is being prepared for download.` })}
              >
                <report.icon className="h-6 w-6 mb-2 text-emerald-600" />
                <span className="text-sm">{report.name}</span>
                <span className="text-xs text-muted-foreground mt-1">Download PDF</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
