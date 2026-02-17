'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import type { Patient } from '@/lib/types';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts';

export default function RiskPanel({ patient }: { patient: Patient }) {
  const chartData = patient.riskBreakdown.map(factor => ({
    name: factor.name,
    score: factor.score,
    fill: `hsl(var(--chart-${patient.riskBreakdown.indexOf(factor) + 1}))`
  }));

  const chartConfig = patient.riskBreakdown.reduce((acc, factor, index) => {
    acc[factor.name] = {
      label: factor.name,
      color: `hsl(var(--chart-${index + 1}))`,
    };
    return acc;
  }, {} as any);

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Risk Panel</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6">
        <div className="flex flex-col items-center">
          <p className="text-sm text-muted-foreground">Overall Risk Score</p>
          <p className="text-6xl font-bold text-destructive">{patient.riskScore}%</p>
        </div>
        <div className="w-full h-64">
          <ChartContainer config={chartConfig} className="w-full h-full">
            <ResponsiveContainer>
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ left: 10, right: 10 }}
              >
                <CartesianGrid horizontal={false} />
                <YAxis
                  dataKey="name"
                  type="category"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                  width={80}
                />
                <XAxis dataKey="score" type="number" hide />
                <ChartTooltip
                  cursor={{ fill: 'hsl(var(--muted))' }}
                  content={<ChartTooltipContent />}
                />
                <Bar dataKey="score" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
