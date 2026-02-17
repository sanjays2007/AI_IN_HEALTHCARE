'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

const departmentData = [
  { name: 'TB', dropoutRate: 18, successRate: 82 },
  { name: 'Dialysis', dropoutRate: 12, successRate: 88 },
  { name: 'Chemo', dropoutRate: 25, successRate: 75 },
  { name: 'Mental Health', dropoutRate: 35, successRate: 65 },
];

const causeData = [
    { name: 'Financial', count: 42 },
    { name: 'Side Effects', count: 31 },
    { name: 'Emotional', count: 25 },
    { name: 'Travel', count: 18 },
    { name: 'Engagement', count: 12 },
];

const seasonalData = [
  { month: 'Jan', dropouts: 15 },
  { month: 'Feb', dropouts: 12 },
  { month: 'Mar', dropouts: 18 },
  { month: 'Apr', dropouts: 22 },
  { month: 'May', dropouts: 25 },
  { month: 'Jun', dropouts: 30 },
  { month: 'Jul', dropouts: 35 },
  { month: 'Aug', dropouts: 32 },
  { month: 'Sep', dropouts: 28 },
  { month: 'Oct', dropouts: 20 },
  { month: 'Nov', dropouts: 18 },
  { month: 'Dec', dropouts: 22 },
];


const chartConfig = {
  dropoutRate: { label: 'Dropout Rate', color: 'hsl(var(--destructive))' },
  successRate: { label: 'Success Rate', color: 'hsl(var(--chart-2))' },
  count: { label: 'Count', color: 'hsl(var(--primary))' },
  dropouts: { label: 'Dropouts', color: 'hsl(var(--primary))' },
};

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Department Analytics</h1>
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Dropout Rate by Department</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={departmentData}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="name" tickLine={false} axisLine={false} />
                        <YAxis tickLine={false} axisLine={false} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <ChartLegend content={<ChartLegendContent />} />
                        <Bar dataKey="dropoutRate" fill="var(--color-dropoutRate)" radius={4} />
                        <Bar dataKey="successRate" fill="var(--color-successRate)" radius={4} />
                    </BarChart>
                </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Common Dropout Causes</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={causeData} layout="vertical">
                        <CartesianGrid horizontal={false} />
                        <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} width={80} />
                        <XAxis type="number" hide />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="count" fill="var(--color-count)" radius={4} />
                    </BarChart>
                </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
            <CardTitle>Seasonal Dropout Patterns</CardTitle>
        </CardHeader>
        <CardContent>
            <ChartContainer config={chartConfig} className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={seasonalData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" tickLine={false} axisLine={false} />
                        <YAxis tickLine={false} axisLine={false} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line type="monotone" dataKey="dropouts" strokeWidth={2} stroke="var(--color-dropouts)" dot={{ fill: 'var(--color-dropouts)', r: 4 }} />
                    </LineChart>
                </ResponsiveContainer>
            </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
