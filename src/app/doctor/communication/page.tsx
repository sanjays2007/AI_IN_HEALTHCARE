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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  PhoneCall,
  Loader2,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  mockPatientRiskProfiles,
  getRiskBadgeVariant,
} from '@/lib/doctor-data';

interface CommunicationLog {
  id: string;
  patientId: string;
  patientName: string;
  type: 'message' | 'video' | 'automated' | 'notification' | 'phone';
  content: string;
  status: 'sent' | 'delivered' | 'read';
  timestamp: string;
}

const initialCommunicationLogs: CommunicationLog[] = [
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
  const [logs, setLogs] = useState<CommunicationLog[]>(initialCommunicationLogs);
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [showVideoDialog, setShowVideoDialog] = useState(false);
  const [showAutoMessageDialog, setShowAutoMessageDialog] = useState(false);
  const [showTeamNotifyDialog, setShowTeamNotifyDialog] = useState(false);
  const [showPhoneDialog, setShowPhoneDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPatientForAction, setSelectedPatientForAction] = useState<string>('');
  const { toast } = useToast();
  
  const [newMessage, setNewMessage] = useState({
    patientId: '',
    content: '',
  });
  
  const [videoCall, setVideoCall] = useState({
    patientId: '',
    isInCall: false,
  });
  
  const [autoMessage, setAutoMessage] = useState({
    patientId: '',
    template: '',
  });
  
  const [teamNotify, setTeamNotify] = useState({
    patientId: '',
    teamMember: '',
    message: '',
  });

  const highRiskPatients = patients.filter(p => p.riskCategory === 'high' || p.riskCategory === 'critical');

  const getTypeIcon = (type: CommunicationLog['type']) => {
    switch (type) {
      case 'message': return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case 'video': return <Video className="h-4 w-4 text-green-500" />;
      case 'automated': return <Bell className="h-4 w-4 text-orange-500" />;
      case 'notification': return <Bell className="h-4 w-4 text-purple-500" />;
      case 'phone': return <Phone className="h-4 w-4 text-cyan-500" />;
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
  
  const getPatientName = (patientId: string) => {
    return patients.find(p => p.id === patientId)?.name || 'Unknown';
  };
  
  const handleSendMessage = () => {
    if (!newMessage.patientId || !newMessage.content) {
      toast({ variant: "destructive", title: "Please select a patient and enter a message" });
      return;
    }
    
    setIsLoading(true);
    setTimeout(() => {
      const newLog: CommunicationLog = {
        id: Date.now().toString(),
        patientId: newMessage.patientId,
        patientName: getPatientName(newMessage.patientId),
        type: 'message',
        content: newMessage.content,
        status: 'sent',
        timestamp: new Date().toISOString(),
      };
      
      setLogs(prev => [newLog, ...prev]);
      setShowMessageDialog(false);
      setNewMessage({ patientId: '', content: '' });
      setIsLoading(false);
      
      toast({
        title: "Message Sent",
        description: `Message delivered to ${newLog.patientName}`,
      });
    }, 1000);
  };
  
  const handleStartVideoCall = () => {
    if (!videoCall.patientId) {
      toast({ variant: "destructive", title: "Please select a patient" });
      return;
    }
    
    setVideoCall(prev => ({ ...prev, isInCall: true }));
    
    // Simulate call ending after 3 seconds for demo
    setTimeout(() => {
      const newLog: CommunicationLog = {
        id: Date.now().toString(),
        patientId: videoCall.patientId,
        patientName: getPatientName(videoCall.patientId),
        type: 'video',
        content: 'Video consultation completed. Duration: 5 minutes.',
        status: 'delivered',
        timestamp: new Date().toISOString(),
      };
      
      setLogs(prev => [newLog, ...prev]);
      setVideoCall({ patientId: '', isInCall: false });
      setShowVideoDialog(false);
      
      toast({
        title: "Call Ended",
        description: `Video consultation with ${newLog.patientName} completed`,
      });
    }, 3000);
  };
  
  const handleSendAutoMessage = () => {
    if (!autoMessage.patientId || !autoMessage.template) {
      toast({ variant: "destructive", title: "Please select a patient and message template" });
      return;
    }
    
    const templates: Record<string, string> = {
      'checkin': 'We noticed you haven\'t checked in recently. How are you feeling today?',
      'medication': 'Reminder: Please take your medication as prescribed. Your health matters to us.',
      'appointment': 'Your next appointment is coming up. Please confirm your attendance.',
      'support': 'We\'re here to support you. Don\'t hesitate to reach out if you need anything.',
    };
    
    const newLog: CommunicationLog = {
      id: Date.now().toString(),
      patientId: autoMessage.patientId,
      patientName: getPatientName(autoMessage.patientId),
      type: 'automated',
      content: `Automated message sent: "${templates[autoMessage.template]}"`,
      status: 'sent',
      timestamp: new Date().toISOString(),
    };
    
    setLogs(prev => [newLog, ...prev]);
    setShowAutoMessageDialog(false);
    setAutoMessage({ patientId: '', template: '' });
    
    toast({
      title: "Automated Message Sent",
      description: `Support message sent to ${newLog.patientName}`,
    });
  };
  
  const handleNotifyTeam = () => {
    if (!teamNotify.patientId || !teamNotify.teamMember) {
      toast({ variant: "destructive", title: "Please select a patient and team member" });
      return;
    }
    
    const newLog: CommunicationLog = {
      id: Date.now().toString(),
      patientId: teamNotify.patientId,
      patientName: getPatientName(teamNotify.patientId),
      type: 'notification',
      content: `Team notification sent to ${teamNotify.teamMember}: ${teamNotify.message || 'Please follow up with patient'}`,
      status: 'sent',
      timestamp: new Date().toISOString(),
    };
    
    setLogs(prev => [newLog, ...prev]);
    setShowTeamNotifyDialog(false);
    setTeamNotify({ patientId: '', teamMember: '', message: '' });
    
    toast({
      title: "Team Notified",
      description: `${teamNotify.teamMember} has been notified about ${newLog.patientName}`,
    });
  };
  
  const handleQuickAction = (patientId: string, action: 'message' | 'video' | 'phone') => {
    setSelectedPatientForAction(patientId);
    if (action === 'message') {
      setNewMessage({ patientId, content: '' });
      setShowMessageDialog(true);
    } else if (action === 'video') {
      setVideoCall({ patientId, isInCall: false });
      setShowVideoDialog(true);
    } else if (action === 'phone') {
      setShowPhoneDialog(true);
    }
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

        <Card 
          className="cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => setShowAutoMessageDialog(true)}
        >
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

        <Card 
          className="cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => setShowTeamNotifyDialog(true)}
        >
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
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      title="Send Message"
                      onClick={() => handleQuickAction(patient.id, 'message')}
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      title="Video Call"
                      onClick={() => handleQuickAction(patient.id, 'video')}
                    >
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      title="Phone Call"
                      onClick={() => handleQuickAction(patient.id, 'phone')}
                    >
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
              <Label>Patient</Label>
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
              <Label>Message</Label>
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
            <Button onClick={handleSendMessage} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
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
              <Label>Patient</Label>
              <Select
                value={videoCall.patientId}
                onValueChange={(value) => setVideoCall(prev => ({ ...prev, patientId: value }))}
                disabled={videoCall.isInCall}
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
            <div className="p-4 rounded-lg bg-muted/50 text-center">
              {videoCall.isInCall ? (
                <>
                  <div className="relative mx-auto w-16 h-16 mb-2">
                    <Video className="h-12 w-12 mx-auto text-green-600 animate-pulse" />
                  </div>
                  <p className="text-sm text-green-600 font-medium">Call in progress...</p>
                  <p className="text-xs text-muted-foreground">Connected with {getPatientName(videoCall.patientId)}</p>
                </>
              ) : (
                <>
                  <Video className="h-12 w-12 mx-auto mb-2 text-green-600" />
                  <p className="text-sm text-muted-foreground">
                    Video call will be initiated when you click "Start Call"
                  </p>
                </>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowVideoDialog(false)} disabled={videoCall.isInCall}>
              Cancel
            </Button>
            <Button 
              onClick={handleStartVideoCall} 
              className="bg-green-600 hover:bg-green-700"
              disabled={videoCall.isInCall}
            >
              {videoCall.isInCall ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Video className="h-4 w-4 mr-2" />
              )}
              {videoCall.isInCall ? 'Connecting...' : 'Start Call'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Auto Message Dialog */}
      <Dialog open={showAutoMessageDialog} onOpenChange={setShowAutoMessageDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Automated Support Message</DialogTitle>
            <DialogDescription>
              Select a pre-configured message template to send
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Patient</Label>
              <Select 
                value={autoMessage.patientId}
                onValueChange={(value) => setAutoMessage(prev => ({ ...prev, patientId: value }))}
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
              <Label>Message Template</Label>
              <Select 
                value={autoMessage.template}
                onValueChange={(value) => setAutoMessage(prev => ({ ...prev, template: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="checkin">Check-in Reminder</SelectItem>
                  <SelectItem value="medication">Medication Reminder</SelectItem>
                  <SelectItem value="appointment">Appointment Reminder</SelectItem>
                  <SelectItem value="support">General Support</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAutoMessageDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendAutoMessage}>
              <Bell className="h-4 w-4 mr-2" />
              Send Auto Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Team Notify Dialog */}
      <Dialog open={showTeamNotifyDialog} onOpenChange={setShowTeamNotifyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Notify Care Team</DialogTitle>
            <DialogDescription>
              Alert a team member about a patient
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Patient</Label>
              <Select 
                value={teamNotify.patientId}
                onValueChange={(value) => setTeamNotify(prev => ({ ...prev, patientId: value }))}
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
              <Label>Team Member</Label>
              <Select 
                value={teamNotify.teamMember}
                onValueChange={(value) => setTeamNotify(prev => ({ ...prev, teamMember: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select team member" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Nurse Station">Nurse Station</SelectItem>
                  <SelectItem value="Counselor">Mental Health Counselor</SelectItem>
                  <SelectItem value="Financial Aid">Financial Aid Officer</SelectItem>
                  <SelectItem value="Social Worker">Social Worker</SelectItem>
                  <SelectItem value="Pharmacist">Pharmacist</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Message (Optional)</Label>
              <Textarea
                placeholder="Add a note for the team member..."
                value={teamNotify.message}
                onChange={(e) => setTeamNotify(prev => ({ ...prev, message: e.target.value }))}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTeamNotifyDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleNotifyTeam}>
              <Users className="h-4 w-4 mr-2" />
              Notify Team
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Phone Call Dialog */}
      <Dialog open={showPhoneDialog} onOpenChange={setShowPhoneDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Call Patient</DialogTitle>
            <DialogDescription>
              Initiate a phone call with the patient
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedPatientForAction && (
              <div className="p-4 rounded-lg border text-center">
                <p className="font-semibold text-lg">{getPatientName(selectedPatientForAction)}</p>
                <p className="text-muted-foreground">
                  {patients.find(p => p.id === selectedPatientForAction)?.contactPhone || '7200103309'}
                </p>
              </div>
            )}
            <div className="flex justify-center">
              <Button asChild className="bg-green-600 hover:bg-green-700">
                <a href={`tel:${patients.find(p => p.id === selectedPatientForAction)?.contactPhone || '7200103309'}`}>
                  <PhoneCall className="h-4 w-4 mr-2" />
                  Call Now
                </a>
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPhoneDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
