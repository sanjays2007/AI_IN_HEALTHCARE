'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { 
  AlertTriangle, 
  Plus, 
  Phone,
  Video,
  Clock,
  Calendar,
  Thermometer,
  Activity
} from 'lucide-react';
import { mockSideEffects, mockMedications, symptomOptions, SideEffectReport } from '@/lib/patient-data';

export default function SideEffectsPage() {
  const [sideEffects, setSideEffects] = useState<SideEffectReport[]>(mockSideEffects);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newReport, setNewReport] = useState({
    symptom: '',
    severity: 3,
    duration: '',
    medicationRelated: '',
    notes: '',
  });
  const { toast } = useToast();

  const handleSubmitReport = () => {
    if (!newReport.symptom || !newReport.duration) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in all required fields.",
      });
      return;
    }

    const severity = newReport.severity as 1 | 2 | 3 | 4 | 5;
    const shouldNotifyDoctor = severity >= 4;
    
    const report: SideEffectReport = {
      id: `SE${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      symptom: newReport.symptom,
      severity: severity,
      duration: newReport.duration,
      medicationRelated: newReport.medicationRelated,
      notes: newReport.notes,
      doctorNotified: shouldNotifyDoctor,
      teleConsultRequested: false,
    };

    setSideEffects(prev => [report, ...prev]);
    setDialogOpen(false);
    setNewReport({ symptom: '', severity: 3, duration: '', medicationRelated: '', notes: '' });

    if (shouldNotifyDoctor) {
      toast({
        title: "Doctor Notified",
        description: "Due to the severity, your doctor has been automatically notified.",
      });
    } else {
      toast({
        title: "Report Submitted",
        description: "Your side effect report has been recorded.",
      });
    }
  };

  const handleRequestTeleConsult = (id: string) => {
    setSideEffects(prev => prev.map(se => 
      se.id === id ? { ...se, teleConsultRequested: true } : se
    ));
    toast({
      title: "Tele-Consult Requested",
      description: "A healthcare provider will contact you soon.",
    });
  };

  const getSeverityColor = (severity: number) => {
    if (severity <= 2) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
    if (severity <= 3) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
    if (severity <= 4) return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100';
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
  };

  const getSeverityLabel = (severity: number) => {
    if (severity === 1) return 'Very Mild';
    if (severity === 2) return 'Mild';
    if (severity === 3) return 'Moderate';
    if (severity === 4) return 'Severe';
    return 'Very Severe';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Side Effect Reporting</h1>
          <p className="text-muted-foreground">Track and report any symptoms you experience</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Report Side Effect
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Report a Side Effect</DialogTitle>
              <DialogDescription>
                Help us track how you&apos;re feeling. This information helps your healthcare team provide better care.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Symptom *</Label>
                <Select 
                  value={newReport.symptom} 
                  onValueChange={(value) => setNewReport(prev => ({ ...prev, symptom: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a symptom" />
                  </SelectTrigger>
                  <SelectContent>
                    {symptomOptions.map((symptom) => (
                      <SelectItem key={symptom} value={symptom}>{symptom}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Severity (1-5) *</Label>
                <div className="pt-2">
                  <Slider
                    value={[newReport.severity]}
                    onValueChange={(value) => setNewReport(prev => ({ ...prev, severity: value[0] }))}
                    min={1}
                    max={5}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between mt-2">
                    <span className="text-xs text-muted-foreground">Mild</span>
                    <Badge className={getSeverityColor(newReport.severity)}>
                      {newReport.severity} - {getSeverityLabel(newReport.severity)}
                    </Badge>
                    <span className="text-xs text-muted-foreground">Severe</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Duration *</Label>
                <Select 
                  value={newReport.duration} 
                  onValueChange={(value) => setNewReport(prev => ({ ...prev, duration: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="How long have you experienced this?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Less than 1 hour">Less than 1 hour</SelectItem>
                    <SelectItem value="1-3 hours">1-3 hours</SelectItem>
                    <SelectItem value="3-6 hours">3-6 hours</SelectItem>
                    <SelectItem value="6-12 hours">6-12 hours</SelectItem>
                    <SelectItem value="12-24 hours">12-24 hours</SelectItem>
                    <SelectItem value="1-3 days">1-3 days</SelectItem>
                    <SelectItem value="More than 3 days">More than 3 days</SelectItem>
                    <SelectItem value="Ongoing">Ongoing</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Related Medication (optional)</Label>
                <Select 
                  value={newReport.medicationRelated} 
                  onValueChange={(value) => setNewReport(prev => ({ ...prev, medicationRelated: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select if related to a medication" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Unknown">Not sure</SelectItem>
                    <SelectItem value="Multiple">Multiple medications</SelectItem>
                    {mockMedications.map((med) => (
                      <SelectItem key={med.id} value={med.name}>{med.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Additional Notes (optional)</Label>
                <Textarea 
                  placeholder="Describe your experience..."
                  value={newReport.notes}
                  onChange={(e) => setNewReport(prev => ({ ...prev, notes: e.target.value }))}
                />
              </div>

              {newReport.severity >= 4 && (
                <div className="rounded-lg bg-orange-100 p-3 dark:bg-orange-900">
                  <p className="text-sm font-medium text-orange-800 dark:text-orange-100">
                    <AlertTriangle className="inline mr-2 h-4 w-4" />
                    Due to the severity, your doctor will be automatically notified.
                  </p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmitReport}>Submit Report</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sideEffects.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sideEffects.filter(se => {
                const date = new Date(se.date);
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return date >= weekAgo;
              }).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Doctor Notified</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {sideEffects.filter(se => se.doctorNotified).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Severity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sideEffects.length > 0 
                ? (sideEffects.reduce((acc, se) => acc + se.severity, 0) / sideEffects.length).toFixed(1)
                : 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reports List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Reports</CardTitle>
          <CardDescription>History of reported side effects</CardDescription>
        </CardHeader>
        <CardContent>
          {sideEffects.length > 0 ? (
            <div className="space-y-4">
              {sideEffects.map((report) => (
                <div key={report.id} className="rounded-lg border p-4">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`rounded-full p-2 ${getSeverityColor(report.severity)}`}>
                        <Thermometer className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{report.symptom}</h3>
                          <Badge className={getSeverityColor(report.severity)}>
                            Severity: {report.severity}/5
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(report.date).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Duration: {report.duration}
                          </span>
                          {report.medicationRelated && (
                            <span className="flex items-center gap-1">
                              <Activity className="h-3 w-3" />
                              Related to: {report.medicationRelated}
                            </span>
                          )}
                        </div>
                        {report.notes && (
                          <p className="mt-2 text-sm text-muted-foreground">{report.notes}</p>
                        )}
                        <div className="flex gap-2 mt-3">
                          {report.doctorNotified && (
                            <Badge variant="outline" className="text-xs">
                              <Phone className="mr-1 h-3 w-3" />
                              Doctor Notified
                            </Badge>
                          )}
                          {report.teleConsultRequested && (
                            <Badge variant="outline" className="text-xs">
                              <Video className="mr-1 h-3 w-3" />
                              Tele-Consult Requested
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    {!report.teleConsultRequested && report.severity >= 3 && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleRequestTeleConsult(report.id)}
                      >
                        <Video className="mr-1 h-4 w-4" />
                        Request Tele-Consult
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10">
              <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">No side effects reported</p>
              <p className="text-sm text-muted-foreground">Click the button above to report any symptoms</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Emergency Info */}
      <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-800 dark:text-red-200">
            <AlertTriangle className="h-5 w-5" />
            Emergency Warning Signs
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-red-700 dark:text-red-300">
          <p className="mb-2">Seek immediate medical attention if you experience:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Difficulty breathing or shortness of breath</li>
            <li>Severe chest pain</li>
            <li>Sudden vision changes</li>
            <li>Severe allergic reactions (swelling, hives, difficulty swallowing)</li>
            <li>Uncontrolled bleeding</li>
            <li>High fever (over 103°F / 39.4°C)</li>
          </ul>
          <Button variant="destructive" className="mt-4">
            <Phone className="mr-2 h-4 w-4" />
            Emergency Helpline
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
