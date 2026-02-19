'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { 
  HeadphonesIcon, 
  Phone, 
  MessageCircle, 
  Video, 
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Heart,
  DollarSign,
  UserCog,
  Bot,
  Send,
  User,
  PhoneCall
} from 'lucide-react';
import { mockSupportRequests, SupportRequest } from '@/lib/patient-data';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  message: string;
  timestamp: Date;
}

export default function SupportPage() {
  const [requests, setRequests] = useState<SupportRequest[]>(mockSupportRequests);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [requestType, setRequestType] = useState<string>('');
  const [requestNotes, setRequestNotes] = useState('');
  const { toast } = useToast();
  
  // Live Chat state
  const [liveChatOpen, setLiveChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'bot',
      message: 'Hello! Welcome to Silent Guardian support. How can I help you today?',
      timestamp: new Date(),
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Video Consult state
  const [videoConsultOpen, setVideoConsultOpen] = useState(false);
  const [consultDate, setConsultDate] = useState('');
  const [consultTime, setConsultTime] = useState('');
  const [consultReason, setConsultReason] = useState('');

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      message: currentMessage,
      timestamp: new Date(),
    };

    setChatMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botResponses = [
        "I understand your concern. Let me help you with that.",
        "Thank you for reaching out. Our team is here to support you through your treatment journey.",
        "I've noted your query. Would you like me to connect you with a specialist?",
        "That's a great question. Based on your treatment plan, here's what I can tell you...",
        "I'm sorry you're experiencing this. Let me see how we can assist you.",
      ];
      
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        message: botResponses[Math.floor(Math.random() * botResponses.length)],
        timestamp: new Date(),
      };

      setChatMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleScheduleVideoConsult = () => {
    if (!consultDate || !consultTime) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please select a date and time for your consultation.",
      });
      return;
    }

    toast({
      title: "Video Consultation Scheduled",
      description: `Your video consultation is scheduled for ${consultDate} at ${consultTime}.`,
    });

    setVideoConsultOpen(false);
    setConsultDate('');
    setConsultTime('');
    setConsultReason('');
  };

  const handleSubmitRequest = () => {
    if (!requestType) {
      toast({
        variant: "destructive",
        title: "Please select a request type",
      });
      return;
    }

    const newRequest: SupportRequest = {
      id: `SUP${Date.now()}`,
      type: requestType as SupportRequest['type'],
      status: 'Pending',
      requestDate: new Date().toISOString().split('T')[0],
      notes: requestNotes || undefined,
    };

    setRequests(prev => [newRequest, ...prev]);
    setDialogOpen(false);
    setRequestType('');
    setRequestNotes('');

    toast({
      title: "Request Submitted",
      description: "A team member will contact you soon.",
    });
  };

  const supportOptions = [
    {
      type: 'Nurse Callback',
      icon: Phone,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100 dark:bg-blue-900',
      description: 'Request a callback from nursing staff',
      responseTime: '1-2 hours',
    },
    {
      type: 'Counseling',
      icon: Heart,
      color: 'text-pink-500',
      bgColor: 'bg-pink-100 dark:bg-pink-900',
      description: 'Book an emotional support session',
      responseTime: '24 hours',
    },
    {
      type: 'Financial Counseling',
      icon: DollarSign,
      color: 'text-green-500',
      bgColor: 'bg-green-100 dark:bg-green-900',
      description: 'Get help with treatment costs',
      responseTime: '1-2 business days',
    },
    {
      type: 'General',
      icon: MessageCircle,
      color: 'text-purple-500',
      bgColor: 'bg-purple-100 dark:bg-purple-900',
      description: 'General questions and support',
      responseTime: '2-4 hours',
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"><CheckCircle2 className="mr-1 h-3 w-3" />Completed</Badge>;
      case 'Pending':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"><Clock className="mr-1 h-3 w-3" />Pending</Badge>;
      case 'In Progress':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"><UserCog className="mr-1 h-3 w-3" />In Progress</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Help & Support</h1>
        <p className="text-muted-foreground">We&apos;re here to help you every step of the way</p>
      </div>

      {/* Quick Access Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {supportOptions.map((option) => {
          const Icon = option.icon;
          return (
            <Card key={option.type} className="hover:border-primary transition-colors cursor-pointer" onClick={() => {
              setRequestType(option.type);
              setDialogOpen(true);
            }}>
              <CardHeader className="pb-2">
                <div className={`rounded-full p-3 w-fit ${option.bgColor}`}>
                  <Icon className={`h-6 w-6 ${option.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold">{option.type}</h3>
                <p className="text-sm text-muted-foreground">{option.description}</p>
                <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Response: {option.responseTime}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Request Form Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Support</DialogTitle>
            <DialogDescription>
              Submit a request and our team will get back to you.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Type of Support *</Label>
              <Select value={requestType} onValueChange={setRequestType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select support type" />
                </SelectTrigger>
                <SelectContent>
                  {supportOptions.map((option) => (
                    <SelectItem key={option.type} value={option.type}>
                      {option.type}
                    </SelectItem>
                  ))}
                  <SelectItem value="Emergency">Emergency Support</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Additional Details (optional)</Label>
              <Textarea
                placeholder="Tell us more about how we can help..."
                value={requestNotes}
                onChange={(e) => setRequestNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmitRequest}>Submit Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Emergency Contact */}
      <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-800 dark:text-red-200">
            <AlertCircle className="h-5 w-5" />
            Emergency Contact
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-700 dark:text-red-300 mb-4">
            If you&apos;re experiencing a medical emergency, call emergency services immediately or contact our 24/7 emergency line.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button variant="destructive">
              <Phone className="mr-2 h-4 w-4" />
              Emergency: 911
            </Button>
            <Button variant="outline" className="border-red-300 text-red-700">
              <Phone className="mr-2 h-4 w-4" />
              Hospital Emergency Line
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Contact Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HeadphonesIcon className="h-5 w-5" />
            Contact Options
          </CardTitle>
          <CardDescription>Multiple ways to reach our support team</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {/* Phone Support */}
            <div className="p-4 rounded-lg border">
              <Phone className="h-8 w-8 text-blue-500 mb-2" />
              <h4 className="font-semibold">Phone Support</h4>
              <p className="text-sm text-muted-foreground">Call our helpline</p>
              <p className="text-lg font-bold mt-2">7200103309</p>
              <p className="text-xs text-muted-foreground">Mon-Fri, 8AM-8PM</p>
              <Button className="mt-2" size="sm" variant="outline" asChild>
                <a href="tel:7200103309">
                  <PhoneCall className="mr-2 h-4 w-4" />
                  Call Now
                </a>
              </Button>
            </div>
            
            {/* Live Chat */}
            <div className="p-4 rounded-lg border">
              <MessageCircle className="h-8 w-8 text-green-500 mb-2" />
              <h4 className="font-semibold">Live Chat</h4>
              <p className="text-sm text-muted-foreground">Chat with an assistant</p>
              <Dialog open={liveChatOpen} onOpenChange={setLiveChatOpen}>
                <DialogTrigger asChild>
                  <Button className="mt-2" size="sm">
                    <Bot className="mr-2 h-4 w-4" />
                    Start Chat
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px] h-[600px] flex flex-col">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <MessageCircle className="h-5 w-5 text-green-500" />
                      Live Support Chat
                    </DialogTitle>
                    <DialogDescription>
                      Chat with our support assistant for immediate help
                    </DialogDescription>
                  </DialogHeader>
                  <ScrollArea className="flex-1 pr-4 border rounded-lg p-4">
                    <div className="space-y-4">
                      {chatMessages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg p-3 ${
                              msg.sender === 'user'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              {msg.sender === 'bot' ? (
                                <Bot className="h-4 w-4" />
                              ) : (
                                <User className="h-4 w-4" />
                              )}
                              <span className="text-xs opacity-70">
                                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-sm">{msg.message}</p>
                          </div>
                        </div>
                      ))}
                      {isTyping && (
                        <div className="flex justify-start">
                          <div className="bg-muted rounded-lg p-3">
                            <div className="flex items-center gap-2">
                              <Bot className="h-4 w-4" />
                              <span className="text-sm">Typing...</span>
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={chatEndRef} />
                    </div>
                  </ScrollArea>
                  <div className="flex gap-2 mt-4">
                    <Input
                      placeholder="Type your message..."
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button onClick={handleSendMessage} disabled={!currentMessage.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            {/* Video Consult */}
            <div className="p-4 rounded-lg border">
              <Video className="h-8 w-8 text-purple-500 mb-2" />
              <h4 className="font-semibold">Video Consult</h4>
              <p className="text-sm text-muted-foreground">Face-to-face support</p>
              <Dialog open={videoConsultOpen} onOpenChange={setVideoConsultOpen}>
                <DialogTrigger asChild>
                  <Button className="mt-2" size="sm" variant="outline">
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Video className="h-5 w-5 text-purple-500" />
                      Schedule Video Consultation
                    </DialogTitle>
                    <DialogDescription>
                      Book a face-to-face video call with our support team
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="consultDate">Preferred Date</Label>
                      <Input
                        id="consultDate"
                        type="date"
                        value={consultDate}
                        onChange={(e) => setConsultDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="consultTime">Preferred Time</Label>
                      <Select value={consultTime} onValueChange={setConsultTime}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a time slot" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="09:00">9:00 AM</SelectItem>
                          <SelectItem value="10:00">10:00 AM</SelectItem>
                          <SelectItem value="11:00">11:00 AM</SelectItem>
                          <SelectItem value="14:00">2:00 PM</SelectItem>
                          <SelectItem value="15:00">3:00 PM</SelectItem>
                          <SelectItem value="16:00">4:00 PM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="consultReason">Reason for Consultation (Optional)</Label>
                      <Textarea
                        id="consultReason"
                        placeholder="Briefly describe what you'd like to discuss..."
                        value={consultReason}
                        onChange={(e) => setConsultReason(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setVideoConsultOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleScheduleVideoConsult}>
                      <Calendar className="mr-2 h-4 w-4" />
                      Schedule Consultation
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Your Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Your Support Requests</CardTitle>
          <CardDescription>Track the status of your requests</CardDescription>
        </CardHeader>
        <CardContent>
          {requests.length > 0 ? (
            <div className="space-y-3">
              {requests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-4">
                    <div className={`rounded-full p-2 ${
                      request.type === 'Nurse Callback' ? 'bg-blue-100 dark:bg-blue-900' :
                      request.type === 'Counseling' ? 'bg-pink-100 dark:bg-pink-900' :
                      request.type === 'Financial Counseling' ? 'bg-green-100 dark:bg-green-900' :
                      'bg-purple-100 dark:bg-purple-900'
                    }`}>
                      {request.type === 'Nurse Callback' && <Phone className="h-4 w-4 text-blue-500" />}
                      {request.type === 'Counseling' && <Heart className="h-4 w-4 text-pink-500" />}
                      {request.type === 'Financial Counseling' && <DollarSign className="h-4 w-4 text-green-500" />}
                      {request.type === 'General' && <MessageCircle className="h-4 w-4 text-purple-500" />}
                      {request.type === 'Emergency' && <AlertCircle className="h-4 w-4 text-red-500" />}
                    </div>
                    <div>
                      <p className="font-medium">{request.type}</p>
                      <p className="text-sm text-muted-foreground">
                        Requested: {new Date(request.requestDate).toLocaleDateString()}
                        {request.completedDate && ` | Completed: ${new Date(request.completedDate).toLocaleDateString()}`}
                      </p>
                      {request.notes && (
                        <p className="text-sm text-muted-foreground mt-1">{request.notes}</p>
                      )}
                    </div>
                  </div>
                  {getStatusBadge(request.status)}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10">
              <HeadphonesIcon className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">No support requests</p>
              <p className="text-sm text-muted-foreground">Use the options above to request support</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Support Team */}
      <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Heart className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-1">Your Care Team</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                You have a dedicated care team supporting you throughout your treatment journey. 
                Don&apos;t hesitate to reach out whenever you need help - we&apos;re here for you.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
