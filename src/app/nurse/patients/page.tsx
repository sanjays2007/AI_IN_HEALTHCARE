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
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Users,
  Search,
  Phone,
  Calendar,
  Activity,
  MessageSquare,
  Eye,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  mockPatientAssignments,
  getStatusColor,
  getRiskColor,
} from '@/lib/nurse-data';

export default function NursePatientsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedPatient, setSelectedPatient] = useState<typeof patients[0] | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showCallDialog, setShowCallDialog] = useState(false);
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [showVitalsDialog, setShowVitalsDialog] = useState(false);
  const [callNotes, setCallNotes] = useState('');
  const [messageText, setMessageText] = useState('');
  const [vitalsData, setVitalsData] = useState({ bp: '', hr: '', temp: '' });
  const { toast } = useToast();
  const patients = mockPatientAssignments;

  const openDetail = (patient: typeof patients[0]) => { setSelectedPatient(patient); setShowDetailDialog(true); };
  const openCall = (patient: typeof patients[0]) => { setSelectedPatient(patient); setShowCallDialog(true); };
  const openMessage = (patient: typeof patients[0]) => { setSelectedPatient(patient); setShowMessageDialog(true); };
  const openVitals = (patient: typeof patients[0]) => { setSelectedPatient(patient); setShowVitalsDialog(true); };

  const handleCall = () => {
    toast({ title: "Call Completed", description: `Call with ${selectedPatient?.patientName} logged` });
    setShowCallDialog(false); setCallNotes('');
  };

  const handleMessage = () => {
    if (!messageText.trim()) { toast({ variant: "destructive", title: "Please enter a message" }); return; }
    toast({ title: "Message Sent", description: `Message sent to ${selectedPatient?.patientName}` });
    setShowMessageDialog(false); setMessageText('');
  };

  const handleVitals = () => {
    if (!vitalsData.bp || !vitalsData.hr) { toast({ variant: "destructive", title: "Please fill BP and HR" }); return; }
    toast({ title: "Vitals Recorded", description: `Vitals saved for ${selectedPatient?.patientName}` });
    setShowVitalsDialog(false); setVitalsData({ bp: '', hr: '', temp: '' });
  };

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.patientId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || patient.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Users className="h-8 w-8 text-teal-600" />
          My Patients
        </h1>
        <p className="text-muted-foreground">
          View and manage your assigned patients
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Assigned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{patients.length}</div>
          </CardContent>
        </Card>
        <Card className="border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Stable</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {patients.filter(p => p.status === 'stable').length}
            </div>
          </CardContent>
        </Card>
        <Card className="border-yellow-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-700">Needs Attention</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {patients.filter(p => p.status === 'needs-attention').length}
            </div>
          </CardContent>
        </Card>
        <Card className="border-red-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-700">Critical</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {patients.filter(p => p.status === 'critical').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="stable">Stable</SelectItem>
                <SelectItem value="needs-attention">Needs Attention</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Patients Table */}
      <Card>
        <CardHeader>
          <CardTitle>Patient List</CardTitle>
          <CardDescription>Click on a patient for detailed view</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead>Risk Score</TableHead>
                <TableHead>Adherence</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Visit</TableHead>
                <TableHead>Next Follow-up</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{patient.patientName}</p>
                      <p className="text-sm text-muted-foreground">
                        {patient.patientId} • {patient.age}y • {patient.gender}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{patient.condition}</TableCell>
                  <TableCell>
                    <span className={`font-bold ${getRiskColor(patient.riskScore)}`}>
                      {patient.riskScore}%
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${patient.adherenceRate >= 80 ? 'bg-green-500' : patient.adherenceRate >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{ width: `${patient.adherenceRate}%` }}
                        />
                      </div>
                      <span className="text-sm">{patient.adherenceRate}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(patient.status)}>
                      {patient.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {new Date(patient.lastVisit).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-sm">
                    {new Date(patient.nextFollowUp).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" title="View Details" onClick={() => openDetail(patient)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" title="Call" onClick={() => openCall(patient)}>
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" title="Message" onClick={() => openMessage(patient)}>
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" title="Record Vitals" onClick={() => openVitals(patient)}>
                        <Activity className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Patient Details</DialogTitle>
            <DialogDescription>{selectedPatient?.patientId}</DialogDescription>
          </DialogHeader>
          {selectedPatient && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label className="text-muted-foreground">Name</Label><p className="font-medium">{selectedPatient.patientName}</p></div>
                <div><Label className="text-muted-foreground">Age/Gender</Label><p>{selectedPatient.age}y / {selectedPatient.gender}</p></div>
                <div><Label className="text-muted-foreground">Condition</Label><p>{selectedPatient.condition}</p></div>
                <div><Label className="text-muted-foreground">Risk Score</Label><p className={`font-bold ${getRiskColor(selectedPatient.riskScore)}`}>{selectedPatient.riskScore}%</p></div>
                <div><Label className="text-muted-foreground">Adherence</Label><p>{selectedPatient.adherenceRate}%</p></div>
                <div><Label className="text-muted-foreground">Phone</Label><p>{selectedPatient.phone}</p></div>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => { setShowDetailDialog(false); openCall(selectedPatient); }}><Phone className="h-4 w-4 mr-2" />Call</Button>
                <Button variant="outline" onClick={() => { setShowDetailDialog(false); openMessage(selectedPatient); }}><MessageSquare className="h-4 w-4 mr-2" />Message</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Call Dialog */}
      <Dialog open={showCallDialog} onOpenChange={setShowCallDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Call {selectedPatient?.patientName}</DialogTitle>
            <DialogDescription>{selectedPatient?.phone}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Textarea placeholder="Call notes..." value={callNotes} onChange={(e) => setCallNotes(e.target.value)} rows={3} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCallDialog(false)}>Cancel</Button>
            <Button onClick={handleCall}>Complete Call</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Message Dialog */}
      <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Message {selectedPatient?.patientName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Textarea placeholder="Type your message..." value={messageText} onChange={(e) => setMessageText(e.target.value)} rows={3} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMessageDialog(false)}>Cancel</Button>
            <Button onClick={handleMessage}>Send Message</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Vitals Dialog */}
      <Dialog open={showVitalsDialog} onOpenChange={setShowVitalsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Vitals - {selectedPatient?.patientName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-3 gap-4">
              <div><Label>BP*</Label><Input placeholder="120/80" value={vitalsData.bp} onChange={(e) => setVitalsData({ ...vitalsData, bp: e.target.value })} /></div>
              <div><Label>HR*</Label><Input placeholder="72" value={vitalsData.hr} onChange={(e) => setVitalsData({ ...vitalsData, hr: e.target.value })} /></div>
              <div><Label>Temp</Label><Input placeholder="98.6" value={vitalsData.temp} onChange={(e) => setVitalsData({ ...vitalsData, temp: e.target.value })} /></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowVitalsDialog(false)}>Cancel</Button>
            <Button onClick={handleVitals}>Save Vitals</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
