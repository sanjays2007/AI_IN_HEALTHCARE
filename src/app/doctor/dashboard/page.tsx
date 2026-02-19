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
import { Progress } from '@/components/ui/progress';
import {
  Users,
  AlertTriangle,
  AlertCircle,
  Bell,
  TrendingDown,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';
import {
  mockDashboardStats,
  mockRiskDistribution,
  mockDepartmentStats,
  mockRiskTrends,
  mockDoctorAlerts,
  getRiskColor,
} from '@/lib/doctor-data';

export default function DoctorDashboardPage() {
  const [stats] = useState(mockDashboardStats);
  const [riskDist] = useState(mockRiskDistribution);
  const [deptStats] = useState(mockDepartmentStats);
  const [trends] = useState(mockRiskTrends);
  const [alerts] = useState(mockDoctorAlerts.filter(a => !a.isRead).slice(0, 4));

  const totalPatients = riskDist.low + riskDist.medium + riskDist.high + riskDist.critical;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clinical Dashboard</h1>
          <p className="text-muted-foreground">
            Predictive dropout risk analysis and intervention management
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/doctor/alerts">
              <Bell className="h-4 w-4 mr-2" />
              View All Alerts
              <Badge variant="destructive" className="ml-2">
                {stats.newRiskAlertsToday}
              </Badge>
            </Link>
          </Button>
          <Button asChild>
            <Link href="/doctor/patients">
              <Users className="h-4 w-4 mr-2" />
              Patient Risk List
            </Link>
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalActivePatients}</div>
            <p className="text-xs text-muted-foreground">Under your care</p>
          </CardContent>
        </Card>

        <Card className="border-red-200 dark:border-red-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Risk</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.highRiskPatients}</div>
            <div className="flex items-center text-xs text-red-500">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +3 this week
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-200 dark:border-yellow-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Medium Risk</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.mediumRiskPatients}</div>
            <div className="flex items-center text-xs text-yellow-500">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +5 this week
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 dark:border-orange-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Alerts Today</CardTitle>
            <Bell className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.newRiskAlertsToday}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>

        <Card className="border-green-200 dark:border-green-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stabilized</CardTitle>
            <TrendingDown className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.patientsStabilizedThisMonth}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200 dark:border-blue-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.treatmentCompletionRate}%</div>
            <div className="flex items-center text-xs text-green-500">
              <ArrowDownRight className="h-3 w-3 mr-1" />
              +2.3% vs last month
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Risk Distribution Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Risk Distribution</CardTitle>
            <CardDescription>Patient dropout risk categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Visual Pie-like representation using progress bars */}
              <div className="flex items-center justify-center gap-4 py-4">
                <div className="relative h-40 w-40">
                  <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                    {/* Low Risk - Green */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#22c55e"
                      strokeWidth="20"
                      strokeDasharray={`${(riskDist.low / totalPatients) * 251.2} 251.2`}
                      className="drop-shadow-sm"
                    />
                    {/* Medium Risk - Yellow */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#eab308"
                      strokeWidth="20"
                      strokeDasharray={`${(riskDist.medium / totalPatients) * 251.2} 251.2`}
                      strokeDashoffset={`${-(riskDist.low / totalPatients) * 251.2}`}
                      className="drop-shadow-sm"
                    />
                    {/* High Risk - Orange */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#f97316"
                      strokeWidth="20"
                      strokeDasharray={`${(riskDist.high / totalPatients) * 251.2} 251.2`}
                      strokeDashoffset={`${-((riskDist.low + riskDist.medium) / totalPatients) * 251.2}`}
                      className="drop-shadow-sm"
                    />
                    {/* Critical Risk - Red */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="20"
                      strokeDasharray={`${(riskDist.critical / totalPatients) * 251.2} 251.2`}
                      strokeDashoffset={`${-((riskDist.low + riskDist.medium + riskDist.high) / totalPatients) * 251.2}`}
                      className="drop-shadow-sm"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{totalPatients}</div>
                      <div className="text-xs text-muted-foreground">Total</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 p-2 rounded-lg bg-green-50 dark:bg-green-900/20">
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                  <span className="text-sm">Low Risk</span>
                  <span className="ml-auto font-semibold">{riskDist.low}</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                  <div className="h-3 w-3 rounded-full bg-yellow-500" />
                  <span className="text-sm">Medium</span>
                  <span className="ml-auto font-semibold">{riskDist.medium}</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-orange-50 dark:bg-orange-900/20">
                  <div className="h-3 w-3 rounded-full bg-orange-500" />
                  <span className="text-sm">High Risk</span>
                  <span className="ml-auto font-semibold">{riskDist.high}</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-red-50 dark:bg-red-900/20">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <span className="text-sm">Critical</span>
                  <span className="ml-auto font-semibold">{riskDist.critical}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Risk Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Risk Trend</CardTitle>
            <CardDescription>Risk level changes over the past 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Simple bar chart representation */}
              <div className="flex items-end justify-between gap-2 h-40 pt-4">
                {trends.map((day, i) => {
                  const total = day.lowRisk + day.mediumRisk + day.highRisk + day.criticalRisk;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full flex flex-col-reverse gap-0.5" style={{ height: '120px' }}>
                        <div 
                          className="w-full bg-green-500 rounded-t-sm" 
                          style={{ height: `${(day.lowRisk / total) * 100}%` }}
                        />
                        <div 
                          className="w-full bg-yellow-500" 
                          style={{ height: `${(day.mediumRisk / total) * 100}%` }}
                        />
                        <div 
                          className="w-full bg-orange-500" 
                          style={{ height: `${(day.highRisk / total) * 100}%` }}
                        />
                        <div 
                          className="w-full bg-red-500 rounded-b-sm" 
                          style={{ height: `${(day.criticalRisk / total) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Trend summary */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Weekly Change</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center text-red-500">
                    <ArrowUpRight className="h-4 w-4" />
                    <span className="text-sm font-medium">+4 High Risk</span>
                  </div>
                  <div className="flex items-center text-green-500">
                    <ArrowDownRight className="h-4 w-4" />
                    <span className="text-sm font-medium">-4 Low Risk</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Department Risk Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Department Risk Overview</CardTitle>
            <CardDescription>Risk distribution by department</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {deptStats.map((dept) => (
                <div key={dept.department} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{dept.department}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {dept.highRiskCount} high risk
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {dept.totalPatients} patients
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress 
                      value={100 - dept.avgDropoutRisk} 
                      className="h-2 flex-1"
                    />
                    <span className="text-sm font-medium w-12 text-right">
                      {dept.avgDropoutRisk}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Top Factor: {dept.topRiskFactor}</span>
                    <span>Completion: {dept.treatmentCompletionRate}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Alerts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Alerts</CardTitle>
              <CardDescription>Unread notifications requiring attention</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/doctor/alerts">
                View All
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <p>No unread alerts</p>
                </div>
              ) : (
                alerts.map((alert) => (
                  <Link
                    key={alert.id}
                    href={`/doctor/patients/${alert.patientId}`}
                    className={`block p-3 rounded-lg border transition-colors hover:bg-muted/50 ${
                      alert.priority === 'critical' ? 'border-red-300 bg-red-50/50 dark:bg-red-900/10' :
                      alert.priority === 'high' ? 'border-orange-300 bg-orange-50/50 dark:bg-orange-900/10' :
                      'border-border'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-1.5 rounded-full ${
                        alert.priority === 'critical' ? 'bg-red-100 text-red-600 dark:bg-red-900/30' :
                        alert.priority === 'high' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30' :
                        alert.priority === 'moderate' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30' :
                        'bg-green-100 text-green-600 dark:bg-green-900/30'
                      }`}>
                        <AlertTriangle className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{alert.patientName}</span>
                          <Badge variant={alert.priority === 'critical' ? 'destructive' : 'outline'} className="text-xs">
                            {alert.priority}
                          </Badge>
                        </div>
                        <p className="text-sm font-medium mt-0.5">{alert.title}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                          {alert.description}
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    </div>
                  </Link>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common clinical workflows</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
              <Link href="/doctor/patients?filter=critical">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <span>View Critical Patients</span>
                <span className="text-xs text-muted-foreground">
                  {riskDist.critical} patients
                </span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
              <Link href="/doctor/recommendations">
                <Activity className="h-5 w-5 text-blue-500" />
                <span>AI Recommendations</span>
                <span className="text-xs text-muted-foreground">
                  7 pending actions
                </span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
              <Link href="/doctor/simulation">
                <TrendingDown className="h-5 w-5 text-purple-500" />
                <span>Run Simulation</span>
                <span className="text-xs text-muted-foreground">
                  Predict intervention impact
                </span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
              <Link href="/doctor/analytics">
                <Users className="h-5 w-5 text-green-500" />
                <span>Department Analytics</span>
                <span className="text-xs text-muted-foreground">
                  View macro insights
                </span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
