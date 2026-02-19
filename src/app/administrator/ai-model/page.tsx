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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Brain,
  Activity,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Shield,
  Eye,
  Settings,
  Info,
  XCircle,
  Clock,
} from 'lucide-react';
import { mockAIModelMetrics } from '@/lib/admin-data';

export default function AIModelPage() {
  const [autoRetrain, setAutoRetrain] = useState(true);
  const [humanReviewThreshold, setHumanReviewThreshold] = useState(true);
  const metrics = mockAIModelMetrics;

  const flaggedPredictions = [
    { id: 1, patientId: 'PT-1023', riskScore: 92, confidence: 45, reason: 'Low confidence - unusual pattern', status: 'review' },
    { id: 2, patientId: 'PT-0872', riskScore: 23, confidence: 38, reason: 'Conflicting indicators', status: 'review' },
    { id: 3, patientId: 'PT-1156', riskScore: 78, confidence: 52, reason: 'New patient - insufficient data', status: 'approved' },
    { id: 4, patientId: 'PT-0634', riskScore: 65, confidence: 41, reason: 'Recent treatment change', status: 'review' },
    { id: 5, patientId: 'PT-0991', riskScore: 88, confidence: 48, reason: 'Edge case detection', status: 'rejected' },
  ];

  const featureImportance = [
    { feature: 'Missed Appointments (30d)', importance: 0.24 },
    { feature: 'Travel Distance', importance: 0.18 },
    { feature: 'Financial Aid Status', importance: 0.15 },
    { feature: 'Previous Dropout Attempts', importance: 0.12 },
    { feature: 'Side Effect Severity', importance: 0.10 },
    { feature: 'Caregiver Support Level', importance: 0.08 },
    { feature: 'Mental Health Score', importance: 0.07 },
    { feature: 'Treatment Duration', importance: 0.06 },
  ];

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 70) return 'text-green-600';
    if (confidence >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Brain className="h-8 w-8 text-purple-600" />
            AI Model Monitoring
          </h1>
          <p className="text-muted-foreground">
            Monitor prediction accuracy, calibration, and ethical AI governance
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retrain Model
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
        </div>
      </div>

      {/* Model Health Summary */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Model Status</CardTitle>
            <Activity className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span className="text-xl font-bold text-green-600">Healthy</span>
            </div>
            <p className="text-xs text-muted-foreground">Last updated 2h ago</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accuracy</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.accuracy}%</div>
            <p className="text-xs text-green-600">+1.2% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sensitivity</CardTitle>
            <Info className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.sensitivity}%</div>
            <p className="text-xs text-muted-foreground">True positive rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Specificity</CardTitle>
            <Info className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.specificity}%</div>
            <p className="text-xs text-muted-foreground">True negative rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AUC-ROC</CardTitle>
            <Activity className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.aucRoc}</div>
            <p className="text-xs text-muted-foreground">Discrimination ability</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="flagged">Flagged Predictions</TabsTrigger>
          <TabsTrigger value="explainability">Explainability</TabsTrigger>
          <TabsTrigger value="governance">Governance</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Confusion Matrix */}
            <Card>
              <CardHeader>
                <CardTitle>Confusion Matrix</CardTitle>
                <CardDescription>Model prediction outcomes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-green-100 dark:bg-green-950/30 text-center">
                    <p className="text-3xl font-bold text-green-700">{metrics.truePositives}</p>
                    <p className="text-sm text-green-600">True Positives</p>
                    <p className="text-xs text-muted-foreground">Correctly predicted high risk</p>
                  </div>
                  <div className="p-4 rounded-lg bg-red-100 dark:bg-red-950/30 text-center">
                    <p className="text-3xl font-bold text-red-700">{metrics.falsePositives}</p>
                    <p className="text-sm text-red-600">False Positives</p>
                    <p className="text-xs text-muted-foreground">Incorrectly flagged as high risk</p>
                  </div>
                  <div className="p-4 rounded-lg bg-yellow-100 dark:bg-yellow-950/30 text-center">
                    <p className="text-3xl font-bold text-yellow-700">{metrics.falseNegatives}</p>
                    <p className="text-sm text-yellow-600">False Negatives</p>
                    <p className="text-xs text-muted-foreground">Missed high risk patients</p>
                  </div>
                  <div className="p-4 rounded-lg bg-blue-100 dark:bg-blue-950/30 text-center">
                    <p className="text-3xl font-bold text-blue-700">{metrics.trueNegatives}</p>
                    <p className="text-sm text-blue-600">True Negatives</p>
                    <p className="text-xs text-muted-foreground">Correctly predicted low risk</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
                <CardDescription>Monthly accuracy over time</CardDescription>
              </CardHeader>
              <CardContent>
                <svg viewBox="0 0 400 200" className="w-full h-48">
                  <defs>
                    <linearGradient id="accuracyGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {/* Grid lines */}
                  {[0, 25, 50, 75, 100].map((val, i) => (
                    <g key={val}>
                      <line
                        x1="40"
                        y1={160 - val * 1.4}
                        x2="380"
                        y2={160 - val * 1.4}
                        stroke="currentColor"
                        strokeOpacity="0.1"
                      />
                      <text
                        x="35"
                        y={165 - val * 1.4}
                        textAnchor="end"
                        className="text-xs fill-current opacity-50"
                      >
                        {val}%
                      </text>
                    </g>
                  ))}
                  {/* Data */}
                  {(() => {
                    const data = [
                      { month: 'Jul', accuracy: 82 },
                      { month: 'Aug', accuracy: 83.5 },
                      { month: 'Sep', accuracy: 84 },
                      { month: 'Oct', accuracy: 85.2 },
                      { month: 'Nov', accuracy: 86.1 },
                      { month: 'Dec', accuracy: 87.3 },
                    ];
                    const points = data.map((d, i) => ({
                      x: 60 + i * 60,
                      y: 160 - d.accuracy * 1.4,
                    }));
                    const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
                    const areaD = `${pathD} L ${points[points.length - 1].x} 160 L ${points[0].x} 160 Z`;

                    return (
                      <>
                        <path d={areaD} fill="url(#accuracyGradient)" />
                        <path d={pathD} fill="none" stroke="#8b5cf6" strokeWidth="3" />
                        {points.map((p, i) => (
                          <g key={i}>
                            <circle cx={p.x} cy={p.y} r="4" fill="#8b5cf6" />
                            <text
                              x={p.x}
                              y="180"
                              textAnchor="middle"
                              className="text-xs fill-current"
                            >
                              {data[i].month}
                            </text>
                          </g>
                        ))}
                      </>
                    );
                  })()}
                </svg>
              </CardContent>
            </Card>
          </div>

          {/* Calibration */}
          <Card>
            <CardHeader>
              <CardTitle>Model Calibration</CardTitle>
              <CardDescription>How well predicted probabilities match actual outcomes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-5">
                {[
                  { range: '0-20%', predicted: 15, actual: 12 },
                  { range: '20-40%', predicted: 30, actual: 28 },
                  { range: '40-60%', predicted: 50, actual: 52 },
                  { range: '60-80%', predicted: 70, actual: 68 },
                  { range: '80-100%', predicted: 90, actual: 88 },
                ].map((bucket) => (
                  <div key={bucket.range} className="p-3 rounded-lg border text-center">
                    <p className="text-sm font-medium mb-2">{bucket.range}</p>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Predicted</span>
                        <span className="font-medium">{bucket.predicted}%</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Actual</span>
                        <span className="font-medium">{bucket.actual}%</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Deviation</span>
                        <span className={Math.abs(bucket.predicted - bucket.actual) <= 5 ? 'text-green-600' : 'text-yellow-600'}>
                          {bucket.predicted - bucket.actual > 0 ? '+' : ''}{bucket.predicted - bucket.actual}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-4 text-center">
                Model is well-calibrated with &lt;5% deviation across all probability ranges
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="flagged" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Flagged Predictions</CardTitle>
              <CardDescription>Predictions requiring human review due to low confidence or edge cases</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient ID</TableHead>
                    <TableHead>Risk Score</TableHead>
                    <TableHead>Confidence</TableHead>
                    <TableHead>Reason for Flag</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {flaggedPredictions.map((pred) => (
                    <TableRow key={pred.id}>
                      <TableCell className="font-medium">{pred.patientId}</TableCell>
                      <TableCell>
                        <Badge variant={pred.riskScore >= 70 ? 'destructive' : pred.riskScore >= 40 ? 'secondary' : 'outline'}>
                          {pred.riskScore}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className={`font-medium ${getConfidenceColor(pred.confidence)}`}>
                          {pred.confidence}%
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm">{pred.reason}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          pred.status === 'approved' ? 'default' :
                          pred.status === 'rejected' ? 'destructive' : 'secondary'
                        } className="capitalize">
                          {pred.status === 'review' && <Clock className="h-3 w-3 mr-1" />}
                          {pred.status === 'approved' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                          {pred.status === 'rejected' && <XCircle className="h-3 w-3 mr-1" />}
                          {pred.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {pred.status === 'review' && (
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline" className="text-green-600">
                              <CheckCircle2 className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600">
                              <XCircle className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Flag Summary</CardTitle>
              <CardDescription>Statistics on flagged predictions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="p-4 rounded-lg border text-center">
                  <p className="text-2xl font-bold">{flaggedPredictions.length}</p>
                  <p className="text-sm text-muted-foreground">Total Flagged</p>
                </div>
                <div className="p-4 rounded-lg border text-center">
                  <p className="text-2xl font-bold text-yellow-600">
                    {flaggedPredictions.filter(p => p.status === 'review').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Pending Review</p>
                </div>
                <div className="p-4 rounded-lg border text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {flaggedPredictions.filter(p => p.status === 'approved').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Approved</p>
                </div>
                <div className="p-4 rounded-lg border text-center">
                  <p className="text-2xl font-bold text-red-600">
                    {flaggedPredictions.filter(p => p.status === 'rejected').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Rejected</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="explainability" className="space-y-4">
          {/* Feature Importance */}
          <Card>
            <CardHeader>
              <CardTitle>Feature Importance</CardTitle>
              <CardDescription>Factors driving dropout risk predictions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {featureImportance.map((f) => (
                  <div key={f.feature}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{f.feature}</span>
                      <span className="font-medium">{(f.importance * 100).toFixed(0)}%</span>
                    </div>
                    <Progress value={f.importance * 100} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Model Info */}
          <Card>
            <CardHeader>
              <CardTitle>Model Information</CardTitle>
              <CardDescription>Technical details about the prediction model</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex justify-between p-2 rounded bg-muted">
                    <span className="text-sm text-muted-foreground">Model Type</span>
                    <span className="text-sm font-medium">Gradient Boosting (XGBoost)</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-muted">
                    <span className="text-sm text-muted-foreground">Training Data Size</span>
                    <span className="text-sm font-medium">12,847 patients</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-muted">
                    <span className="text-sm text-muted-foreground">Features Used</span>
                    <span className="text-sm font-medium">42 features</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-muted">
                    <span className="text-sm text-muted-foreground">Last Trained</span>
                    <span className="text-sm font-medium">Dec 15, 2024</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between p-2 rounded bg-muted">
                    <span className="text-sm text-muted-foreground">Prediction Window</span>
                    <span className="text-sm font-medium">30 days</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-muted">
                    <span className="text-sm text-muted-foreground">Update Frequency</span>
                    <span className="text-sm font-medium">Weekly (Auto)</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-muted">
                    <span className="text-sm text-muted-foreground">Validation Method</span>
                    <span className="text-sm font-medium">5-Fold Cross Validation</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-muted">
                    <span className="text-sm text-muted-foreground">Model Version</span>
                    <span className="text-sm font-medium">v2.3.1</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="governance" className="space-y-4">
          {/* AI Ethics & Governance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-purple-600" />
                AI Ethics & Governance
              </CardTitle>
              <CardDescription>Ensure responsible and ethical use of AI predictions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Controls */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <Label htmlFor="auto-retrain" className="font-medium">Automatic Retraining</Label>
                    <p className="text-sm text-muted-foreground">Retrain model when accuracy drops below threshold</p>
                  </div>
                  <Switch id="auto-retrain" checked={autoRetrain} onCheckedChange={setAutoRetrain} />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <Label htmlFor="human-review" className="font-medium">Human Review Threshold</Label>
                    <p className="text-sm text-muted-foreground">Flag predictions with confidence &lt;60% for review</p>
                  </div>
                  <Switch id="human-review" checked={humanReviewThreshold} onCheckedChange={setHumanReviewThreshold} />
                </div>
              </div>

              {/* Fairness Metrics */}
              <div>
                <h4 className="font-medium mb-3">Fairness Metrics</h4>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Gender Parity</span>
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </div>
                    <p className="text-xl font-bold text-green-600">98.2%</p>
                    <p className="text-xs text-muted-foreground">Equal prediction accuracy across genders</p>
                  </div>
                  <div className="p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Age Group Parity</span>
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </div>
                    <p className="text-xl font-bold text-green-600">96.8%</p>
                    <p className="text-xs text-muted-foreground">Consistent across all age groups</p>
                  </div>
                  <div className="p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Geographic Parity</span>
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    </div>
                    <p className="text-xl font-bold text-yellow-600">91.4%</p>
                    <p className="text-xs text-muted-foreground">Slight variance in rural predictions</p>
                  </div>
                </div>
              </div>

              {/* Audit Trail */}
              <div>
                <h4 className="font-medium mb-3">Recent Audit Events</h4>
                <div className="space-y-2">
                  {[
                    { event: 'Model retrained on new data', date: 'Dec 15, 2024', user: 'System' },
                    { event: 'Fairness audit completed', date: 'Dec 10, 2024', user: 'Dr. Gupta' },
                    { event: 'Human review completed for 12 predictions', date: 'Dec 8, 2024', user: 'Dr. Patel' },
                    { event: 'Feature importance recalculated', date: 'Dec 5, 2024', user: 'System' },
                  ].map((audit, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded bg-muted text-sm">
                      <span>{audit.event}</span>
                      <div className="flex items-center gap-4 text-muted-foreground">
                        <span>{audit.user}</span>
                        <span>{audit.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
