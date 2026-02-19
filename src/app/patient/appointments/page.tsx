'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Video, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Car,
  RefreshCw,
  User
} from 'lucide-react';
import { mockAppointments, Appointment } from '@/lib/patient-data';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [rescheduleDialogOpen, setRescheduleDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [transportDialogOpen, setTransportDialogOpen] = useState(false);
  const [transportRequest, setTransportRequest] = useState({
    appointmentId: '',
    reason: '',
    pickupAddress: '',
    specialNeeds: ''
  });
  const { toast } = useToast();

  const upcomingAppointments = appointments.filter(a => a.status === 'Scheduled' || a.status === 'Confirmed');
  const pastAppointments = appointments.filter(a => a.status === 'Completed' || a.status === 'Cancelled');

  const handleConfirm = (id: string) => {
    setAppointments(prev => prev.map(apt => 
      apt.id === id ? { ...apt, status: 'Confirmed' as const } : apt
    ));
    toast({
      title: "Appointment Confirmed",
      description: "Your appointment has been confirmed. We'll see you there!",
    });
  };

  const handleCancel = (id: string) => {
    setAppointments(prev => prev.map(apt => 
      apt.id === id ? { ...apt, status: 'Cancelled' as const } : apt
    ));
    toast({
      variant: "destructive",
      title: "Appointment Cancelled",
      description: "Your appointment has been cancelled. Please reschedule if needed.",
    });
  };

  const handleReschedule = () => {
    if (selectedAppointment && selectedDate) {
      setAppointments(prev => prev.map(apt => 
        apt.id === selectedAppointment.id 
          ? { ...apt, date: selectedDate.toISOString().split('T')[0], status: 'Rescheduled' as const } 
          : apt
      ));
      setRescheduleDialogOpen(false);
      toast({
        title: "Appointment Rescheduled",
        description: `Your appointment has been moved to ${selectedDate.toLocaleDateString()}.`,
      });
    }
  };

  const handleTransportRequest = () => {
    if (!transportRequest.appointmentId) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please select an appointment for transport assistance.",
      });
      return;
    }
    
    // Mark the selected appointment as having transport assistance
    setAppointments(prev => prev.map(apt => 
      apt.id === transportRequest.appointmentId 
        ? { ...apt, transportAssistance: true } 
        : apt
    ));
    
    setTransportDialogOpen(false);
    setTransportRequest({ appointmentId: '', reason: '', pickupAddress: '', specialNeeds: '' });
    
    toast({
      title: "Transport Request Submitted",
      description: "Your transport assistance request has been submitted. You'll be notified once it's confirmed.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'Scheduled': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'Completed': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
      case 'Cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      case 'Rescheduled': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      default: return '';
    }
  };

  const AppointmentCard = ({ appointment }: { appointment: Appointment }) => (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {appointment.type === 'Tele-Consult' ? (
              <div className="rounded-full bg-purple-100 p-2 dark:bg-purple-900">
                <Video className="h-5 w-5 text-purple-600" />
              </div>
            ) : (
              <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900">
                <CalendarIcon className="h-5 w-5 text-blue-600" />
              </div>
            )}
            <div>
              <CardTitle className="text-lg">{appointment.type}</CardTitle>
              <CardDescription>{appointment.doctor}</CardDescription>
            </div>
          </div>
          <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          <span>{new Date(appointment.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>{appointment.time}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span>{appointment.location}</span>
        </div>
        {appointment.travelTime && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Car className="h-4 w-4" />
            <span>Estimated travel: {appointment.travelTime}</span>
          </div>
        )}
        {appointment.transportAssistance && (
          <Badge variant="outline" className="text-xs">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Transport assistance available
          </Badge>
        )}
        {appointment.notes && (
          <div className="rounded-lg bg-muted p-3 text-sm">
            <p className="font-medium text-xs text-muted-foreground mb-1">Notes</p>
            <p>{appointment.notes}</p>
          </div>
        )}
      </CardContent>
      {(appointment.status === 'Scheduled' || appointment.status === 'Rescheduled') && (
        <CardFooter className="flex gap-2 pt-0">
          <Button size="sm" onClick={() => handleConfirm(appointment.id)} className="flex-1">
            <CheckCircle2 className="mr-1 h-4 w-4" />
            Confirm
          </Button>
          <Dialog open={rescheduleDialogOpen && selectedAppointment?.id === appointment.id} onOpenChange={setRescheduleDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                size="sm" 
                variant="outline" 
                className="flex-1"
                onClick={() => setSelectedAppointment(appointment)}
              >
                <RefreshCw className="mr-1 h-4 w-4" />
                Reschedule
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Reschedule Appointment</DialogTitle>
                <DialogDescription>
                  Select a new date for your {appointment.type} with {appointment.doctor}
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-center py-4">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date()}
                  className="rounded-md border"
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setRescheduleDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleReschedule}>Confirm New Date</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleCancel(appointment.id)}>
            <XCircle className="h-4 w-4" />
          </Button>
        </CardFooter>
      )}
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
        <p className="text-muted-foreground">Manage your upcoming and past appointments</p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingAppointments.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Confirmed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{appointments.filter(a => a.status === 'Confirmed').length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{appointments.filter(a => a.status === 'Completed').length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tele-Consults</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{appointments.filter(a => a.type === 'Tele-Consult').length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming ({upcomingAppointments.length})</TabsTrigger>
          <TabsTrigger value="past">Past ({pastAppointments.length})</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingAppointments.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {upcomingAppointments.map(apt => (
                <AppointmentCard key={apt.id} appointment={apt} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <CalendarIcon className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">No upcoming appointments</p>
                <p className="text-sm text-muted-foreground">Contact your healthcare provider to schedule</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {pastAppointments.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {pastAppointments.map(apt => (
                <AppointmentCard key={apt.id} appointment={apt} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <CalendarIcon className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">No past appointments</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle>Calendar View</CardTitle>
              <CardDescription>View your appointments on a calendar</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row gap-6">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
                modifiers={{
                  appointment: appointments.map(a => new Date(a.date)),
                }}
                modifiersStyles={{
                  appointment: { 
                    fontWeight: 'bold',
                    backgroundColor: 'hsl(var(--primary))',
                    color: 'white',
                    borderRadius: '50%'
                  }
                }}
              />
              <div className="flex-1">
                <h3 className="font-medium mb-3">
                  {selectedDate?.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </h3>
                {appointments.filter(a => 
                  new Date(a.date).toDateString() === selectedDate?.toDateString()
                ).length > 0 ? (
                  <div className="space-y-2">
                    {appointments.filter(a => 
                      new Date(a.date).toDateString() === selectedDate?.toDateString()
                    ).map(apt => (
                      <div key={apt.id} className="flex items-center gap-3 p-3 rounded-lg border">
                        <div className={`w-2 h-2 rounded-full ${
                          apt.status === 'Confirmed' ? 'bg-green-500' : 
                          apt.status === 'Scheduled' ? 'bg-blue-500' : 'bg-gray-500'
                        }`} />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{apt.type}</p>
                          <p className="text-xs text-muted-foreground">{apt.time} - {apt.doctor}</p>
                        </div>
                        <Badge className={getStatusColor(apt.status)} variant="outline">{apt.status}</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">No appointments on this date</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Transport Assistance Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            Transport Assistance
          </CardTitle>
          <CardDescription>Need help getting to your appointments?</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            If you&apos;re facing difficulties with transportation, you may be eligible for transport assistance. 
            This service provides free or subsidized transportation to and from your medical appointments.
          </p>
          <Dialog open={transportDialogOpen} onOpenChange={setTransportDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <AlertCircle className="mr-2 h-4 w-4" />
                Request Transport Assistance
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Request Transport Assistance</DialogTitle>
                <DialogDescription>
                  Fill out this form to request free or subsidized transportation to your appointment.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="appointment">Select Appointment</Label>
                  <Select 
                    value={transportRequest.appointmentId}
                    onValueChange={(value) => setTransportRequest(prev => ({ ...prev, appointmentId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose an appointment" />
                    </SelectTrigger>
                    <SelectContent>
                      {upcomingAppointments.filter(a => !a.transportAssistance).map(apt => (
                        <SelectItem key={apt.id} value={apt.id}>
                          {apt.type} - {new Date(apt.date).toLocaleDateString()} at {apt.time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="pickupAddress">Pickup Address</Label>
                  <Textarea
                    id="pickupAddress"
                    placeholder="Enter your full pickup address..."
                    value={transportRequest.pickupAddress}
                    onChange={(e) => setTransportRequest(prev => ({ ...prev, pickupAddress: e.target.value }))}
                    rows={2}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="reason">Reason for Request</Label>
                  <Select 
                    value={transportRequest.reason}
                    onValueChange={(value) => setTransportRequest(prev => ({ ...prev, reason: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a reason" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no-vehicle">No personal vehicle</SelectItem>
                      <SelectItem value="medical-condition">Medical condition prevents driving</SelectItem>
                      <SelectItem value="financial">Financial constraints</SelectItem>
                      <SelectItem value="distance">Long distance to facility</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="specialNeeds">Special Needs (Optional)</Label>
                  <Textarea
                    id="specialNeeds"
                    placeholder="Wheelchair access, oxygen support, etc..."
                    value={transportRequest.specialNeeds}
                    onChange={(e) => setTransportRequest(prev => ({ ...prev, specialNeeds: e.target.value }))}
                    rows={2}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setTransportDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleTransportRequest}>
                  <Car className="mr-2 h-4 w-4" />
                  Submit Request
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}
