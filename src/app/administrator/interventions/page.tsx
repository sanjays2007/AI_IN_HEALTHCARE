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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Target,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingDown,
  Award,
  Brain,
  Percent,
} from 'lucide-react';
import { mockInterventionOutcomes, mockAdminStats, mockAIModelMetrics } from '@/lib/admin-data';

export default function InterventionOutcomesPage() {
  const [outcomes] = useState(mockInterventionOutcomes);
  const [stats] = useState(mockAdminStats);
  const [aiMetrics] = useState(mockAIModelMetrics);

  const totalAttempted = outcomes.reduce((sum, o) => sum + o.totalAttempted, 0);
  const totalSuccessful = outcomes.reduce((sum, o) => sum + o.successful, 0);
  const overallSuccessRate = ((totalSuccessful / totalAttempted) * 100).toFixed(1);
  const avgRiskReduction = (outcomes.reduce((sum, o) => sum + o.avgRiskReduction, 0) / outcomes.length).toFixed(1);

  const predictionAccuracy = ((stats.preventedDropouts / stats.predictedDropouts) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Target className="h-8 w-8 text-purple-600" />
          Intervention Outcome Analytics
        </h1>
        <p className="text-muted-foreground">
          Measure intervention effectiveness and AI prediction accuracy
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Predicted Dropouts</CardTitle>
            <Brain className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.predictedDropouts}</div>
            <p className="text-xs text-muted-foreground">AI flagged patients</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prevented Dropouts</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.preventedDropouts}</div>
            <p className="text-xs text-muted-foreground">Successfully retained</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prevention Rate</CardTitle>
            <Percent className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{predictionAccuracy}%</div>
            <p className="text-xs text-muted-foreground">Success rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Accuracy</CardTitle>
            <Brain className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{aiMetrics.overallAccuracy}%</div>
            <p className="text-xs text-muted-foreground">Prediction accuracy</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Risk Reduction</CardTitle>
            <TrendingDown className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgRiskReduction}%</div>
            <p className="text-xs text-muted-foreground">Per intervention</p>
          </CardContent>
        </Card>
      </div>

      {/* AI Credibility Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              AI Model Performance
            </CardTitle>
            <CardDescription>Key metrics for AI prediction credibility</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <div className="text-3xl font-bold text-purple-600">{aiMetrics.overallAccuracy}%</div>
                  <p className="text-sm text-muted-foreground">Overall Accuracy</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <div className="text-3xl font-bold text-green-600">{aiMetrics.sensitivity}%</div>
                  <p className="text-sm text-muted-foreground">Sensitivity (True Positive)</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Specificity</span>
                  <span className="font-medium">{aiMetrics.specificity}%</span>
                </div>
                <Progress value={aiMetrics.specificity} className="h-2" />
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">False Positive Rate</span>
                  <span className="font-medium text-orange-600">{aiMetrics.falsePositiveRate}%</span>
                </div>
                <Progress value={aiMetrics.falsePositiveRate} className="h-2" />
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">False Negative Rate</span>
                  <span className="font-medium text-red-600">{aiMetrics.falseNegativeRate}%</span>
                </div>
                <Progress value={aiMetrics.falseNegativeRate} className="h-2" />
              </div>
              
              <div className="pt-4 border-t text-sm text-muted-foreground">
                <p>Model Version: {aiMetrics.modelVersion}</p>
                <p>Last Calibration: {new Date(aiMetrics.lastCalibration).toLocaleDateString()}</p>
                <p>Total Predictions: {aiMetrics.totalPredictions.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dropout Prevention Funnel */}
        <Card>
          <CardHeader>
            <CardTitle>Dropout Prevention Funnel</CardTitle>
            <CardDescription>From prediction to prevention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative">
                <div className="flex items-center justify-between p-4 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                  <span className="font-medium">Predicted At-Risk</span>
                  <span className="text-2xl font-bold">{stats.predictedDropouts}</span>
                </div>
              </div>
              
              <div className="flex justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground">
                  <path d="M12 5v14M5 12l7 7 7-7"/>
                </svg>
              </div>
              
              <div className="relative">
                <div className="flex items-center justify-between p-4 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <span className="font-medium">Interventions Initiated</span>
                  <span className="text-2xl font-bold">{totalAttempted}</span>
                </div>
              </div>
              
              <div className="flex justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground">
                  <path d="M12 5v14M5 12l7 7 7-7"/>
                </svg>
              </div>
              
              <div className="relative">
                <div className="flex items-center justify-between p-4 rounded-lg bg-green-100 dark:bg-green-900/30">
                  <span className="font-medium">Successfully Prevented</span>
                  <span className="text-2xl font-bold text-green-600">{stats.preventedDropouts}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="text-center">
                  <div className="text-xl font-bold text-green-600">{predictionAccuracy}%</div>
                  <p className="text-xs text-muted-foreground">Prevention Rate</p>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-red-600">{stats.predictedDropouts - stats.preventedDropouts}</div>
                  <p className="text-xs text-muted-foreground">Actual Dropouts</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Intervention Type Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Intervention Type Effectiveness</CardTitle>
          <CardDescription>Compare success rates by intervention type</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Intervention Type</TableHead>
                <TableHead className="text-center">Total Attempted</TableHead>
                <TableHead className="text-center">Successful</TableHead>
                <TableHead className="text-center">Success Rate</TableHead>
                <TableHead className="text-center">Avg Risk Reduction</TableHead>
                <TableHead className="text-center">Response Time</TableHead>
                <TableHead>Effectiveness</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...outcomes].sort((a, b) => b.successRate - a.successRate).map((outcome) => (
                <TableRow key={outcome.type}>
                  <TableCell className="font-medium">{outcome.type}</TableCell>
                  <TableCell className="text-center">{outcome.totalAttempted}</TableCell>
                  <TableCell className="text-center text-green-600">{outcome.successful}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Progress value={outcome.successRate} className="w-16 h-2" />
                      <span className={outcome.successRate >= 80 ? 'text-green-600 font-medium' : ''}>
                        {outcome.successRate}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={outcome.avgRiskReduction >= 20 ? 'default' : 'secondary'}>
                      -{outcome.avgRiskReduction}%
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">{outcome.avgResponseTime} hrs</TableCell>
                  <TableCell>
                    {outcome.successRate >= 85 ? (
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                        <Award className="h-3 w-3 mr-1" />
                        Highly Effective
                      </Badge>
                    ) : outcome.successRate >= 70 ? (
                      <Badge variant="secondary">Effective</Badge>
                    ) : (
                      <Badge variant="outline">Moderate</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Visual Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Intervention Success Comparison</CardTitle>
          <CardDescription>Visual breakdown of intervention effectiveness</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[280px]">
            <svg viewBox="0 0 700 250" className="w-full h-full">
              {outcomes.map((outcome, i) => {
                const x = 50 + i * 110;
                const successHeight = outcome.successRate * 2;
                const failHeight = (100 - outcome.successRate) * 2;
                
                return (
                  <g key={outcome.type}>
                    {/* Success portion (green) */}
                    <rect
                      x={x}
                      y={220 - successHeight}
                      width={80}
                      height={successHeight}
                      fill="#22c55e"
                      rx="4"
                    />
                    {/* Fail portion (red) - stacked on top */}
                    <rect
                      x={x}
                      y={220 - successHeight - failHeight}
                      width={80}
                      height={failHeight}
                      fill="#ef4444"
                      fillOpacity="0.3"
                      rx="4"
                    />
                    {/* Success rate label */}
                    <text
                      x={x + 40}
                      y={215 - successHeight / 2}
                      textAnchor="middle"
                      className="text-xs font-medium fill-white"
                    >
                      {outcome.successRate}%
                    </text>
                    {/* Type label */}
                    <text
                      x={x + 40}
                      y="240"
                      textAnchor="middle"
                      className="text-xs fill-muted-foreground"
                    >
                      {outcome.type.split(' ')[0]}
                    </text>
                  </g>
                );
              })}
              
              {/* Legend */}
              <rect x="550" y="10" width="12" height="12" fill="#22c55e" rx="2" />
              <text x="568" y="20" className="text-xs fill-current">Success</text>
              <rect x="620" y="10" width="12" height="12" fill="#ef4444" fillOpacity="0.3" rx="2" />
              <text x="638" y="20" className="text-xs fill-current">Failed</text>
            </svg>
          </div>
        </CardContent>
      </Card>

      {/* Key Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Key Insights</CardTitle>
          <CardDescription>Important findings from intervention analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 rounded-lg border bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2 mb-2">
                <Award className="h-5 w-5 text-green-600" />
                <h4 className="font-semibold text-green-700 dark:text-green-400">Most Effective</h4>
              </div>
              <p className="text-sm font-medium">{outcomes.sort((a, b) => b.successRate - a.successRate)[0].type}</p>
              <p className="text-sm text-muted-foreground">
                {outcomes.sort((a, b) => b.successRate - a.successRate)[0].successRate}% success rate
              </p>
            </div>
            <div className="p-4 rounded-lg border bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="h-5 w-5 text-blue-600" />
                <h4 className="font-semibold text-blue-700 dark:text-blue-400">Best Risk Reduction</h4>
              </div>
              <p className="text-sm font-medium">{outcomes.sort((a, b) => b.avgRiskReduction - a.avgRiskReduction)[0].type}</p>
              <p className="text-sm text-muted-foreground">
                -{outcomes.sort((a, b) => b.avgRiskReduction - a.avgRiskReduction)[0].avgRiskReduction}% avg reduction
              </p>
            </div>
            <div className="p-4 rounded-lg border bg-orange-50 dark:bg-orange-900/10 border-orange-200 dark:border-orange-800">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-orange-600" />
                <h4 className="font-semibold text-orange-700 dark:text-orange-400">Fastest Response</h4>
              </div>
              <p className="text-sm font-medium">{outcomes.sort((a, b) => a.avgResponseTime - b.avgResponseTime)[0].type}</p>
              <p className="text-sm text-muted-foreground">
                {outcomes.sort((a, b) => a.avgResponseTime - b.avgResponseTime)[0].avgResponseTime} hrs avg
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
