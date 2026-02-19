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
} from '@/components/ui/dialog';
import {
  MessageSquare,
  Video,
  Send,
  Bell,
  Phone,
  Mail,
  Users,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import {
  mockPatientRiskProfiles,
  getRiskBadgeVariant,
} from '@/lib/doctor-data';

interface CommunicationLog {
  id: string;
  patientId: string;
  patientName: string;
  type: 'message' | 'video' | 'automated' | 'notification';
  content: string;
  status: 'sent' | 'delivered' | 'read';
  timestamp: string;
}

const mockCommunicationLogs: CommunicationLog[] = [
  {
    id: '1',
    patientId: '1',
    patientName: 'Maria Santos',
    type: 'message',
    content: 'Reminder: Your appointment is scheduled for Feb 24. Please confirm your attendance.',
    status: 'read',
    timestamp: '2026-02-18T10:30:00Z',
  },
  {
    id: '2',
    patientId: '2',
    patientName: 'Robert Chen',
    type: 'video',
    content: 'Telehealth consultation completed. Duration: 15 minutes.',
    status: 'delivered',
    timestamp: '2026-02-17T14:00:00Z',
  },
  {
    id: '3',
    patientId: '1',
    patientName: 'Maria Santos',
    type: 'automated',
    content: 'Automated support message sent: "We noticed you haven\'t checked in recently..."',
    status: 'sent',
    timestamp: '2026-02-16T09:00:00Z',
  },
  {
    id: '4',
    patientId: '3',
    patientName: 'Emily Johnson',
    type: 'notification',
    content: 'Nurse follow-up notification sent',
    status: 'delivered',
    timestamp: '2026-02-15T11:00:00Z',
  },
];

export default function CommunicationPage() {
  const [patients] = useState(mockPatientRiskProfiles);
  const [logs] = useState(mockCommunicationLogs);
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [showVideoDialog, setShowVideoDialog] = useState(false);
  const [newMessage, setNewMessage] = useState({
    patientId: '',
    content: '',
  });

  const highRiskPatients = patients.filter(p => p.riskCategory === 'high' || p.riskCategory === 'critical');

  const getTypeIcon = (type: CommunicationLog['type']) => {
    switch (type) {
      case 'message': return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case 'video': return <Video className="h-4 w-4 text-green-500" />;
      case 'automated': return <Bell className="h-4 w-4 text-orange-500" />;
      case 'notification': return <Bell className="h-4 w-4 text-purple-500" />;
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <MessageSquare className="h-8 w-8 text-blue-600" />
            Communication Hub
          </h1>
          <p className="text-muted-foreground">
            Connect with patients and coordinate care team communications
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card 
          className="cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => setShowMessageDialog(true)}
        >
          <CardContent className="flex items-center gap-4 p-6">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
              <Send className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold">Send Message</p>
              <p className="text-sm text-muted-foreground">Direct patient message</p>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => setShowVideoDialog(true)}
        >
          <CardContent className="flex items-center gap-4 p-6">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30">
              <Video className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="font-semibold">Video Consult</p>
              <p className="text-sm text-muted-foreground">Start telehealth session</p>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900/30">
              <Bell className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="font-semibold">Auto Message</p>
              <p className="text-sm text-muted-foreground">Trigger support message</p>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="font-semibold">Notify Team</p>
              <p className="text-sm text-muted-foreground">Alert nurse/counselor</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* High Risk Patients for Contact */}
        <Card>
          <CardHeader>
            <CardTitle>Priority Contacts</CardTitle>
            <CardDescription>High-risk patients needing communication</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {highRiskPatients.map((patient) => (
                <div 
                  key={patient.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-muted/30"
                >
                  <div>
                    <p className="font-medium">{patient.name}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Badge variant={getRiskBadgeVariant(patient.riskCategory)} className="text-xs">
                        {patient.dropoutRiskScore}% risk
                      </Badge>
                      <span>{patient.primaryRiskFactor}</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" title="Send Message">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" title="Video Call">
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" title="Phone Call">
                      <Phone className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Communications */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Communications</CardTitle>
            <CardDescription>Latest patient interactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {logs.map((log) => (
                <div key={log.id} className="flex items-start gap-3 p-3 rounded-lg border">
                  <div className="p-2 rounded-full bg-muted">
                    {getTypeIcon(log.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{log.patientName}</span>
                      <Badge variant="outline" className="text-xs capitalize">
                        {log.type}
                      </Badge>
                      <Badge 
                        variant={log.status === 'read' ? 'secondary' : 'outline'} 
                        className="text-xs ml-auto"
                      >
                        {log.status === 'read' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                        {log.status === 'sent' && <Clock className="h-3 w-3 mr-1" />}
                        {log.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{log.content}</p>
                    <p className="text-xs text-muted-foreground mt-1">{formatTime(log.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Send Message Dialog */}
      <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Message to Patient</DialogTitle>
            <DialogDescription>
              Compose a personalized message for the patient
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Patient</label>
              <Select 
                value={newMessage.patientId}
                onValueChange={(value) => setNewMessage(prev => ({ ...prev, patientId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Message</label>
              <Textarea
                placeholder="Type your message..."
                value={newMessage.content}
                onChange={(e) => setNewMessage(prev => ({ ...prev, content: e.target.value }))}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMessageDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowMessageDialog(false)}>
              <Send className="h-4 w-4 mr-2" />
              Send Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Video Consultation Dialog */}
      <Dialog open={showVideoDialog} onOpenChange={setShowVideoDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start Video Consultation</DialogTitle>
            <DialogDescription>
              Initiate a telehealth session with a patient
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Patient</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="p-4 rounded-lg bg-muted/50 text-center">
              <Video className="h-12 w-12 mx-auto mb-2 text-green-600" />
              <p className="text-sm text-muted-foreground">
                Video call will be initiated when you click "Start Call"
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowVideoDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowVideoDialog(false)} className="bg-green-600 hover:bg-green-700">
              <Video className="h-4 w-4 mr-2" />
              Start Call
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
