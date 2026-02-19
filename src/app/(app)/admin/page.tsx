'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from 'recharts';
import { patients } from '@/lib/data';
import {
    Users,
    TrendingUp,
    HeartPulse,
    Banknote,
    Activity,
    ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// --- Data Calculations ---
const totalPatients = patients.length;
const highRiskPatients = patients.filter(p => p.riskCategory === 'Critical' || p.riskCategory === 'High').length;
const overallCompletionRate = patients.reduce((acc, p) => acc + p.completionPercentage, 0) / totalPatients;
// Mock data for new metrics
const dropoutPreventionRate = 75; // Mocked
const financialAssistance = 50000; // Mocked in local currency

const departmentData = [
  { name: 'TB', dropoutRate: 18, patients: 35, highRisk: 8 },
  { name: 'Dialysis', dropoutRate: 12, patients: 25, highRisk: 4 },
  { name: 'Chemo', dropoutRate: 25, patients: 20, highRisk: 5 },
  { name: 'Mental Health', dropoutRate: 35, patients: 30, highRisk: 12 },
  { name: 'Substance Use', dropoutRate: 45, patients: 15, highRisk: 7 },
];

const riskFactorData = [
    { name: 'Financial', value: 35 },
    { name: 'Emotional', value: 20 },
    { name: 'Side Effects', value: 18 },
    { name: 'Travel', value: 12 },
    { name: 'Engagement', value: 15 },
];


const chartConfig = {
    dropoutRate: { label: 'Dropout Rate', color: 'hsl(var(--destructive))' },
    value: { label: 'Contribution', color: 'hsl(var(--primary))' },
};


export default function AdminPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Administrator Dashboard</h1>

      {/* Key Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPatients}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High-Risk Patients</CardTitle>
            <HeartPulse className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{highRiskPatients}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallCompletionRate.toFixed(1)}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dropout Prevention</CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dropoutPreventionRate}%</div>
            <p className="text-xs text-muted-foreground">Success rate of interventions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aid Distributed</CardTitle>
            <Banknote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{financialAssistance.toLocaleString()}</div>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Risk</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <p className="text-xs text-muted-foreground">Average patient risk score</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-5">
        {/* Risk Factor Breakdown Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Top Dropout Risk Factors</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={riskFactorData} layout="vertical" margin={{ left: 20 }}>
                        <CartesianGrid horizontal={false} />
                        <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} width={80} />
                        <XAxis type="number" hide />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="value" fill="var(--color-value)" radius={4}>
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
        
        {/* Department Performance Table */}
        <Card className="lg:col-span-3">
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
                <CardTitle>Department Performance</CardTitle>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1">
                <a href="#">Export Report</a>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Department</TableHead>
                  <TableHead>Patients</TableHead>
                  <TableHead>Dropout Rate</TableHead>
                  <TableHead>High Risk %</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {departmentData.map((dept) => (
                  <TableRow key={dept.name}>
                    <TableCell className="font-medium">{dept.name}</TableCell>
                    <TableCell>{dept.patients}</TableCell>
                    <TableCell className="text-destructive">{dept.dropoutRate}%</TableCell>
                    <TableCell>{((dept.highRisk / dept.patients) * 100).toFixed(0)}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
