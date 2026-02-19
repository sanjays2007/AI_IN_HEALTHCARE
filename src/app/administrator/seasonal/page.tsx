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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  CloudRain,
  Sun,
  Calendar,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  BookOpen,
  PartyPopper,
  ThermometerSun,
  Snowflake,
} from 'lucide-react';
import { mockSeasonalPatterns, getRiskLevelColor } from '@/lib/admin-data';

export default function SeasonalAnalysisPage() {
  const [selectedYear, setSelectedYear] = useState('2024');

  const getSeasonIcon = (season: string) => {
    switch (season) {
      case 'Monsoon': return <CloudRain className="h-5 w-5 text-blue-500" />;
      case 'Summer': return <ThermometerSun className="h-5 w-5 text-orange-500" />;
      case 'Winter': return <Snowflake className="h-5 w-5 text-cyan-500" />;
      case 'Exam Season': return <BookOpen className="h-5 w-5 text-purple-500" />;
      case 'Festival Season': return <PartyPopper className="h-5 w-5 text-yellow-500" />;
      default: return <Calendar className="h-5 w-5 text-gray-500" />;
    }
  };

  const monthlyData = [
    { month: 'Jan', dropoutRisk: 14, events: ['New Year'] },
    { month: 'Feb', dropoutRisk: 12, events: [] },
    { month: 'Mar', dropoutRisk: 18, events: ['Exam Season Starts', 'Holi'] },
    { month: 'Apr', dropoutRisk: 22, events: ['Peak Exams'] },
    { month: 'May', dropoutRisk: 20, events: ['Summer Break', 'Extreme Heat'] },
    { month: 'Jun', dropoutRisk: 15, events: ['Monsoon Begins'] },
    { month: 'Jul', dropoutRisk: 24, events: ['Heavy Monsoon', 'Transport Issues'] },
    { month: 'Aug', dropoutRisk: 26, events: ['Peak Monsoon', 'Independence Day'] },
    { month: 'Sep', dropoutRisk: 19, events: ['Monsoon End', 'Ganesh Chaturthi'] },
    { month: 'Oct', dropoutRisk: 28, events: ['Festival Season', 'Dussehra', 'Diwali Prep'] },
    { month: 'Nov', dropoutRisk: 32, events: ['Diwali', 'Peak Festivals'] },
    { month: 'Dec', dropoutRisk: 16, events: ['Winter', 'Christmas', 'New Year Prep'] },
  ];

  const maxRisk = Math.max(...monthlyData.map(d => d.dropoutRisk));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Calendar className="h-8 w-8 text-purple-600" />
            Seasonal & Pattern Analysis
          </h1>
          <p className="text-muted-foreground">
            Analyze dropout patterns across seasons, festivals, and events
          </p>
        </div>
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2024">2024</SelectItem>
            <SelectItem value="2023">2023</SelectItem>
            <SelectItem value="2022">2022</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Insights */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Highest Risk Period</CardTitle>
            <PartyPopper className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">November</div>
            <p className="text-xs text-muted-foreground">Festival Season - 32% dropout risk</p>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lowest Risk Period</CardTitle>
            <Sun className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">February</div>
            <p className="text-xs text-muted-foreground">Post-holiday stability - 12% risk</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monsoon Impact</CardTitle>
            <CloudRain className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+45%</div>
            <p className="text-xs text-muted-foreground">Risk increase during monsoon</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Festival Impact</CardTitle>
            <PartyPopper className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+68%</div>
            <p className="text-xs text-muted-foreground">Risk increase during festivals</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="calendar">
        <TabsList>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="patterns">Pattern Analysis</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-4">
          {/* Monthly Risk Calendar */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Dropout Risk Calendar</CardTitle>
              <CardDescription>Risk levels and key events by month</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Bar Chart */}
              <div className="mb-6">
                <svg viewBox="0 0 600 200" className="w-full h-48">
                  {monthlyData.map((data, index) => {
                    const barHeight = (data.dropoutRisk / maxRisk) * 150;
                    const x = index * 50 + 10;
                    const y = 160 - barHeight;
                    const color = data.dropoutRisk >= 25 ? '#ef4444' : 
                                 data.dropoutRisk >= 18 ? '#f59e0b' : '#22c55e';
                    
                    return (
                      <g key={data.month}>
                        <rect
                          x={x}
                          y={y}
                          width="35"
                          height={barHeight}
                          fill={color}
                          rx="2"
                          className="opacity-80 hover:opacity-100 transition-opacity"
                        />
                        <text
                          x={x + 17.5}
                          y="175"
                          textAnchor="middle"
                          className="text-xs fill-current"
                        >
                          {data.month}
                        </text>
                        <text
                          x={x + 17.5}
                          y={y - 5}
                          textAnchor="middle"
                          className="text-xs fill-current"
                        >
                          {data.dropoutRisk}%
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Event Details */}
              <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-4">
                {monthlyData.map((data) => (
                  <div
                    key={data.month}
                    className={`p-3 rounded-lg border ${
                      data.dropoutRisk >= 25 ? 'border-red-200 bg-red-50 dark:bg-red-950/20' :
                      data.dropoutRisk >= 18 ? 'border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20' :
                      'border-green-200 bg-green-50 dark:bg-green-950/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{data.month}</span>
                      <Badge variant={
                        data.dropoutRisk >= 25 ? 'destructive' :
                        data.dropoutRisk >= 18 ? 'secondary' : 'outline'
                      }>
                        {data.dropoutRisk}%
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {data.events.length > 0 ? (
                        data.events.map((event, i) => (
                          <span key={i} className="block">• {event}</span>
                        ))
                      ) : (
                        <span className="italic">No major events</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-4">
          {/* Seasonal Patterns */}
          <div className="grid gap-4 md:grid-cols-2">
            {mockSeasonalPatterns.map((pattern) => (
              <Card key={pattern.season}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {getSeasonIcon(pattern.season)}
                    {pattern.season}
                  </CardTitle>
                  <CardDescription>
                    {pattern.months}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Risk Spike</span>
                    <Badge className={getRiskLevelColor(pattern.riskSpike >= 35 ? 'high' : pattern.riskSpike >= 25 ? 'medium' : 'low')}>
                      {pattern.riskSpike}%
                    </Badge>
                  </div>
                  <Progress value={pattern.riskSpike} className="h-2" />

                  <div>
                    <h4 className="text-sm font-medium mb-2">Primary Factors</h4>
                    <div className="flex flex-wrap gap-1">
                      {pattern.primaryFactors.map((factor, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {factor}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3 text-yellow-500" />
                      Recommended Actions
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {pattern.recommendedActions.map((action, i) => (
                        <li key={i}>• {action}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Seasonal Intervention Strategies</CardTitle>
              <CardDescription>Proactive measures for high-risk periods</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Monsoon Strategy */}
                <div className="p-4 rounded-lg border border-blue-200 bg-blue-50 dark:bg-blue-950/20">
                  <div className="flex items-center gap-2 mb-3">
                    <CloudRain className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold">Monsoon Season Strategy (June-September)</h3>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Transport Support</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Activate transport assistance fund</li>
                        <li>• Partner with local cab services</li>
                        <li>• Deploy mobile health units in flood-prone areas</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-2">Communication</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Increase follow-up call frequency</li>
                        <li>• Enable telemedicine for regular checkups</li>
                        <li>• Send weather-aware appointment reminders</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Festival Strategy */}
                <div className="p-4 rounded-lg border border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20">
                  <div className="flex items-center gap-2 mb-3">
                    <PartyPopper className="h-5 w-5 text-yellow-600" />
                    <h3 className="font-semibold">Festival Season Strategy (October-November)</h3>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Scheduling</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Pre-festival medication dispensing (2-3 weeks)</li>
                        <li>• Flexible appointment slots before/after festivals</li>
                        <li>• Extended clinic hours pre-Diwali</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-2">Engagement</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Festival greeting messages with health tips</li>
                        <li>• Family involvement campaigns</li>
                        <li>• Community awareness drives</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Exam Strategy */}
                <div className="p-4 rounded-lg border border-purple-200 bg-purple-50 dark:bg-purple-950/20">
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen className="h-5 w-5 text-purple-600" />
                    <h3 className="font-semibold">Exam Season Strategy (March-May)</h3>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="text-sm font-medium mb-2">For Student Patients</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Weekend-only treatment options</li>
                        <li>• Study-compatible medication timing</li>
                        <li>• Mental health support prioritization</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-2">For Parent Caregivers</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Home-based care options</li>
                        <li>• Caregiver respite programs</li>
                        <li>• Simplified treatment protocols</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Summer Strategy */}
                <div className="p-4 rounded-lg border border-orange-200 bg-orange-50 dark:bg-orange-950/20">
                  <div className="flex items-center gap-2 mb-3">
                    <ThermometerSun className="h-5 w-5 text-orange-600" />
                    <h3 className="font-semibold">Summer Season Strategy (April-June)</h3>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Heat Management</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Early morning appointment slots</li>
                        <li>• Arrangements for AC transport</li>
                        <li>• Medication storage guidance</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-2">Travel Season</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Travel medication kits</li>
                        <li>• Partner hospital network</li>
                        <li>• Pre-travel health checkups</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Staffing Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Staffing Adjustments by Season</CardTitle>
              <CardDescription>Recommended staff allocation changes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="text-center p-4 rounded-lg border">
                  <CloudRain className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <h4 className="font-medium">Monsoon</h4>
                  <p className="text-2xl font-bold text-blue-600">+15%</p>
                  <p className="text-xs text-muted-foreground">Outreach Workers</p>
                </div>
                <div className="text-center p-4 rounded-lg border">
                  <PartyPopper className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <h4 className="font-medium">Festivals</h4>
                  <p className="text-2xl font-bold text-yellow-600">+25%</p>
                  <p className="text-xs text-muted-foreground">Counselors</p>
                </div>
                <div className="text-center p-4 rounded-lg border">
                  <BookOpen className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                  <h4 className="font-medium">Exams</h4>
                  <p className="text-2xl font-bold text-purple-600">+20%</p>
                  <p className="text-xs text-muted-foreground">Mental Health Staff</p>
                </div>
                <div className="text-center p-4 rounded-lg border">
                  <ThermometerSun className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                  <h4 className="font-medium">Summer</h4>
                  <p className="text-2xl font-bold text-orange-600">+10%</p>
                  <p className="text-xs text-muted-foreground">Transport Support</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
