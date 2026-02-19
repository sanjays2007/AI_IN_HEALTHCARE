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
  mockFinanceStats,
  mockApplications,
  mockDisbursements,
  mockBudgetCategories,
  getStatusColor,
  getPriorityColor,
  getCategoryColor,
  formatCurrency,
} from '@/lib/finance-data';

export default function FinanceDashboardPage() {
  const stats = mockFinanceStats;
  const pendingApplications = mockApplications.filter(
    (a) => a.status === 'pending' || a.status === 'under-review'
  );
  const recentDisbursements = mockDisbursements.slice(0, 5);

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
                    <Button variant="ghost" size="sm">
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
            <Button className="h-auto py-4 flex-col bg-emerald-600 hover:bg-emerald-700">
              <FileText className="h-5 w-5 mb-2" />
              <span>New Application</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col">
              <DollarSign className="h-5 w-5 mb-2" />
              <span>Process Disbursement</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col">
              <TrendingUp className="h-5 w-5 mb-2" />
              <span>Generate Report</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col">
              <AlertTriangle className="h-5 w-5 mb-2" />
              <span>View Urgent Cases</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
