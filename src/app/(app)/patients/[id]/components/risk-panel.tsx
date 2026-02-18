'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import type { Patient } from '@/lib/types';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Info } from "lucide-react"


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
        <CardTitle className="flex items-center justify-between">
          <span>AI Risk Panel</span>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground">
                <Info className="h-4 w-4" />
                <span className="sr-only">Why am I seeing this?</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>About the AI Risk Score</DialogTitle>
                <DialogDescription>
                  This explains how the AI calculates the patient's dropout risk.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 text-sm text-muted-foreground py-4">
                <p>The AI Risk Score is a percentage that predicts the likelihood of a patient discontinuing their treatment. It is calculated using a machine learning model that analyzes various data points, including:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>Clinical Data:</strong> Diagnosis, treatment phase, and lab results.</li>
                  <li><strong>Behavioral Patterns:</strong> Missed appointments, payment delays, and medication adherence.</li>
                  <li><strong>Reported Information:</strong> Side effects and mood reported by the patient.</li>
                </ul>
                <p>The "Risk Breakdown" chart shows the specific factors contributing most to the current score. This helps identify the primary areas of concern that may require intervention.</p>
                <p className="text-xs text-muted-foreground/80 pt-2 italic">This is a predictive tool and should be used to supplement, not replace, professional clinical judgment.</p>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
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
