'use client';

import { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
import { Textarea } from '@/components/ui/textarea';
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  Calendar,
  AlertTriangle,
  Activity,
  Brain,
  CheckCircle2,
  XCircle,
  Edit,
  MessageSquare,
  Video,
  Bell,
  FileText,
  TrendingDown,
  TrendingUp,
  Clock,
  DollarSign,
  Pill,
  Heart,
  Car,
  UserCheck,
  ChevronRight,
  Play,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';
import {
  mockPatientRiskProfiles,
  mockBehavioralEvents,
  mockAIRecommendations,
  mockInterventions,
  mockPredictiveScenarios,
  PatientRiskProfile,
  AIRecommendation,
  BehavioralEvent,
  Intervention,
  PredictiveScenario,
  getRiskBadgeVariant,
  formatDate,
  formatDateTime,
} from '@/lib/doctor-data';

export default function PatientRiskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const patientId = params.id as string;

  // Find patient data
  const patient = mockPatientRiskProfiles.find(p => p.id === patientId);
  const behavioralEvents = mockBehavioralEvents.filter(e => e.patientId === patientId);
  const recommendations = mockAIRecommendations.filter(r => r.patientId === patientId);
  const interventions = mockInterventions.filter(i => i.patientId === patientId);
  const scenarios = mockPredictiveScenarios[patientId] || [];

  // State
  const [actionRecommendations, setActionRecommendations] = useState<Record<string, 'accepted' | 'modified' | 'ignored'>>({}); 
  const [ignoreReason, setIgnoreReason] = useState('');
  const [showInterventionDialog, setShowInterventionDialog] = useState(false);
  const [newIntervention, setNewIntervention] = useState({
    type: '',
    notes: '',
  });
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResults, setSimulationResults] = useState<PredictiveScenario[]>([]);

  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <AlertTriangle className="h-12 w-12 text-muted-foreground" />
        <p className="text-lg text-muted-foreground">Patient not found</p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  const handleAcceptRecommendation = (recId: string) => {
    setActionRecommendations(prev => ({ ...prev, [recId]: 'accepted' }));
  };

  const handleIgnoreRecommendation = (recId: string) => {
    setActionRecommendations(prev => ({ ...prev, [recId]: 'ignored' }));
  };

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setSimulationResults(scenarios);
      setIsSimulating(false);
    }, 1500);
  };

  const getRiskBreakdownIcon = (factor: string) => {
    switch (factor) {
      case 'financial': return <DollarSign className="h-4 w-4" />;
      case 'sideEffect': return <Pill className="h-4 w-4" />;
      case 'emotional': return <Heart className="h-4 w-4" />;
      case 'travel': return <Car className="h-4 w-4" />;
      case 'engagement': return <UserCheck className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getEventIcon = (type: BehavioralEvent['type']) => {
    switch (type) {
      case 'appointment_gap': return <Calendar className="h-4 w-4 text-orange-500" />;
      case 'payment_delay': return <DollarSign className="h-4 w-4 text-red-500" />;
      case 'side_effect': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'mood_decline': return <Heart className="h-4 w-4 text-purple-500" />;
      case 'missed_dose': return <Pill className="h-4 w-4 text-orange-500" />;
      case 'appointment_kept': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'payment_made': return <DollarSign className="h-4 w-4 text-green-500" />;
      case 'positive_feedback': return <Heart className="h-4 w-4 text-green-500" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{patient.name}</h1>
            <Badge variant={getRiskBadgeVariant(patient.riskCategory)} className="text-sm">
              {patient.riskCategory.toUpperCase()} RISK
            </Badge>
          </div>
          <p className="text-muted-foreground">
            {patient.patientId} • {patient.diagnosis}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <MessageSquare className="h-4 w-4 mr-2" />
            Message
          </Button>
          <Button variant="outline" size="sm">
            <Video className="h-4 w-4 mr-2" />
            Video Call
          </Button>
          <Button size="sm" onClick={() => setShowInterventionDialog(true)}>
            <FileText className="h-4 w-4 mr-2" />
            Log Intervention
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Clinical Overview</TabsTrigger>
          <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
          <TabsTrigger value="timeline">Behavioral Timeline</TabsTrigger>
          <TabsTrigger value="recommendations">AI Recommendations</TabsTrigger>
          <TabsTrigger value="simulation">Predictive Simulation</TabsTrigger>
        </TabsList>

        {/* Clinical Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Patient Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Patient Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                    <User className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">{patient.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {patient.age} years • {patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1)}
                    </p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{patient.contactPhone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{patient.contactEmail}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Enrolled: {formatDate(patient.enrollmentDate)}</span>
                  </div>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Insurance Status</span>
                    <Badge variant={patient.insuranceStatus === 'active' ? 'secondary' : 'destructive'}>
                      {patient.insuranceStatus}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Financial Aid</span>
                    <Badge variant={patient.financialAidStatus === 'approved' ? 'secondary' : 'outline'}>
                      {patient.financialAidStatus}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Clinical Details */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Clinical Overview</CardTitle>
                <CardDescription>Treatment details and progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Diagnosis</p>
                      <p className="font-medium">{patient.diagnosis}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Treatment Phase</p>
                      <p className="font-medium">{patient.treatmentPhase}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Medication Plan</p>
                      <p className="font-medium">{patient.medicationPlan}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Lab Progress</p>
                      <p className="font-medium">{patient.labProgress}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Assigned Doctor</p>
                      <p className="font-medium">{patient.assignedDoctor}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Department</p>
                      <p className="font-medium">{patient.department}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Treatment Completion</span>
                    <span className="font-medium">{patient.treatmentCompletionPercent}%</span>
                  </div>
                  <Progress value={patient.treatmentCompletionPercent} className="h-3" />
                </div>

                <div className="mt-4 grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{formatDate(patient.lastVisitDate)}</p>
                    <p className="text-xs text-muted-foreground">Last Visit</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{formatDate(patient.nextAppointment)}</p>
                    <p className="text-xs text-muted-foreground">Next Appointment</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-600">{patient.missedAppointmentCount}</p>
                    <p className="text-xs text-muted-foreground">Missed Appointments</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Adherence Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Treatment Adherence Monitoring</CardTitle>
              <CardDescription>Real-time compliance tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Medication Adherence</span>
                    <span className={`text-sm font-bold ${
                      patient.medicationAdherence >= 80 ? 'text-green-600' :
                      patient.medicationAdherence >= 60 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {patient.medicationAdherence}%
                    </span>
                  </div>
                  <Progress 
                    value={patient.medicationAdherence} 
                    className={`h-3 ${
                      patient.medicationAdherence >= 80 ? '[&>div]:bg-green-500' :
                      patient.medicationAdherence >= 60 ? '[&>div]:bg-yellow-500' : '[&>div]:bg-red-500'
                    }`}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Appointment Adherence</span>
                    <span className={`text-sm font-bold ${
                      patient.appointmentAdherence >= 80 ? 'text-green-600' :
                      patient.appointmentAdherence >= 60 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {patient.appointmentAdherence}%
                    </span>
                  </div>
                  <Progress 
                    value={patient.appointmentAdherence}
                    className={`h-3 ${
                      patient.appointmentAdherence >= 80 ? '[&>div]:bg-green-500' :
                      patient.appointmentAdherence >= 60 ? '[&>div]:bg-yellow-500' : '[&>div]:bg-red-500'
                    }`}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Communication Response</span>
                    <span className={`text-sm font-bold ${
                      patient.communicationResponseRate >= 80 ? 'text-green-600' :
                      patient.communicationResponseRate >= 60 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {patient.communicationResponseRate}%
                    </span>
                  </div>
                  <Progress 
                    value={patient.communicationResponseRate}
                    className={`h-3 ${
                      patient.communicationResponseRate >= 80 ? '[&>div]:bg-green-500' :
                      patient.communicationResponseRate >= 60 ? '[&>div]:bg-yellow-500' : '[&>div]:bg-red-500'
                    }`}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Dropout Risk Score</span>
                    <span className={`text-sm font-bold ${
                      patient.dropoutRiskScore <= 40 ? 'text-green-600' :
                      patient.dropoutRiskScore <= 60 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {patient.dropoutRiskScore}%
                    </span>
                  </div>
                  <Progress 
                    value={patient.dropoutRiskScore}
                    className={`h-3 ${
                      patient.dropoutRiskScore <= 40 ? '[&>div]:bg-green-500' :
                      patient.dropoutRiskScore <= 60 ? '[&>div]:bg-yellow-500' : '[&>div]:bg-red-500'
                    }`}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Risk Analysis Tab */}
        <TabsContent value="risk" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Overall Risk Score */}
            <Card>
              <CardHeader>
                <CardTitle>Dropout Risk Analysis</CardTitle>
                <CardDescription>AI-calculated risk assessment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center py-8">
                  <div className="relative">
                    <svg className="h-48 w-48 -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="12"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke={
                          patient.dropoutRiskScore >= 80 ? '#ef4444' :
                          patient.dropoutRiskScore >= 60 ? '#f97316' :
                          patient.dropoutRiskScore >= 40 ? '#eab308' : '#22c55e'
                        }
                        strokeWidth="12"
                        strokeDasharray={`${(patient.dropoutRiskScore / 100) * 251.2} 251.2`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className={`text-4xl font-bold ${
                        patient.dropoutRiskScore >= 80 ? 'text-red-600' :
                        patient.dropoutRiskScore >= 60 ? 'text-orange-600' :
                        patient.dropoutRiskScore >= 40 ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {patient.dropoutRiskScore}%
                      </span>
                      <Badge variant={getRiskBadgeVariant(patient.riskCategory)} className="mt-2">
                        {patient.riskCategory.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Primary Risk Factor</p>
                  <p className="text-lg font-semibold">{patient.primaryRiskFactor}</p>
                </div>
              </CardContent>
            </Card>

            {/* Risk Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Risk Factor Breakdown</CardTitle>
                <CardDescription>Contributing factors to dropout risk</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(patient.riskBreakdown).map(([factor, percentage]) => {
                    const labels: Record<string, string> = {
                      financial: 'Financial Risk',
                      sideEffect: 'Side Effect Risk',
                      emotional: 'Emotional Risk',
                      travel: 'Travel Risk',
                      engagement: 'Engagement Risk',
                    };
                    return (
                      <div key={factor} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getRiskBreakdownIcon(factor)}
                            <span className="text-sm font-medium">{labels[factor]}</span>
                          </div>
                          <span className="text-sm font-bold">{percentage}%</span>
                        </div>
                        <Progress 
                          value={percentage} 
                          className={`h-2 ${
                            percentage >= 40 ? '[&>div]:bg-red-500' :
                            percentage >= 25 ? '[&>div]:bg-orange-500' :
                            percentage >= 15 ? '[&>div]:bg-yellow-500' : '[&>div]:bg-green-500'
                          }`}
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Radar chart simulation */}
                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium mb-3">Risk Profile Visualization</p>
                  <div className="flex justify-center">
                    <svg viewBox="0 0 200 200" className="h-48 w-48">
                      {/* Background pentagon */}
                      <polygon
                        points="100,20 180,70 155,160 45,160 20,70"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="1"
                      />
                      <polygon
                        points="100,50 145,80 130,140 70,140 55,80"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="1"
                      />
                      <polygon
                        points="100,80 115,95 108,120 92,120 85,95"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="1"
                      />
                      {/* Data polygon */}
                      <polygon
                        points={`
                          100,${20 + (80 - patient.riskBreakdown.financial * 0.8)}
                          ${180 - (80 - patient.riskBreakdown.sideEffect * 0.8)},${70 + (80 - patient.riskBreakdown.sideEffect * 0.5)}
                          ${155 - (80 - patient.riskBreakdown.emotional * 0.5)},${160 - (80 - patient.riskBreakdown.emotional * 0.8)}
                          ${45 + (80 - patient.riskBreakdown.travel * 0.5)},${160 - (80 - patient.riskBreakdown.travel * 0.8)}
                          ${20 + (80 - patient.riskBreakdown.engagement * 0.8)},${70 + (80 - patient.riskBreakdown.engagement * 0.5)}
                        `}
                        fill="rgba(239, 68, 68, 0.2)"
                        stroke="#ef4444"
                        strokeWidth="2"
                      />
                      {/* Labels */}
                      <text x="100" y="12" textAnchor="middle" className="text-xs fill-current">Financial</text>
                      <text x="190" y="75" textAnchor="start" className="text-xs fill-current">Side Effect</text>
                      <text x="165" y="175" textAnchor="middle" className="text-xs fill-current">Emotional</text>
                      <text x="35" y="175" textAnchor="middle" className="text-xs fill-current">Travel</text>
                      <text x="10" y="75" textAnchor="end" className="text-xs fill-current">Engagement</text>
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Behavioral Timeline Tab */}
        <TabsContent value="timeline" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Behavioral Timeline</CardTitle>
              <CardDescription>Patient engagement patterns over time</CardDescription>
            </CardHeader>
            <CardContent>
              {behavioralEvents.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No behavioral events recorded</p>
                </div>
              ) : (
                <div className="relative">
                  <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />
                  <div className="space-y-4">
                    {behavioralEvents.map((event) => (
                      <div key={event.id} className="relative flex gap-4 pl-12">
                        <div className={`absolute left-4 p-1.5 rounded-full bg-background border-2 ${
                          event.severity === 'high' ? 'border-red-500' :
                          event.severity === 'medium' ? 'border-orange-500' : 'border-green-500'
                        }`}>
                          {getEventIcon(event.type)}
                        </div>
                        <div className={`flex-1 p-4 rounded-lg border ${
                          event.severity === 'high' ? 'bg-red-50/50 dark:bg-red-900/10 border-red-200' :
                          event.severity === 'medium' ? 'bg-orange-50/50 dark:bg-orange-900/10 border-orange-200' :
                          'bg-green-50/50 dark:bg-green-900/10 border-green-200'
                        }`}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium">{event.description}</span>
                            <Badge variant={
                              event.severity === 'high' ? 'destructive' :
                              event.severity === 'medium' ? 'default' : 'secondary'
                            }>
                              {event.severity}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{formatDate(event.date)}</span>
                            <span className="capitalize">• {event.type.replace(/_/g, ' ')}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Recommendations Tab */}
        <TabsContent value="recommendations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-blue-600" />
                AI-Generated Recommendations
              </CardTitle>
              <CardDescription>
                Smart suggestions based on patient risk profile and behavioral patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recommendations.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <p>No pending recommendations</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recommendations.map((rec) => (
                    <div 
                      key={rec.id}
                      className={`p-4 rounded-lg border ${
                        actionRecommendations[rec.id] === 'accepted' ? 'bg-green-50 dark:bg-green-900/10 border-green-300' :
                        actionRecommendations[rec.id] === 'ignored' ? 'bg-gray-50 dark:bg-gray-900/10 border-gray-300 opacity-60' :
                        rec.priority === 'critical' ? 'bg-red-50 dark:bg-red-900/10 border-red-300' :
                        rec.priority === 'high' ? 'bg-orange-50 dark:bg-orange-900/10 border-orange-300' :
                        'bg-muted/50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">{rec.title}</h4>
                            <Badge variant={rec.priority === 'critical' ? 'destructive' : 'outline'}>
                              {rec.priority}
                            </Badge>
                            {actionRecommendations[rec.id] && (
                              <Badge variant={actionRecommendations[rec.id] === 'accepted' ? 'secondary' : 'outline'}>
                                {actionRecommendations[rec.id]}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{rec.description}</p>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-green-600 font-medium">
                              <TrendingDown className="h-4 w-4 inline mr-1" />
                              Risk reduction: {rec.riskReduction}%
                            </span>
                            <span className="text-muted-foreground">{rec.expectedImpact}</span>
                          </div>
                        </div>
                        {!actionRecommendations[rec.id] && (
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              onClick={() => handleAcceptRecommendation(rec.id)}
                            >
                              <CheckCircle2 className="h-4 w-4 mr-1" />
                              Accept
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleIgnoreRecommendation(rec.id)}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Ignore
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Previous Interventions */}
          <Card>
            <CardHeader>
              <CardTitle>Intervention History</CardTitle>
              <CardDescription>Previously logged interventions for this patient</CardDescription>
            </CardHeader>
            <CardContent>
              {interventions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No interventions logged yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {interventions.map((intervention) => (
                    <div key={intervention.id} className="p-3 rounded-lg border bg-muted/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{intervention.title}</span>
                        <Badge variant={
                          intervention.status === 'completed' ? 'secondary' :
                          intervention.status === 'in_progress' ? 'default' : 'outline'
                        }>
                          {intervention.status.replace(/_/g, ' ')}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{intervention.notes}</p>
                      {intervention.outcome && (
                        <p className="text-sm text-green-600 mt-1">Outcome: {intervention.outcome}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-2">
                        {formatDateTime(intervention.createdAt)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Predictive Simulation Tab */}
        <TabsContent value="simulation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-purple-600" />
                Predictive Intervention Simulation
              </CardTitle>
              <CardDescription>
                Simulate the impact of different interventions on dropout risk
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4 mb-6">
                <Button 
                  size="lg" 
                  onClick={handleRunSimulation}
                  disabled={isSimulating}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {isSimulating ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Running Simulation...
                    </>
                  ) : (
                    <>
                      <Play className="h-5 w-5 mr-2" />
                      Run Predictive Simulation
                    </>
                  )}
                </Button>
                <p className="text-sm text-muted-foreground mt-2">
                  AI will calculate projected risk under different intervention scenarios
                </p>
              </div>

              {simulationResults.length > 0 && (
                <div className="space-y-4">
                  {simulationResults.map((scenario, index) => (
                    <div 
                      key={index}
                      className={`p-4 rounded-lg border ${
                        scenario.intervention === 'No Intervention' 
                          ? 'bg-red-50 dark:bg-red-900/10 border-red-300' 
                          : scenario.riskReduction >= 25 
                            ? 'bg-green-50 dark:bg-green-900/10 border-green-300'
                            : 'bg-muted/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold">{scenario.intervention}</h4>
                        <Badge variant={
                          scenario.riskReduction > 0 ? 'secondary' : 'destructive'
                        }>
                          {scenario.riskReduction > 0 ? (
                            <><TrendingDown className="h-3 w-3 mr-1" />-{scenario.riskReduction}%</>
                          ) : (
                            <><TrendingUp className="h-3 w-3 mr-1" />+{Math.abs(scenario.riskReduction)}%</>
                          )}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Current Risk</p>
                          <p className="text-lg font-bold text-orange-600">{scenario.currentRisk}%</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Projected Risk</p>
                          <p className={`text-lg font-bold ${
                            scenario.projectedRisk < scenario.currentRisk ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {scenario.projectedRisk}%
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Confidence</p>
                          <p className="text-lg font-bold">{scenario.confidence}%</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Time to Effect</p>
                          <p className="text-lg font-bold">{scenario.timeToEffect}</p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-muted-foreground w-16">Before</span>
                          <Progress value={scenario.currentRisk} className="flex-1 h-2 [&>div]:bg-orange-500" />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground w-16">After</span>
                          <Progress 
                            value={scenario.projectedRisk} 
                            className={`flex-1 h-2 ${
                              scenario.projectedRisk < scenario.currentRisk 
                                ? '[&>div]:bg-green-500' 
                                : '[&>div]:bg-red-500'
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Intervention Dialog */}
      <Dialog open={showInterventionDialog} onOpenChange={setShowInterventionDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Log New Intervention</DialogTitle>
            <DialogDescription>
              Record a clinical intervention for {patient.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Intervention Type</label>
              <Select 
                value={newIntervention.type}
                onValueChange={(value) => setNewIntervention(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dosage_adjustment">Dosage Adjustment</SelectItem>
                  <SelectItem value="tele_consult">Telehealth Consultation</SelectItem>
                  <SelectItem value="financial_referral">Financial Counselor Referral</SelectItem>
                  <SelectItem value="nurse_followup">Nurse Follow-up</SelectItem>
                  <SelectItem value="education_intervention">Educational Intervention</SelectItem>
                  <SelectItem value="mental_health_support">Mental Health Support</SelectItem>
                  <SelectItem value="urgent_appointment">Urgent Appointment</SelectItem>
                  <SelectItem value="treatment_change">Treatment Plan Change</SelectItem>
                  <SelectItem value="multidisciplinary_review">Multidisciplinary Review</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Clinical Notes</label>
              <Textarea
                placeholder="Enter details about the intervention..."
                value={newIntervention.notes}
                onChange={(e) => setNewIntervention(prev => ({ ...prev, notes: e.target.value }))}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInterventionDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              // Save intervention logic here
              setShowInterventionDialog(false);
              setNewIntervention({ type: '', notes: '' });
            }}>
              Save Intervention
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
