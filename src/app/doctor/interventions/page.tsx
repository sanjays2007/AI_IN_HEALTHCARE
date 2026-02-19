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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  ClipboardList,
  Plus,
  CheckCircle2,
  Clock,
  XCircle,
  Calendar,
  ChevronRight,
  Filter,
  MoreVertical,
  Play,
  Ban,
  Edit,
} from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import {
  mockInterventions,
  mockPatientRiskProfiles,
  Intervention,
  formatDateTime,
} from '@/lib/doctor-data';

export default function InterventionsPage() {
  const [interventions, setInterventions] = useState<Intervention[]>([
    ...mockInterventions,
    {
      id: '4',
      patientId: '3',
      doctorId: 'doc-1',
      type: 'mental_health_support',
      title: 'Psychology consultation scheduled',
      notes: 'Patient showing signs of anxiety about disease progression.',
      createdAt: '2026-02-18T10:00:00Z',
      scheduledDate: '2026-02-25T14:00:00Z',
      status: 'scheduled',
    },
    {
      id: '5',
      patientId: '4',
      doctorId: 'doc-1',
      type: 'nurse_followup',
      title: 'Transport arrangement',
      notes: 'Coordinating hospital transport for upcoming appointments.',
      createdAt: '2026-02-17T09:00:00Z',
      scheduledDate: '2026-02-26T08:00:00Z',
      status: 'scheduled',
    },
  ]);
  
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedIntervention, setSelectedIntervention] = useState<Intervention | null>(null);
  const [outcomeNotes, setOutcomeNotes] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [newIntervention, setNewIntervention] = useState({
    patientId: '',
    type: '',
    notes: '',
    scheduledDate: '',
  });
  const { toast } = useToast();

  const getPatientName = (patientId: string) => {
    const patient = mockPatientRiskProfiles.find(p => p.id === patientId);
    return patient?.name || 'Unknown Patient';
  };

  const filteredInterventions = interventions.filter(intervention => {
    if (statusFilter === 'all') return true;
    return intervention.status === statusFilter;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'in_progress': return <Clock className="h-4 w-4 text-blue-500" />;
      case 'scheduled': return <Calendar className="h-4 w-4 text-orange-500" />;
      case 'cancelled': return <XCircle className="h-4 w-4 text-gray-500" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      dosage_adjustment: 'Dosage Adjustment',
      tele_consult: 'Telehealth Consult',
      financial_referral: 'Financial Referral',
      nurse_followup: 'Nurse Follow-up',
      education_intervention: 'Education',
      mental_health_support: 'Mental Health Support',
      urgent_appointment: 'Urgent Appointment',
      treatment_change: 'Treatment Change',
      multidisciplinary_review: 'Multidisciplinary Review',
    };
    return labels[type] || type;
  };

  const completedCount = interventions.filter(i => i.status === 'completed').length;
  const scheduledCount = interventions.filter(i => i.status === 'scheduled').length;
  const inProgressCount = interventions.filter(i => i.status === 'in_progress').length;

  const handleCreateIntervention = () => {
    if (!newIntervention.patientId || !newIntervention.type) {
      toast({ variant: "destructive", title: "Please select a patient and intervention type" });
      return;
    }
    
    const intervention: Intervention = {
      id: String(Date.now()),
      patientId: newIntervention.patientId,
      doctorId: 'doc-1',
      type: newIntervention.type as any,
      title: getTypeLabel(newIntervention.type),
      notes: newIntervention.notes,
      createdAt: new Date().toISOString(),
      scheduledDate: newIntervention.scheduledDate || undefined,
      status: 'scheduled',
    };

    setInterventions([intervention, ...interventions]);
    setShowNewDialog(false);
    setNewIntervention({ patientId: '', type: '', notes: '', scheduledDate: '' });
    
    toast({
      title: "Intervention Created",
      description: `${intervention.title} scheduled for ${getPatientName(intervention.patientId)}`,
    });
  };

  const handleStartIntervention = (intervention: Intervention) => {
    setInterventions(prev => prev.map(i => 
      i.id === intervention.id ? { ...i, status: 'in_progress' as const } : i
    ));
    toast({
      title: "Intervention Started",
      description: `${intervention.title} is now in progress`,
    });
  };

  const openCompleteDialog = (intervention: Intervention) => {
    setSelectedIntervention(intervention);
    setOutcomeNotes('');
    setShowCompleteDialog(true);
  };

  const handleCompleteIntervention = () => {
    if (!selectedIntervention) return;
    
    setInterventions(prev => prev.map(i => 
      i.id === selectedIntervention.id 
        ? { ...i, status: 'completed' as const, completedAt: new Date().toISOString(), outcome: outcomeNotes || 'Completed successfully' } 
        : i
    ));
    
    toast({
      title: "Intervention Completed",
      description: `${selectedIntervention.title} marked as completed`,
    });
    
    setShowCompleteDialog(false);
  };

  const handleCancelIntervention = (intervention: Intervention) => {
    setInterventions(prev => prev.map(i => 
      i.id === intervention.id ? { ...i, status: 'cancelled' as const } : i
    ));
    toast({
      title: "Intervention Cancelled",
      description: `${intervention.title} has been cancelled`,
    });
  };

  const openEditDialog = (intervention: Intervention) => {
    setSelectedIntervention(intervention);
    setEditNotes(intervention.notes);
    setShowEditDialog(true);
  };

  const handleEditIntervention = () => {
    if (!selectedIntervention) return;
    
    setInterventions(prev => prev.map(i => 
      i.id === selectedIntervention.id ? { ...i, notes: editNotes } : i
    ));
    
    toast({
      title: "Notes Updated",
      description: "Intervention notes have been updated",
    });
    
    setShowEditDialog(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <ClipboardList className="h-8 w-8 text-blue-600" />
            Intervention Tracker
          </h1>
          <p className="text-muted-foreground">
            Log and manage clinical interventions
          </p>
        </div>
        <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Intervention
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Log New Intervention</DialogTitle>
              <DialogDescription>
                Create a new intervention record
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Patient</label>
                <Select 
                  value={newIntervention.patientId}
                  onValueChange={(value) => setNewIntervention(prev => ({ ...prev, patientId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockPatientRiskProfiles.map((p) => (
                      <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
                    <SelectItem value="tele_consult">Telehealth Consult</SelectItem>
                    <SelectItem value="financial_referral">Financial Referral</SelectItem>
                    <SelectItem value="nurse_followup">Nurse Follow-up</SelectItem>
                    <SelectItem value="education_intervention">Education</SelectItem>
                    <SelectItem value="mental_health_support">Mental Health Support</SelectItem>
                    <SelectItem value="urgent_appointment">Urgent Appointment</SelectItem>
                    <SelectItem value="treatment_change">Treatment Change</SelectItem>
                    <SelectItem value="multidisciplinary_review">Multidisciplinary Review</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Scheduled Date (optional)</Label>
                <Input
                  type="datetime-local"
                  value={newIntervention.scheduledDate}
                  onChange={(e) => setNewIntervention(prev => ({ ...prev, scheduledDate: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Notes</Label>
                <Textarea
                  placeholder="Enter intervention details..."
                  value={newIntervention.notes}
                  onChange={(e) => setNewIntervention(prev => ({ ...prev, notes: e.target.value }))}
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowNewDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateIntervention}>
                Create Intervention
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{interventions.length}</div>
            <p className="text-xs text-muted-foreground">All interventions</p>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedCount}</div>
            <p className="text-xs text-muted-foreground">Successfully executed</p>
          </CardContent>
        </Card>

        <Card className="border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
            <Calendar className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{scheduledCount}</div>
            <p className="text-xs text-muted-foreground">Upcoming</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{inProgressCount}</div>
            <p className="text-xs text-muted-foreground">Active interventions</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground ml-2">
          {filteredInterventions.length} interventions
        </span>
      </div>

      {/* Interventions List */}
      <div className="space-y-3">
        {filteredInterventions.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <ClipboardList className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
              <p className="text-lg font-medium">No interventions found</p>
              <p className="text-sm text-muted-foreground">
                Try adjusting your filters or create a new intervention
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredInterventions.map((intervention) => (
            <Card key={intervention.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-full bg-muted">
                    {getStatusIcon(intervention.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Link 
                        href={`/doctor/patients/${intervention.patientId}`}
                        className="font-semibold text-blue-600 hover:underline"
                      >
                        {getPatientName(intervention.patientId)}
                      </Link>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      <Badge variant="outline">{getTypeLabel(intervention.type)}</Badge>
                      <Badge variant={
                        intervention.status === 'completed' ? 'secondary' :
                        intervention.status === 'in_progress' ? 'default' :
                        intervention.status === 'scheduled' ? 'outline' : 'destructive'
                      }>
                        {intervention.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <h3 className="font-medium">{intervention.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{intervention.notes}</p>
                    {intervention.outcome && (
                      <p className="text-sm text-green-600 mt-1">
                        <CheckCircle2 className="h-3 w-3 inline mr-1" />
                        Outcome: {intervention.outcome}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                      <span>Created: {formatDateTime(intervention.createdAt)}</span>
                      {intervention.scheduledDate && (
                        <span>Scheduled: {formatDateTime(intervention.scheduledDate)}</span>
                      )}
                      {intervention.completedAt && (
                        <span>Completed: {formatDateTime(intervention.completedAt)}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/doctor/patients/${intervention.patientId}`}>
                        View Patient
                      </Link>
                    </Button>
                    {(intervention.status === 'scheduled' || intervention.status === 'in_progress') && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="ghost">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {intervention.status === 'scheduled' && (
                            <DropdownMenuItem onClick={() => handleStartIntervention(intervention)}>
                              <Play className="h-4 w-4 mr-2" />
                              Start Intervention
                            </DropdownMenuItem>
                          )}
                          {intervention.status === 'in_progress' && (
                            <DropdownMenuItem onClick={() => openCompleteDialog(intervention)}>
                              <CheckCircle2 className="h-4 w-4 mr-2" />
                              Mark Complete
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => openEditDialog(intervention)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Notes
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleCancelIntervention(intervention)}
                          >
                            <Ban className="h-4 w-4 mr-2" />
                            Cancel Intervention
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Complete Intervention Dialog */}
      <Dialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Intervention</DialogTitle>
            <DialogDescription>
              Record the outcome of this intervention for {selectedIntervention && getPatientName(selectedIntervention.patientId)}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Intervention</Label>
              <p className="text-sm font-medium">{selectedIntervention?.title}</p>
            </div>
            <div className="space-y-2">
              <Label>Outcome Notes</Label>
              <Textarea
                placeholder="Describe the intervention outcome..."
                value={outcomeNotes}
                onChange={(e) => setOutcomeNotes(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCompleteDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCompleteIntervention}>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Mark Complete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Notes Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Intervention Notes</DialogTitle>
            <DialogDescription>
              Update notes for this intervention
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                placeholder="Enter intervention notes..."
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditIntervention}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
