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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Beaker,
  Play,
  TrendingDown,
  TrendingUp,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import {
  mockPatientRiskProfiles,
  mockPredictiveScenarios,
  PredictiveScenario,
  getRiskBadgeVariant,
} from '@/lib/doctor-data';

export default function PredictiveSimulationPage() {
  const [selectedPatient, setSelectedPatient] = useState<string>('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResults, setSimulationResults] = useState<PredictiveScenario[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<PredictiveScenario | null>(null);

  const highRiskPatients = mockPatientRiskProfiles.filter(p => 
    p.riskCategory === 'high' || p.riskCategory === 'critical'
  );

  const patient = mockPatientRiskProfiles.find(p => p.id === selectedPatient);

  const handleRunSimulation = () => {
    if (!selectedPatient) return;
    
    setIsSimulating(true);
    setSimulationResults([]);
    setSelectedScenario(null);

    setTimeout(() => {
      const scenarios = mockPredictiveScenarios[selectedPatient] || [];
      setSimulationResults(scenarios);
      setIsSimulating(false);
    }, 2000);
  };

  const getBestScenario = () => {
    if (simulationResults.length === 0) return null;
    return simulationResults
      .filter(s => s.intervention !== 'No Intervention')
      .sort((a, b) => b.riskReduction - a.riskReduction)[0];
  };

  const bestScenario = getBestScenario();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Beaker className="h-8 w-8 text-purple-600" />
          Predictive Simulation Tool
        </h1>
        <p className="text-muted-foreground">
          Simulate intervention outcomes before taking action
        </p>
      </div>

      {/* Patient Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Patient for Simulation</CardTitle>
          <CardDescription>
            Choose a high-risk patient to simulate intervention scenarios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Select value={selectedPatient} onValueChange={setSelectedPatient}>
              <SelectTrigger className="w-[400px]">
                <SelectValue placeholder="Select a high-risk patient" />
              </SelectTrigger>
              <SelectContent>
                {highRiskPatients.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    <div className="flex items-center gap-2">
                      <span>{p.name}</span>
                      <Badge variant={getRiskBadgeVariant(p.riskCategory)} className="text-xs">
                        {p.dropoutRiskScore}%
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        ({p.primaryRiskFactor})
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              onClick={handleRunSimulation}
              disabled={!selectedPatient || isSimulating}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isSimulating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Simulating...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Run Simulation
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Patient Info Card */}
      {patient && (
        <Card>
          <CardContent className="p-6">
            <div className="grid gap-6 md:grid-cols-4">
              <div>
                <p className="text-sm text-muted-foreground">Patient Name</p>
                <p className="font-semibold text-lg">{patient.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Risk Score</p>
                <p className={`font-bold text-2xl ${
                  patient.dropoutRiskScore >= 80 ? 'text-red-600' :
                  patient.dropoutRiskScore >= 60 ? 'text-orange-600' : 'text-yellow-600'
                }`}>
                  {patient.dropoutRiskScore}%
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Risk Category</p>
                <Badge variant={getRiskBadgeVariant(patient.riskCategory)} className="mt-1">
                  {patient.riskCategory.toUpperCase()}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Primary Risk Factor</p>
                <p className="font-medium">{patient.primaryRiskFactor}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Simulation Progress */}
      {isSimulating && (
        <Card className="border-purple-300 bg-purple-50/50 dark:bg-purple-900/10">
          <CardContent className="py-12">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="h-16 w-16 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin" />
                <Beaker className="absolute inset-0 m-auto h-6 w-6 text-purple-600" />
              </div>
              <p className="text-lg font-medium text-purple-800 dark:text-purple-200">
                Running Predictive Analysis...
              </p>
              <p className="text-sm text-muted-foreground">
                AI is calculating intervention outcomes based on patient data
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Simulation Results */}
      {simulationResults.length > 0 && (
        <>
          {/* Best Recommendation */}
          {bestScenario && (
            <Card className="border-green-300 bg-green-50/50 dark:bg-green-900/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
                  <CheckCircle2 className="h-5 w-5" />
                  AI Recommended Intervention
                </CardTitle>
                <CardDescription>
                  Optimal intervention based on predicted risk reduction
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold">{bestScenario.intervention}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Time to effect: {bestScenario.timeToEffect}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-green-600">
                      <TrendingDown className="h-5 w-5" />
                      <span className="text-2xl font-bold">-{bestScenario.riskReduction}%</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {bestScenario.currentRisk}% → {bestScenario.projectedRisk}%
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Confidence: {bestScenario.confidence}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* All Scenarios */}
          <Card>
            <CardHeader>
              <CardTitle>All Intervention Scenarios</CardTitle>
              <CardDescription>
                Compare predicted outcomes for different interventions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {simulationResults.map((scenario, index) => (
                  <div 
                    key={index}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedScenario === scenario ? 'ring-2 ring-purple-500' : ''
                    } ${
                      scenario.intervention === 'No Intervention' 
                        ? 'bg-red-50 dark:bg-red-900/10 border-red-300' 
                        : scenario.riskReduction >= 25 
                          ? 'bg-green-50 dark:bg-green-900/10 border-green-300'
                          : 'bg-muted/50 hover:bg-muted'
                    }`}
                    onClick={() => setSelectedScenario(scenario)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <h4 className="font-semibold">{scenario.intervention}</h4>
                        {scenario.intervention === bestScenario?.intervention && (
                          <Badge className="bg-green-600">Recommended</Badge>
                        )}
                        {scenario.intervention === 'No Intervention' && (
                          <Badge variant="destructive">Baseline</Badge>
                        )}
                      </div>
                      <Badge variant={scenario.riskReduction > 0 ? 'secondary' : 'destructive'}>
                        {scenario.riskReduction > 0 ? (
                          <><TrendingDown className="h-3 w-3 mr-1" />-{scenario.riskReduction}%</>
                        ) : (
                          <><TrendingUp className="h-3 w-3 mr-1" />+{Math.abs(scenario.riskReduction)}%</>
                        )}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-4 gap-4 text-sm mb-3">
                      <div>
                        <p className="text-muted-foreground">Current Risk</p>
                        <p className="text-lg font-bold text-orange-600">{scenario.currentRisk}%</p>
                      </div>
                      <div className="flex items-center justify-center">
                        <ArrowRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-muted-foreground">Projected Risk</p>
                        <p className={`text-lg font-bold ${
                          scenario.projectedRisk < scenario.currentRisk ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {scenario.projectedRisk}%
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-muted-foreground">Confidence</p>
                        <p className="text-lg font-bold">{scenario.confidence}%</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground w-20">Current</span>
                        <Progress value={scenario.currentRisk} className="flex-1 h-2 [&>div]:bg-orange-500" />
                        <span className="text-xs w-8">{scenario.currentRisk}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground w-20">Projected</span>
                        <Progress 
                          value={scenario.projectedRisk} 
                          className={`flex-1 h-2 ${
                            scenario.projectedRisk < scenario.currentRisk 
                              ? '[&>div]:bg-green-500' 
                              : '[&>div]:bg-red-500'
                          }`}
                        />
                        <span className="text-xs w-8">{scenario.projectedRisk}%</span>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground mt-2">
                      Time to effect: {scenario.timeToEffect}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Reset Button */}
          <div className="flex justify-center">
            <Button 
              variant="outline" 
              onClick={() => {
                setSimulationResults([]);
                setSelectedScenario(null);
              }}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset Simulation
            </Button>
          </div>
        </>
      )}

      {/* Empty State */}
      {!selectedPatient && !isSimulating && simulationResults.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Beaker className="h-12 w-12 text-purple-300 mb-4" />
            <p className="text-lg font-medium">Select a Patient to Begin</p>
            <p className="text-sm text-muted-foreground">
              Choose a high-risk patient from the dropdown above to simulate intervention outcomes
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
