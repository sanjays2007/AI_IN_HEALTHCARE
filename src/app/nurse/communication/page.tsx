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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  MessageSquare,
  Phone,
  Mail,
  Send,
  Search,
  Clock,
  CheckCircle2,
  XCircle,
  PhoneCall,
  Plus,
} from 'lucide-react';
import { mockCommunicationLogs, mockPatientAssignments, CommunicationLog } from '@/lib/nurse-data';

export default function CommunicationPage() {
  const [logs, setLogs] = useState<CommunicationLog[]>(mockCommunicationLogs);
  const [searchQuery, setSearchQuery] = useState('');
  const [showLogDialog, setShowLogDialog] = useState(false);
  const [newLog, setNewLog] = useState({
    patientId: '',
    type: 'call' as CommunicationLog['type'],
    summary: '',
    outcome: 'successful' as CommunicationLog['outcome'],
    duration: '',
  });

  const getOutcomeIcon = (outcome: string) => {
    switch (outcome) {
      case 'successful': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'no-answer': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'callback-requested': return <PhoneCall className="h-4 w-4 text-yellow-500" />;
      case 'issue-resolved': return <CheckCircle2 className="h-4 w-4 text-blue-500" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'call': return <Phone className="h-4 w-4" />;
      case 'sms': return <MessageSquare className="h-4 w-4" />;
      case 'email': return <Mail className="h-4 w-4" />;
      case 'in-person': return <MessageSquare className="h-4 w-4" />;
    }
  };

  const filteredLogs = logs.filter(log =>
    log.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.patientId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddLog = () => {
    const patient = mockPatientAssignments.find(p => p.patientId === newLog.patientId);
    if (!patient) return;

    const log: CommunicationLog = {
      id: String(logs.length + 1),
      patientId: newLog.patientId,
      patientName: patient.patientName,
      type: newLog.type,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      duration: newLog.duration ? parseInt(newLog.duration) : undefined,
      summary: newLog.summary,
      outcome: newLog.outcome,
      nurseId: 'N-001',
    };

    setLogs([log, ...logs]);
    setShowLogDialog(false);
    setNewLog({
      patientId: '',
      type: 'call',
      summary: '',
      outcome: 'successful',
      duration: '',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <MessageSquare className="h-8 w-8 text-teal-600" />
            Communication
          </h1>
          <p className="text-muted-foreground">
            Log and track all patient communications
          </p>
        </div>
        <Button onClick={() => setShowLogDialog(true)} className="bg-teal-600 hover:bg-teal-700">
          <Plus className="h-4 w-4 mr-2" />
          Log Communication
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {logs.filter(l => l.date === '2026-02-18' || l.date === '2026-02-19').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Successful</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {logs.filter(l => l.outcome === 'successful').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">No Answer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {logs.filter(l => l.outcome === 'no-answer').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Callbacks Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {logs.filter(l => l.outcome === 'callback-requested').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="logs">
        <TabsList>
          <TabsTrigger value="logs">Communication Logs</TabsTrigger>
          <TabsTrigger value="quick">Quick Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="logs" className="space-y-4">
          {/* Search */}
          <Card>
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by patient name or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </CardContent>
          </Card>

          {/* Logs Table */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Communications</CardTitle>
              <CardDescription>All patient communication records</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date/Time</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Summary</TableHead>
                    <TableHead>Outcome</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{log.patientName}</p>
                          <p className="text-xs text-muted-foreground">{log.patientId}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getTypeIcon(log.type)}
                          <span className="capitalize">{log.type}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {new Date(log.date).toLocaleDateString()} {log.time}
                      </TableCell>
                      <TableCell>
                        {log.duration ? `${log.duration} min` : '-'}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {log.summary}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {getOutcomeIcon(log.outcome)}
                          <span className="capitalize text-sm">{log.outcome.replace('-', ' ')}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quick" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Quick Call */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-green-600" />
                  Quick Call
                </CardTitle>
                <CardDescription>Make a quick patient call</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockPatientAssignments.map((p) => (
                      <SelectItem key={p.patientId} value={p.patientId}>
                        {p.patientName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  <Phone className="h-4 w-4 mr-2" />
                  Start Call
                </Button>
              </CardContent>
            </Card>

            {/* Quick SMS */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                  Send SMS
                </CardTitle>
                <CardDescription>Send a quick message</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockPatientAssignments.map((p) => (
                      <SelectItem key={p.patientId} value={p.patientId}>
                        {p.patientName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Textarea placeholder="Enter message..." rows={2} />
                <Button className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </CardContent>
            </Card>

            {/* Templates */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Templates</CardTitle>
                <CardDescription>Pre-written message templates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start text-left h-auto py-2">
                  <div>
                    <p className="font-medium">Appointment Reminder</p>
                    <p className="text-xs text-muted-foreground">Remind about upcoming visit</p>
                  </div>
                </Button>
                <Button variant="outline" className="w-full justify-start text-left h-auto py-2">
                  <div>
                    <p className="font-medium">Medication Reminder</p>
                    <p className="text-xs text-muted-foreground">Remind to take medication</p>
                  </div>
                </Button>
                <Button variant="outline" className="w-full justify-start text-left h-auto py-2">
                  <div>
                    <p className="font-medium">Follow-up Check</p>
                    <p className="text-xs text-muted-foreground">Check on patient wellbeing</p>
                  </div>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Log Dialog */}
      <Dialog open={showLogDialog} onOpenChange={setShowLogDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log Communication</DialogTitle>
            <DialogDescription>Record a patient communication</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Patient</label>
              <Select value={newLog.patientId} onValueChange={(v) => setNewLog({...newLog, patientId: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select patient" />
                </SelectTrigger>
                <SelectContent>
                  {mockPatientAssignments.map((p) => (
                    <SelectItem key={p.patientId} value={p.patientId}>
                      {p.patientName} ({p.patientId})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <Select value={newLog.type} onValueChange={(v: CommunicationLog['type']) => setNewLog({...newLog, type: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="call">Phone Call</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="in-person">In Person</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Duration (min)</label>
                <Input
                  type="number"
                  placeholder="5"
                  value={newLog.duration}
                  onChange={(e) => setNewLog({...newLog, duration: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Summary</label>
              <Textarea
                placeholder="Brief summary of the communication..."
                value={newLog.summary}
                onChange={(e) => setNewLog({...newLog, summary: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Outcome</label>
              <Select value={newLog.outcome} onValueChange={(v: CommunicationLog['outcome']) => setNewLog({...newLog, outcome: v})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="successful">Successful</SelectItem>
                  <SelectItem value="no-answer">No Answer</SelectItem>
                  <SelectItem value="callback-requested">Callback Requested</SelectItem>
                  <SelectItem value="issue-resolved">Issue Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLogDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddLog} disabled={!newLog.patientId || !newLog.summary}>
              Save Log
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
