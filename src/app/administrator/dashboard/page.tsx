'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Users,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  Shield,
  IndianRupee,
  Activity,
  ArrowRight,
  Bell,
  Building2,
} from 'lucide-react';
import {
  mockAdminStats,
  mockMonthlyTrends,
  mockDepartmentPerformance,
  mockRiskFactorBreakdown,
  mockSystemAlerts,
  formatCurrency,
  getAlertPriorityColor,
} from '@/lib/admin-data';

export default function AdminDashboardPage() {
  const [stats] = useState(mockAdminStats);
  const [trends] = useState(mockMonthlyTrends);
  const [departments] = useState(mockDepartmentPerformance);
  const [riskFactors] = useState(mockRiskFactorBreakdown);
  const [alerts] = useState(mockSystemAlerts.filter(a => !a.isRead).slice(0, 4));

  const predictionAccuracy = ((stats.preventedDropouts / stats.predictedDropouts) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Activity className="h-8 w-8 text-purple-600" />
            Executive Dashboard
          </h1>
          <p className="text-muted-foreground">
            Hospital-wide treatment adherence overview and strategic insights
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/administrator/reports">
              Generate Report
            </Link>
          </Button>
          <Button asChild className="bg-purple-600 hover:bg-purple-700">
            <Link href="/administrator/alerts">
              <Bell className="h-4 w-4 mr-2" />
              View Alerts
              {alerts.length > 0 && (
                <Badge variant="secondary" className="ml-2">{alerts.length}</Badge>
              )}
            </Link>
          </Button>
        </div>
      </div>

      {/* Key Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Active Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalActivePatients.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across all departments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Dropout Risk</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.overallDropoutRisk}%</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingDown className="h-3 w-3 mr-1" />
              -2.3% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High-Risk Patients</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.highRiskCount}</div>
            <p className="text-xs text-muted-foreground">Requiring intervention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.treatmentCompletionRate}%</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +1.5% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prevention Rate</CardTitle>
            <Shield className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.dropoutPreventionRate}%</div>
            <p className="text-xs text-muted-foreground">{stats.preventedDropouts} dropouts prevented</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Financial Aid</CardTitle>
            <IndianRupee className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.financialAssistanceDistributed)}</div>
            <p className="text-xs text-muted-foreground">Distributed this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Monthly Dropout Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Dropout & Completion Trends</CardTitle>
            <CardDescription>6-month overview of key metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <svg viewBox="0 0 500 200" className="w-full h-full">
                {/* Grid lines */}
                {[0, 1, 2, 3, 4].map((i) => (
                  <line
                    key={i}
                    x1="50"
                    y1={40 + i * 35}
                    x2="480"
                    y2={40 + i * 35}
                    stroke="currentColor"
                    strokeOpacity="0.1"
                  />
                ))}
                
                {/* Y-axis labels */}
                <text x="40" y="45" textAnchor="end" className="text-xs fill-muted-foreground">80%</text>
                <text x="40" y="80" textAnchor="end" className="text-xs fill-muted-foreground">60%</text>
                <text x="40" y="115" textAnchor="end" className="text-xs fill-muted-foreground">40%</text>
                <text x="40" y="150" textAnchor="end" className="text-xs fill-muted-foreground">20%</text>
                <text x="40" y="185" textAnchor="end" className="text-xs fill-muted-foreground">0%</text>

                {/* Completion rate line (green) */}
                <polyline
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="3"
                  points={trends.map((t, i) => {
                    const x = 80 + i * 70;
                    const y = 180 - (t.completionRate * 1.75);
                    return `${x},${y}`;
                  }).join(' ')}
                />
                {trends.map((t, i) => (
                  <circle
                    key={`completion-${i}`}
                    cx={80 + i * 70}
                    cy={180 - (t.completionRate * 1.75)}
                    r="4"
                    fill="#22c55e"
                  />
                ))}

                {/* Dropout rate line (red) */}
                <polyline
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="3"
                  points={trends.map((t, i) => {
                    const x = 80 + i * 70;
                    const y = 180 - (t.dropoutRate * 1.75);
                    return `${x},${y}`;
                  }).join(' ')}
                />
                {trends.map((t, i) => (
                  <circle
                    key={`dropout-${i}`}
                    cx={80 + i * 70}
                    cy={180 - (t.dropoutRate * 1.75)}
                    r="4"
                    fill="#ef4444"
                  />
                ))}

                {/* X-axis labels */}
                {trends.map((t, i) => (
                  <text
                    key={`label-${i}`}
                    x={80 + i * 70}
                    y="198"
                    textAnchor="middle"
                    className="text-xs fill-muted-foreground"
                  >
                    {t.month}
                  </text>
                ))}
              </svg>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-500" />
                <span className="text-sm">Completion Rate</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <span className="text-sm">Dropout Rate</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Risk Factor Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Dropout Risk Factor Breakdown</CardTitle>
            <CardDescription>Primary causes of treatment dropout</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {riskFactors.map((factor) => (
                <div key={factor.factor} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{factor.factor}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {factor.patientCount} patients
                      </span>
                      <Badge 
                        variant={factor.trend === 'up' ? 'destructive' : factor.trend === 'down' ? 'secondary' : 'outline'}
                        className="text-xs"
                      >
                        {factor.trend === 'up' ? '↑' : factor.trend === 'down' ? '↓' : '→'}
                      </Badge>
                      <span className="text-sm font-bold">{factor.percentage}%</span>
                    </div>
                  </div>
                  <Progress 
                    value={factor.percentage} 
                    className="h-2"
                    style={{ 
                      // @ts-ignore
                      '--progress-background': factor.color 
                    }}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Department & Treatment Comparison */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Department-wise Dropout Rate */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Department-wise Dropout Rate</CardTitle>
              <CardDescription>Compare treatment adherence across departments</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/administrator/departments">
                View Details <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-[220px]">
              <svg viewBox="0 0 500 200" className="w-full h-full">
                {departments.slice(0, 5).map((dept, i) => {
                  const barWidth = 60;
                  const x = 50 + i * 90;
                  const barHeight = dept.dropoutRate * 4;
                  const y = 160 - barHeight;
                  const color = dept.dropoutRate > 30 ? '#ef4444' : dept.dropoutRate > 20 ? '#f97316' : dept.dropoutRate > 15 ? '#eab308' : '#22c55e';
                  
                  return (
                    <g key={dept.id}>
                      <rect
                        x={x}
                        y={y}
                        width={barWidth}
                        height={barHeight}
                        fill={color}
                        rx="4"
                      />
                      <text
                        x={x + barWidth / 2}
                        y={y - 8}
                        textAnchor="middle"
                        className="text-xs font-medium fill-current"
                      >
                        {dept.dropoutRate}%
                      </text>
                      <text
                        x={x + barWidth / 2}
                        y="180"
                        textAnchor="middle"
                        className="text-xs fill-muted-foreground"
                      >
                        {dept.name.split(' ')[0]}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </CardContent>
        </Card>

        {/* Recent System Alerts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent System Alerts</CardTitle>
              <CardDescription>Priority notifications requiring attention</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/administrator/alerts">
                View All <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No pending alerts</p>
              ) : (
                alerts.map((alert) => (
                  <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg border bg-muted/30">
                    <div className={`h-2 w-2 rounded-full mt-2 ${getAlertPriorityColor(alert.priority)}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{alert.title}</span>
                        <Badge variant="outline" className="text-xs capitalize">
                          {alert.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1">{alert.description}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Prediction Performance & Quick Stats */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* AI Prediction Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-600" />
              AI Prediction Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600">{predictionAccuracy}%</div>
              <p className="text-sm text-muted-foreground">Prevention Success Rate</p>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.predictedDropouts}</div>
                <p className="text-xs text-muted-foreground">Predicted Dropouts</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.preventedDropouts}</div>
                <p className="text-xs text-muted-foreground">Successfully Prevented</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Performing Department */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-green-600" />
              Top Performing Department
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const topDept = [...departments].sort((a, b) => b.interventionSuccessRate - a.interventionSuccessRate)[0];
              return (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{topDept.name}</div>
                    <Badge variant="secondary" className="mt-1">Best in class</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <div className="text-xl font-bold text-green-600">{topDept.interventionSuccessRate}%</div>
                      <p className="text-xs text-muted-foreground">Success Rate</p>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold">{topDept.dropoutRate}%</div>
                      <p className="text-xs text-muted-foreground">Dropout Rate</p>
                    </div>
                  </div>
                </div>
              );
            })()}
          </CardContent>
        </Card>

        {/* Department Needing Attention */}
        <Card className="border-orange-200 dark:border-orange-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-600">
              <AlertTriangle className="h-5 w-5" />
              Needs Attention
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const worstDept = [...departments].sort((a, b) => b.dropoutRate - a.dropoutRate)[0];
              return (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{worstDept.name}</div>
                    <Badge variant="destructive" className="mt-1">High Dropout</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <div className="text-xl font-bold text-red-600">{worstDept.dropoutRate}%</div>
                      <p className="text-xs text-muted-foreground">Dropout Rate</p>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold">{worstDept.highRiskPercent}%</div>
                      <p className="text-xs text-muted-foreground">High Risk</p>
                    </div>
                  </div>
                </div>
              );
            })()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
