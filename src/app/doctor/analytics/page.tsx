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
import { Button } from '@/components/ui/button';
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
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  AlertTriangle,
  DollarSign,
  Pill,
  Heart,
  Car,
  UserCheck,
  Activity,
  Calendar,
  Download,
  Filter,
  Eye,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import {
  mockDepartmentStats,
  mockRiskDistribution,
  mockPatientRiskProfiles,
} from '@/lib/doctor-data';

export default function DepartmentAnalyticsPage() {
  const [deptStats] = useState(mockDepartmentStats);
  const [timeRange, setTimeRange] = useState('30');
  const [selectedDept, setSelectedDept] = useState<typeof mockDepartmentStats[0] | null>(null);
  const [showDeptDialog, setShowDeptDialog] = useState(false);
  const [selectedCluster, setSelectedCluster] = useState<{ name: string; patients: typeof mockPatientRiskProfiles } | null>(null);
  const [showClusterDialog, setShowClusterDialog] = useState(false);
  const { toast } = useToast();

  // Calculate common dropout causes
  const riskFactorCounts = mockPatientRiskProfiles.reduce((acc, p) => {
    acc[p.primaryRiskFactor] = (acc[p.primaryRiskFactor] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sortedRiskFactors = Object.entries(riskFactorCounts)
    .sort(([, a], [, b]) => b - a);

  // Average metrics
  const avgAdherence = Math.round(
    mockPatientRiskProfiles.reduce((sum, p) => sum + p.medicationAdherence, 0) / mockPatientRiskProfiles.length
  );
  const avgRiskScore = Math.round(
    mockPatientRiskProfiles.reduce((sum, p) => sum + p.dropoutRiskScore, 0) / mockPatientRiskProfiles.length
  );

  const getFactorIcon = (factor: string) => {
    if (factor.toLowerCase().includes('financial')) return <DollarSign className="h-4 w-4" />;
    if (factor.toLowerCase().includes('side effect')) return <Pill className="h-4 w-4" />;
    if (factor.toLowerCase().includes('emotional')) return <Heart className="h-4 w-4" />;
    if (factor.toLowerCase().includes('travel')) return <Car className="h-4 w-4" />;
    if (factor.toLowerCase().includes('engagement')) return <UserCheck className="h-4 w-4" />;
    return <AlertTriangle className="h-4 w-4" />;
  };

  const handleExportReport = () => {
    toast({
      title: "Report Exported",
      description: "Analytics report downloaded as PDF",
    });
  };

  const handleExportCSV = () => {
    toast({
      title: "Data Exported",
      description: "Analytics data exported as CSV",
    });
  };

  const openDeptDetails = (dept: typeof mockDepartmentStats[0]) => {
    setSelectedDept(dept);
    setShowDeptDialog(true);
  };

  const deptPatients = (deptName: string) => 
    mockPatientRiskProfiles.filter(p => p.department === deptName);

  const financialClusterPatients = mockPatientRiskProfiles.filter(p => p.riskBreakdown.financial >= 40);
  const sideEffectClusterPatients = mockPatientRiskProfiles.filter(p => p.riskBreakdown.sideEffect >= 35);
  const emotionalClusterPatients = mockPatientRiskProfiles.filter(p => p.riskBreakdown.emotional >= 30);

  const openClusterDialog = (name: string, patients: typeof mockPatientRiskProfiles) => {
    setSelectedCluster({ name, patients });
    setShowClusterDialog(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-green-600" />
            Department Analytics
          </h1>
          <p className="text-muted-foreground">
            Macro-level insights across departments and treatment types
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[150px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleExportCSV}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={handleExportReport}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockPatientRiskProfiles.length}
            </div>
            <p className="text-xs text-muted-foreground">Across all departments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Risk Score</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              avgRiskScore >= 60 ? 'text-red-600' :
              avgRiskScore >= 40 ? 'text-yellow-600' : 'text-green-600'
            }`}>
              {avgRiskScore}%
            </div>
            <p className="text-xs text-muted-foreground">Organization-wide</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Adherence</CardTitle>
            <Pill className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              avgAdherence >= 80 ? 'text-green-600' :
              avgAdherence >= 60 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {avgAdherence}%
            </div>
            <p className="text-xs text-muted-foreground">Medication compliance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deptStats.length}</div>
            <p className="text-xs text-muted-foreground">Active departments</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="departments" className="space-y-6">
        <TabsList>
          <TabsTrigger value="departments">Department Comparison</TabsTrigger>
          <TabsTrigger value="causes">Dropout Causes</TabsTrigger>
          <TabsTrigger value="clusters">Risk Clusters</TabsTrigger>
        </TabsList>

        {/* Department Comparison */}
        <TabsContent value="departments" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Department Risk Table */}
            <Card>
              <CardHeader>
                <CardTitle>Department Risk Overview</CardTitle>
                <CardDescription>Which departments have highest dropout risk</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {deptStats.sort((a, b) => b.avgDropoutRisk - a.avgDropoutRisk).map((dept) => (
                    <div 
                      key={dept.department} 
                      className="space-y-2 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => openDeptDetails(dept)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{dept.department}</span>
                          <Badge variant="outline" className="text-xs">
                            {dept.totalPatients} patients
                          </Badge>
                          <Eye className="h-3 w-3 text-muted-foreground" />
                        </div>
                        <span className={`font-bold ${
                          dept.avgDropoutRisk >= 40 ? 'text-red-600' :
                          dept.avgDropoutRisk >= 30 ? 'text-orange-600' : 'text-green-600'
                        }`}>
                          {dept.avgDropoutRisk}%
                        </span>
                      </div>
                      <Progress 
                        value={dept.avgDropoutRisk} 
                        className={`h-2 ${
                          dept.avgDropoutRisk >= 40 ? '[&>div]:bg-red-500' :
                          dept.avgDropoutRisk >= 30 ? '[&>div]:bg-orange-500' : '[&>div]:bg-green-500'
                        }`}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{dept.highRiskCount} high risk patients</span>
                        <span>Top factor: {dept.topRiskFactor}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Department Completion Rates */}
            <Card>
              <CardHeader>
                <CardTitle>Treatment Completion Rates</CardTitle>
                <CardDescription>Success rates by department</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {deptStats.sort((a, b) => b.treatmentCompletionRate - a.treatmentCompletionRate).map((dept) => (
                    <div key={dept.department} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{dept.department}</span>
                        <span className={`font-bold ${
                          dept.treatmentCompletionRate >= 80 ? 'text-green-600' :
                          dept.treatmentCompletionRate >= 70 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {dept.treatmentCompletionRate}%
                        </span>
                      </div>
                      <Progress 
                        value={dept.treatmentCompletionRate} 
                        className={`h-3 ${
                          dept.treatmentCompletionRate >= 80 ? '[&>div]:bg-green-500' :
                          dept.treatmentCompletionRate >= 70 ? '[&>div]:bg-yellow-500' : '[&>div]:bg-red-500'
                        }`}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Visual Comparison Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Department Comparison Chart</CardTitle>
              <CardDescription>Risk vs Completion Rate by department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between gap-4 h-64 pt-8">
                {deptStats.map((dept) => (
                  <div key={dept.department} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full flex gap-1 h-48">
                      {/* Risk Bar */}
                      <div className="flex-1 flex flex-col-reverse">
                        <div 
                          className="w-full bg-red-500 rounded-t"
                          style={{ height: `${(dept.avgDropoutRisk / 100) * 100}%` }}
                        />
                      </div>
                      {/* Completion Bar */}
                      <div className="flex-1 flex flex-col-reverse">
                        <div 
                          className="w-full bg-green-500 rounded-t"
                          style={{ height: `${(dept.treatmentCompletionRate / 100) * 100}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-xs text-center font-medium">{dept.department}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded bg-red-500" />
                  <span className="text-sm">Avg Dropout Risk</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded bg-green-500" />
                  <span className="text-sm">Completion Rate</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Dropout Causes */}
        <TabsContent value="causes" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Common Dropout Risk Factors</CardTitle>
                <CardDescription>Primary causes of treatment discontinuation risk</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sortedRiskFactors.map(([factor, count]) => {
                    const percentage = Math.round((count / mockPatientRiskProfiles.length) * 100);
                    return (
                      <div key={factor} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getFactorIcon(factor)}
                            <span className="font-medium">{factor}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">{count} patients</span>
                            <span className="font-bold">{percentage}%</span>
                          </div>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Factor Distribution</CardTitle>
                <CardDescription>Visual breakdown of risk factors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center py-8">
                  <div className="relative h-48 w-48">
                    <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                      {sortedRiskFactors.reduce((acc, [factor, count], index) => {
                        const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6'];
                        const percentage = (count / mockPatientRiskProfiles.length) * 100;
                        const previousTotal = acc.total;
                        acc.total += percentage;
                        acc.elements.push(
                          <circle
                            key={factor}
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke={colors[index % colors.length]}
                            strokeWidth="20"
                            strokeDasharray={`${(percentage / 100) * 251.2} 251.2`}
                            strokeDashoffset={`${-(previousTotal / 100) * 251.2}`}
                          />
                        );
                        return acc;
                      }, { total: 0, elements: [] as React.JSX.Element[] }).elements}
                    </svg>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {sortedRiskFactors.map(([factor, count], index) => {
                    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-blue-500'];
                    return (
                      <div key={factor} className="flex items-center gap-2 text-sm">
                        <div className={`h-3 w-3 rounded ${colors[index % colors.length]}`} />
                        <span className="truncate">{factor}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Risk Clusters */}
        <TabsContent value="clusters" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>High-Risk Patient Clusters</CardTitle>
              <CardDescription>Identifying common patterns among high-risk patients</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div 
                  className="p-4 rounded-lg border bg-red-50 dark:bg-red-900/10 border-red-200 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => openClusterDialog('Financial Burden Cluster', financialClusterPatients)}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    <h4 className="font-semibold">Financial Burden Cluster</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Patients with high financial risk often show delayed payments and insurance gaps
                  </p>
                  <div className="text-2xl font-bold text-red-600">
                    {financialClusterPatients.length} patients
                  </div>
                  <p className="text-xs text-muted-foreground">Financial risk ≥ 40% • Click to view</p>
                </div>

                <div 
                  className="p-4 rounded-lg border bg-orange-50 dark:bg-orange-900/10 border-orange-200 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => openClusterDialog('Side Effect Cluster', sideEffectClusterPatients)}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Pill className="h-5 w-5 text-orange-500" />
                    <h4 className="font-semibold">Side Effect Cluster</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Patients experiencing severe side effects with poor medication adherence
                  </p>
                  <div className="text-2xl font-bold text-orange-600">
                    {sideEffectClusterPatients.length} patients
                  </div>
                  <p className="text-xs text-muted-foreground">Side effect risk ≥ 35% • Click to view</p>
                </div>

                <div 
                  className="p-4 rounded-lg border bg-purple-50 dark:bg-purple-900/10 border-purple-200 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => openClusterDialog('Emotional Distress Cluster', emotionalClusterPatients)}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Heart className="h-5 w-5 text-purple-500" />
                    <h4 className="font-semibold">Emotional Distress Cluster</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Patients showing signs of anxiety, depression, or treatment fatigue
                  </p>
                  <div className="text-2xl font-bold text-purple-600">
                    {emotionalClusterPatients.length} patients
                  </div>
                  <p className="text-xs text-muted-foreground">Emotional risk ≥ 30% • Click to view</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Seasonal Patterns</CardTitle>
              <CardDescription>Risk variations across time periods</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="p-4 rounded-lg bg-muted/50 text-center">
                  <Calendar className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                  <p className="font-semibold">Q1 2026</p>
                  <p className="text-2xl font-bold text-orange-600">+8%</p>
                  <p className="text-xs text-muted-foreground">Risk increase</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50 text-center">
                  <Calendar className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                  <p className="font-semibold">Q4 2025</p>
                  <p className="text-2xl font-bold text-red-600">+12%</p>
                  <p className="text-xs text-muted-foreground">Holiday season peak</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50 text-center">
                  <Calendar className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                  <p className="font-semibold">Q3 2025</p>
                  <p className="text-2xl font-bold text-green-600">-5%</p>
                  <p className="text-xs text-muted-foreground">Summer improvement</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50 text-center">
                  <Calendar className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                  <p className="font-semibold">Q2 2025</p>
                  <p className="text-2xl font-bold text-yellow-600">+3%</p>
                  <p className="text-xs text-muted-foreground">Stable period</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Department Detail Dialog */}
      <Dialog open={showDeptDialog} onOpenChange={setShowDeptDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedDept?.department} Department Details</DialogTitle>
            <DialogDescription>
              Detailed analytics and patient list for this department
            </DialogDescription>
          </DialogHeader>
          {selectedDept && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 rounded-lg bg-muted/50 text-center">
                  <p className="text-2xl font-bold">{selectedDept.totalPatients}</p>
                  <p className="text-xs text-muted-foreground">Total Patients</p>
                </div>
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/10 text-center">
                  <p className="text-2xl font-bold text-red-600">{selectedDept.highRiskCount}</p>
                  <p className="text-xs text-muted-foreground">High Risk</p>
                </div>
                <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/10 text-center">
                  <p className="text-2xl font-bold text-green-600">{selectedDept.treatmentCompletionRate}%</p>
                  <p className="text-xs text-muted-foreground">Completion Rate</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium">Top Risk Factor</p>
                <Badge variant="outline">{selectedDept.topRiskFactor}</Badge>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Average Dropout Risk</p>
                <div className="flex items-center gap-3">
                  <Progress value={selectedDept.avgDropoutRisk} className="flex-1 h-3" />
                  <span className="font-bold">{selectedDept.avgDropoutRisk}%</span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Patients in this Department</p>
                <div className="max-h-40 overflow-y-auto space-y-2">
                  {deptPatients(selectedDept.department).map(patient => (
                    <Link 
                      key={patient.id}
                      href={`/doctor/patients/${patient.id}`}
                      className="flex items-center justify-between p-2 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <span className="font-medium">{patient.name}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant={
                          patient.riskCategory === 'critical' ? 'destructive' :
                          patient.riskCategory === 'high' ? 'default' : 'secondary'
                        }>
                          {patient.dropoutRiskScore}% risk
                        </Badge>
                      </div>
                    </Link>
                  ))}
                  {deptPatients(selectedDept.department).length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No patients found in this department
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Cluster Detail Dialog */}
      <Dialog open={showClusterDialog} onOpenChange={setShowClusterDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedCluster?.name}</DialogTitle>
            <DialogDescription>
              {selectedCluster?.patients.length} patients in this risk cluster
            </DialogDescription>
          </DialogHeader>
          {selectedCluster && (
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {selectedCluster.patients.map(patient => (
                <Link
                  key={patient.id}
                  href={`/doctor/patients/${patient.id}`}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div>
                    <p className="font-medium">{patient.name}</p>
                    <p className="text-xs text-muted-foreground">{patient.department} • {patient.diagnosis}</p>
                  </div>
                  <Badge variant={patient.riskCategory === 'critical' ? 'destructive' : 'default'}>
                    {patient.dropoutRiskScore}%
                  </Badge>
                </Link>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
