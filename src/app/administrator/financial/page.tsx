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
import { Progress } from '@/components/ui/progress';
import {
  IndianRupee,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Receipt,
  Calculator,
  CheckCircle2,
  Clock,
  Target,
} from 'lucide-react';
import { mockFinancialMetrics, mockAdminStats, formatCurrency } from '@/lib/admin-data';

export default function FinancialImpactPage() {
  const [metrics] = useState(mockFinancialMetrics);
  const [stats] = useState(mockAdminStats);

  const totalSaved = metrics.costSavedPerPrevention * stats.preventedDropouts;
  const netROI = totalSaved - metrics.totalAllocated;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <IndianRupee className="h-8 w-8 text-purple-600" />
          Financial Impact Monitoring
        </h1>
        <p className="text-muted-foreground">
          Track ROI of intervention programs and financial assistance
        </p>
      </div>

      {/* Key Financial Metrics */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Aid Allocated</CardTitle>
            <PiggyBank className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics.totalAllocated)}</div>
            <p className="text-xs text-muted-foreground">This fiscal year</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Installment Adoption</CardTitle>
            <Receipt className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{metrics.installmentAdoptionRate}%</div>
            <p className="text-xs text-muted-foreground">Patients using plans</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Financial Dropout ↓</CardTitle>
            <TrendingDown className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{metrics.financialDropoutReduction}%</div>
            <p className="text-xs text-muted-foreground">Reduction achieved</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cost Per Prevention</CardTitle>
            <Calculator className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics.costSavedPerPrevention)}</div>
            <p className="text-xs text-muted-foreground">Avg treatment value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cost Saved</CardTitle>
            <Target className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(totalSaved)}</div>
            <p className="text-xs text-muted-foreground">From {stats.preventedDropouts} preventions</p>
          </CardContent>
        </Card>

        <Card className="border-green-200 dark:border-green-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ROI</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{metrics.roiPercentage}%</div>
            <p className="text-xs text-muted-foreground">Return on investment</p>
          </CardContent>
        </Card>
      </div>

      {/* ROI Visualization */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Return on Investment Analysis</CardTitle>
            <CardDescription>Financial aid investment vs savings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Investment vs Return Bars */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Investment (Financial Aid)</span>
                    <span className="font-medium">{formatCurrency(metrics.totalAllocated)}</span>
                  </div>
                  <div className="h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-medium">
                    {formatCurrency(metrics.totalAllocated)}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Return (Cost Saved from Preventions)</span>
                    <span className="font-medium text-green-600">{formatCurrency(totalSaved)}</span>
                  </div>
                  <div 
                    className="h-8 bg-green-500 rounded-lg flex items-center justify-center text-white font-medium"
                    style={{ width: `${Math.min((totalSaved / metrics.totalAllocated) * 100, 100)}%` }}
                  >
                    {formatCurrency(totalSaved)}
                  </div>
                </div>
              </div>
              
              {/* Net Gain */}
              <div className="p-4 rounded-lg bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-700 dark:text-green-400">Net Financial Gain</p>
                    <p className="text-xs text-muted-foreground">Return minus investment</p>
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    +{formatCurrency(netROI)}
                  </div>
                </div>
              </div>
              
              {/* ROI Breakdown */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                <div className="text-center">
                  <div className="text-xl font-bold text-purple-600">{stats.predictedDropouts}</div>
                  <p className="text-xs text-muted-foreground">At-Risk</p>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-green-600">{stats.preventedDropouts}</div>
                  <p className="text-xs text-muted-foreground">Prevented</p>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-green-600">{metrics.roiPercentage}%</div>
                  <p className="text-xs text-muted-foreground">ROI</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Application Status */}
        <Card>
          <CardHeader>
            <CardTitle>Financial Aid Status</CardTitle>
            <CardDescription>Current month application overview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Status Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-yellow-600" />
                  <span className="font-medium">Pending</span>
                </div>
                <div className="text-2xl font-bold">{metrics.pendingApplications}</div>
                <p className="text-xs text-muted-foreground">Applications awaiting review</p>
              </div>
              <div className="p-4 rounded-lg bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span className="font-medium">Approved</span>
                </div>
                <div className="text-2xl font-bold text-green-600">{metrics.approvedThisMonth}</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </div>
            </div>
            
            {/* Budget Utilization */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Monthly Budget Utilization</span>
                <span className="font-medium">85%</span>
              </div>
              <Progress value={85} className="h-3" />
              <p className="text-xs text-muted-foreground">
                ₹20,82,500 of ₹24,50,000 utilized
              </p>
            </div>
            
            {/* Aid Distribution by Type */}
            <div className="space-y-3 pt-4 border-t">
              <h4 className="font-medium text-sm">Aid Distribution by Type</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Direct Payment Assistance</span>
                  <span className="text-sm font-medium">45%</span>
                </div>
                <Progress value={45} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Installment Plans</span>
                  <span className="text-sm font-medium">35%</span>
                </div>
                <Progress value={35} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Transportation Support</span>
                  <span className="text-sm font-medium">12%</span>
                </div>
                <Progress value={12} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Emergency Fund</span>
                  <span className="text-sm font-medium">8%</span>
                </div>
                <Progress value={8} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Impact Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Financial Program Impact</CardTitle>
          <CardDescription>How financial support reduces dropout risk</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-4">
            <div className="p-4 rounded-lg border bg-muted/30 text-center">
              <IndianRupee className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <div className="text-xl font-bold">{formatCurrency(metrics.totalAllocated)}</div>
              <p className="text-sm text-muted-foreground">Total Investment</p>
              <Badge variant="outline" className="mt-2">Financial Aid Program</Badge>
            </div>
            <div className="p-4 rounded-lg border bg-muted/30 text-center">
              <Target className="h-8 w-8 mx-auto mb-2 text-purple-500" />
              <div className="text-xl font-bold">{stats.preventedDropouts}</div>
              <p className="text-sm text-muted-foreground">Dropouts Prevented</p>
              <Badge variant="outline" className="mt-2">Direct Impact</Badge>
            </div>
            <div className="p-4 rounded-lg border bg-muted/30 text-center">
              <Calculator className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <div className="text-xl font-bold text-green-600">{formatCurrency(totalSaved)}</div>
              <p className="text-sm text-muted-foreground">Cost Saved</p>
              <Badge variant="outline" className="mt-2">Treatment Value</Badge>
            </div>
            <div className="p-4 rounded-lg border bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800 text-center">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <div className="text-xl font-bold text-green-600">{metrics.roiPercentage}%</div>
              <p className="text-sm text-muted-foreground">Return on Investment</p>
              <Badge className="mt-2 bg-green-500">Enterprise Value</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Judge-Ready Metrics */}
      <Card className="border-purple-200 dark:border-purple-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-600" />
            Enterprise Value Summary
          </CardTitle>
          <CardDescription>Key metrics for leadership and stakeholders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
              <p className="text-sm text-muted-foreground mb-1">For every ₹1 invested</p>
              <p className="text-2xl font-bold text-purple-600">₹{(metrics.roiPercentage / 100 + 1).toFixed(2)} returned</p>
            </div>
            <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
              <p className="text-sm text-muted-foreground mb-1">Net savings this year</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(netROI)}</p>
            </div>
            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-muted-foreground mb-1">Patients retained</p>
              <p className="text-2xl font-bold text-blue-600">{stats.preventedDropouts} lives</p>
            </div>
            <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
              <p className="text-sm text-muted-foreground mb-1">Cost per life saved</p>
              <p className="text-2xl font-bold text-orange-600">{formatCurrency(Math.round(metrics.totalAllocated / stats.preventedDropouts))}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
