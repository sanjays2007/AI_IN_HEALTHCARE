'use client';

import { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Search,
  Filter,
  ChevronRight,
  AlertTriangle,
  Calendar,
  X,
  SortAsc,
  SortDesc,
  Phone,
  Mail,
  MessageSquare,
  Video,
  Send,
  Pill,
  Activity,
  ClipboardList,
} from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import {
  mockPatientRiskProfiles,
  PatientRiskProfile,
  RiskCategory,
  getRiskBadgeVariant,
  formatDate,
} from '@/lib/doctor-data';

type SortField = 'name' | 'dropoutRiskScore' | 'lastVisitDate' | 'missedAppointmentCount';
type SortOrder = 'asc' | 'desc';

export default function PatientRiskListPage() {
  const [patients] = useState(mockPatientRiskProfiles);
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [treatmentFilter, setTreatmentFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('dropoutRiskScore');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [showFilters, setShowFilters] = useState(false);
  
  // Patient detail dialog
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<PatientRiskProfile | null>(null);
  
  // Quick action dialogs
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [showInterventionDialog, setShowInterventionDialog] = useState(false);
  const [messageContent, setMessageContent] = useState('');
  const [interventionType, setInterventionType] = useState('');
  const [interventionNotes, setInterventionNotes] = useState('');
  
  const { toast } = useToast();

  // Get unique values for filters
  const treatmentTypes = useMemo(() => 
    [...new Set(patients.map(p => p.treatmentType))],
    [patients]
  );
  const departments = useMemo(() => 
    [...new Set(patients.map(p => p.department))],
    [patients]
  );

  // Filter and sort patients
  const filteredPatients = useMemo(() => {
    let result = patients.filter(patient => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          patient.name.toLowerCase().includes(query) ||
          patient.patientId.toLowerCase().includes(query) ||
          patient.diagnosis.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Risk level filter
      if (riskFilter !== 'all' && patient.riskCategory !== riskFilter) {
        return false;
      }

      // Treatment type filter
      if (treatmentFilter !== 'all' && patient.treatmentType !== treatmentFilter) {
        return false;
      }

      // Department filter
      if (departmentFilter !== 'all' && patient.department !== departmentFilter) {
        return false;
      }

      return true;
    });

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'dropoutRiskScore':
          comparison = a.dropoutRiskScore - b.dropoutRiskScore;
          break;
        case 'lastVisitDate':
          comparison = new Date(a.lastVisitDate).getTime() - new Date(b.lastVisitDate).getTime();
          break;
        case 'missedAppointmentCount':
          comparison = a.missedAppointmentCount - b.missedAppointmentCount;
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [patients, searchQuery, riskFilter, treatmentFilter, departmentFilter, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setRiskFilter('all');
    setTreatmentFilter('all');
    setDepartmentFilter('all');
  };

  const activeFilterCount = [
    riskFilter !== 'all',
    treatmentFilter !== 'all',
    departmentFilter !== 'all',
  ].filter(Boolean).length;

  const getRiskScoreColor = (score: number) => {
    if (score >= 80) return 'text-red-600 bg-red-100 dark:bg-red-900/30';
    if (score >= 60) return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30';
    if (score >= 40) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
    return 'text-green-600 bg-green-100 dark:bg-green-900/30';
  };

  const viewPatientDetails = (patient: PatientRiskProfile) => {
    setSelectedPatient(patient);
    setShowDetailDialog(true);
  };

  const openMessageDialog = (patient: PatientRiskProfile) => {
    setSelectedPatient(patient);
    setMessageContent('');
    setShowMessageDialog(true);
  };

  const openInterventionDialog = (patient: PatientRiskProfile) => {
    setSelectedPatient(patient);
    setInterventionType('');
    setInterventionNotes('');
    setShowInterventionDialog(true);
  };

  const sendMessage = () => {
    if (!messageContent.trim()) {
      toast({ variant: "destructive", title: "Please enter a message" });
      return;
    }
    toast({
      title: "Message Sent",
      description: `Message delivered to ${selectedPatient?.name}`,
    });
    setShowMessageDialog(false);
  };

  const createIntervention = () => {
    if (!interventionType) {
      toast({ variant: "destructive", title: "Please select an intervention type" });
      return;
    }
    toast({
      title: "Intervention Created",
      description: `${interventionType} intervention created for ${selectedPatient?.name}`,
    });
    setShowInterventionDialog(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Patient Risk List</h1>
        <p className="text-muted-foreground">
          Monitor and prioritize patients based on dropout risk scores
        </p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4">
            {/* Search Bar */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, ID, or diagnosis..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button
                variant={showFilters ? 'default' : 'outline'}
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {activeFilterCount > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </div>

            {/* Filter Options */}
            {showFilters && (
              <div className="grid gap-3 md:grid-cols-4 p-4 bg-muted/50 rounded-lg">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Risk Level</label>
                  <Select value={riskFilter} onValueChange={setRiskFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Risk Levels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Risk Levels</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Treatment Type</label>
                  <Select value={treatmentFilter} onValueChange={setTreatmentFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Treatments" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Treatments</SelectItem>
                      {treatmentTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Department</label>
                  <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Departments" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      {departments.map(dept => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button variant="ghost" onClick={clearFilters} className="w-full">
                    <X className="h-4 w-4 mr-2" />
                    Clear Filters
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-medium">{filteredPatients.length}</span> of{' '}
          <span className="font-medium">{patients.length}</span> patients
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <Select 
            value={sortField} 
            onValueChange={(value) => setSortField(value as SortField)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dropoutRiskScore">Risk Score</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="lastVisitDate">Last Visit</SelectItem>
              <SelectItem value="missedAppointmentCount">Missed Appointments</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
          >
            {sortOrder === 'asc' ? (
              <SortAsc className="h-4 w-4" />
            ) : (
              <SortDesc className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Patient Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Patient ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Diagnosis / Treatment</TableHead>
                <TableHead className="text-center">
                  <button
                    onClick={() => handleSort('dropoutRiskScore')}
                    className="flex items-center gap-1 mx-auto hover:text-foreground"
                  >
                    Risk Score
                    {sortField === 'dropoutRiskScore' && (
                      sortOrder === 'desc' ? <SortDesc className="h-3 w-3" /> : <SortAsc className="h-3 w-3" />
                    )}
                  </button>
                </TableHead>
                <TableHead className="text-center">Risk Level</TableHead>
                <TableHead>Primary Factor</TableHead>
                <TableHead className="text-center">
                  <button
                    onClick={() => handleSort('lastVisitDate')}
                    className="flex items-center gap-1 mx-auto hover:text-foreground"
                  >
                    Last Visit
                    {sortField === 'lastVisitDate' && (
                      sortOrder === 'desc' ? <SortDesc className="h-3 w-3" /> : <SortAsc className="h-3 w-3" />
                    )}
                  </button>
                </TableHead>
                <TableHead className="text-center">
                  <button
                    onClick={() => handleSort('missedAppointmentCount')}
                    className="flex items-center gap-1 mx-auto hover:text-foreground"
                  >
                    Missed
                    {sortField === 'missedAppointmentCount' && (
                      sortOrder === 'desc' ? <SortDesc className="h-3 w-3" /> : <SortAsc className="h-3 w-3" />
                    )}
                  </button>
                </TableHead>
                <TableHead className="w-[100px]">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    <div className="text-muted-foreground">
                      <AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No patients match your filters</p>
                      <Button variant="link" onClick={clearFilters} className="mt-2">
                        Clear filters
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredPatients.map((patient) => (
                  <TableRow 
                    key={patient.id}
                    className={`cursor-pointer hover:bg-muted/50 ${
                      patient.riskCategory === 'critical' ? 'bg-red-50/50 dark:bg-red-900/10' :
                      patient.riskCategory === 'high' ? 'bg-orange-50/50 dark:bg-orange-900/10' :
                      ''
                    }`}
                    onClick={() => viewPatientDetails(patient)}
                  >
                    <TableCell className="font-mono text-xs">
                      {patient.patientId}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{patient.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {patient.age}y • {patient.gender === 'male' ? 'M' : patient.gender === 'female' ? 'F' : 'O'}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{patient.diagnosis}</p>
                        <p className="text-xs text-muted-foreground">{patient.treatmentType}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={`inline-flex items-center justify-center w-12 h-8 rounded-md font-bold text-sm ${getRiskScoreColor(patient.dropoutRiskScore)}`}>
                        {patient.dropoutRiskScore}%
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={getRiskBadgeVariant(patient.riskCategory)}>
                        {patient.riskCategory.charAt(0).toUpperCase() + patient.riskCategory.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{patient.primaryRiskFactor}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1 text-sm">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        {formatDate(patient.lastVisitDate)}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge 
                        variant={patient.missedAppointmentCount >= 3 ? 'destructive' : patient.missedAppointmentCount >= 1 ? 'default' : 'secondary'}
                      >
                        {patient.missedAppointmentCount}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          title="Send Message"
                          onClick={() => openMessageDialog(patient)}
                        >
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          title="Create Intervention"
                          onClick={() => openInterventionDialog(patient)}
                        >
                          <ClipboardList className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => viewPatientDetails(patient)}
                        >
                          Details
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Patient Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Patient Details</DialogTitle>
            <DialogDescription>
              Comprehensive view of patient risk profile
            </DialogDescription>
          </DialogHeader>
          {selectedPatient && (
            <div className="space-y-6 py-4">
              {/* Patient Info Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{selectedPatient.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    ID: {selectedPatient.patientId} • {selectedPatient.age}y • {selectedPatient.gender}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant={getRiskBadgeVariant(selectedPatient.riskCategory)}>
                      {selectedPatient.riskCategory.toUpperCase()} RISK
                    </Badge>
                    <span className={`inline-flex items-center px-2 py-1 rounded-md font-bold text-sm ${getRiskScoreColor(selectedPatient.dropoutRiskScore)}`}>
                      {selectedPatient.dropoutRiskScore}% Risk Score
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="icon" 
                    variant="outline"
                    onClick={() => {
                      toast({ title: "Calling patient...", description: selectedPatient.contactPhone });
                    }}
                  >
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="outline"
                    onClick={() => openMessageDialog(selectedPatient)}
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Clinical Info */}
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Clinical Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Diagnosis:</span>
                      <span className="font-medium">{selectedPatient.diagnosis}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Treatment:</span>
                      <span className="font-medium">{selectedPatient.treatmentType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Phase:</span>
                      <span className="font-medium">{selectedPatient.treatmentPhase}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Medication:</span>
                      <span className="font-medium">{selectedPatient.medicationPlan}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Progress:</span>
                      <span className="font-medium">{selectedPatient.treatmentCompletionPercent}%</span>
                    </div>
                    <Progress value={selectedPatient.treatmentCompletionPercent} className="h-2 mt-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Primary Risk Factor</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                      <span className="font-medium text-red-700 dark:text-red-300">
                        {selectedPatient.primaryRiskFactor}
                      </span>
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Financial</span>
                        <span>{selectedPatient.riskBreakdown.financial}%</span>
                      </div>
                      <Progress value={selectedPatient.riskBreakdown.financial} className="h-1.5" />
                      <div className="flex items-center justify-between text-sm">
                        <span>Side Effects</span>
                        <span>{selectedPatient.riskBreakdown.sideEffect}%</span>
                      </div>
                      <Progress value={selectedPatient.riskBreakdown.sideEffect} className="h-1.5" />
                      <div className="flex items-center justify-between text-sm">
                        <span>Emotional</span>
                        <span>{selectedPatient.riskBreakdown.emotional}%</span>
                      </div>
                      <Progress value={selectedPatient.riskBreakdown.emotional} className="h-1.5" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Adherence Metrics */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Adherence Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-sm">
                          <Pill className="h-3 w-3" /> Medication
                        </span>
                        <span className={`font-bold ${selectedPatient.medicationAdherence >= 80 ? 'text-green-600' : selectedPatient.medicationAdherence >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {selectedPatient.medicationAdherence}%
                        </span>
                      </div>
                      <Progress value={selectedPatient.medicationAdherence} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3" /> Appointments
                        </span>
                        <span className={`font-bold ${selectedPatient.appointmentAdherence >= 80 ? 'text-green-600' : selectedPatient.appointmentAdherence >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {selectedPatient.appointmentAdherence}%
                        </span>
                      </div>
                      <Progress value={selectedPatient.appointmentAdherence} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-sm">
                          <MessageSquare className="h-3 w-3" /> Communication
                        </span>
                        <span className={`font-bold ${selectedPatient.communicationResponseRate >= 80 ? 'text-green-600' : selectedPatient.communicationResponseRate >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {selectedPatient.communicationResponseRate}%
                        </span>
                      </div>
                      <Progress value={selectedPatient.communicationResponseRate} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact & Appointment Info */}
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      {selectedPatient.contactPhone}
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      {selectedPatient.contactEmail}
                    </div>
                    <div className="text-muted-foreground mt-2">
                      Emergency: {selectedPatient.emergencyContact}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Appointments</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Visit:</span>
                      <span className="font-medium">{formatDate(selectedPatient.lastVisitDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Next Appointment:</span>
                      <span className="font-medium">{formatDate(selectedPatient.nextAppointment)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Missed:</span>
                      <Badge variant={selectedPatient.missedAppointmentCount >= 3 ? 'destructive' : 'secondary'}>
                        {selectedPatient.missedAppointmentCount} appointments
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailDialog(false)}>
              Close
            </Button>
            <Button onClick={() => {
              setShowDetailDialog(false);
              if (selectedPatient) openInterventionDialog(selectedPatient);
            }}>
              <ClipboardList className="h-4 w-4 mr-2" />
              Create Intervention
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send Message Dialog */}
      <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Message</DialogTitle>
            <DialogDescription>
              Send a message to {selectedPatient?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea
                placeholder="Type your message..."
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMessageDialog(false)}>
              Cancel
            </Button>
            <Button onClick={sendMessage}>
              <Send className="h-4 w-4 mr-2" />
              Send Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Intervention Dialog */}
      <Dialog open={showInterventionDialog} onOpenChange={setShowInterventionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Intervention</DialogTitle>
            <DialogDescription>
              Create an intervention for {selectedPatient?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Intervention Type</Label>
              <Select value={interventionType} onValueChange={setInterventionType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select intervention type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Dosage Adjustment">Dosage Adjustment</SelectItem>
                  <SelectItem value="Telehealth Consult">Telehealth Consult</SelectItem>
                  <SelectItem value="Financial Referral">Financial Referral</SelectItem>
                  <SelectItem value="Nurse Follow-up">Nurse Follow-up</SelectItem>
                  <SelectItem value="Education Session">Education Session</SelectItem>
                  <SelectItem value="Mental Health Support">Mental Health Support</SelectItem>
                  <SelectItem value="Urgent Appointment">Urgent Appointment</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                placeholder="Add any notes..."
                value={interventionNotes}
                onChange={(e) => setInterventionNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInterventionDialog(false)}>
              Cancel
            </Button>
            <Button onClick={createIntervention}>
              <ClipboardList className="h-4 w-4 mr-2" />
              Create Intervention
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
