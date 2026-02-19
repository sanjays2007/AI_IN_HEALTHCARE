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
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  Users,
  Activity,
  MessageSquare,
  Stethoscope,
  CheckCircle,
  XCircle,
  Phone,
} from 'lucide-react';
import { mockTodayAppointments, getAppointmentTypeColor, Appointment } from '@/lib/nurse-data';
import { useToast } from '@/hooks/use-toast';

export default function SchedulePage() {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState('2026-02-19');
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');
  const [appointments, setAppointments] = useState<Appointment[]>(mockTodayAppointments);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const openDetailDialog = (apt: Appointment) => {
    setSelectedAppointment(apt);
    setShowDetailDialog(true);
  };

  const handleStartAppointment = () => {
    if (!selectedAppointment) return;
    setAppointments(appointments.map(a =>
      a.id === selectedAppointment.id ? { ...a, status: 'in-progress' } : a
    ));
    setShowDetailDialog(false);
    toast({
      title: 'Appointment Started',
      description: `Appointment with ${selectedAppointment.patientName} is now in progress.`,
    });
  };

  const handleCompleteAppointment = () => {
    if (!selectedAppointment) return;
    setAppointments(appointments.map(a =>
      a.id === selectedAppointment.id ? { ...a, status: 'completed' } : a
    ));
    setShowDetailDialog(false);
    toast({
      title: 'Appointment Completed',
      description: `Appointment with ${selectedAppointment.patientName} has been marked as completed.`,
    });
  };

  const handleCancelAppointment = () => {
    if (!selectedAppointment) return;
    setAppointments(appointments.map(a =>
      a.id === selectedAppointment.id ? { ...a, status: 'cancelled' } : a
    ));
    setShowDetailDialog(false);
    toast({
      title: 'Appointment Cancelled',
      description: `Appointment with ${selectedAppointment.patientName} has been cancelled.`,
      variant: 'destructive',
    });
  };

  const handleCallPatient = () => {
    if (!selectedAppointment) return;
    toast({
      title: 'Calling Patient',
      description: `Initiating call to ${selectedAppointment.patientName}...`,
    });
  };

  const timeSlots = Array.from({ length: 10 }, (_, i) => {
    const hour = 8 + i;
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  const getAppointmentIcon = (type: string) => {
    switch (type) {
      case 'checkup': return <Stethoscope className="h-4 w-4" />;
      case 'medication': return <Activity className="h-4 w-4" />;
      case 'counseling': return <MessageSquare className="h-4 w-4" />;
      case 'vitals': return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Calendar className="h-8 w-8 text-teal-600" />
            Schedule
          </h1>
          <p className="text-muted-foreground">
            View and manage your daily appointments
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={viewMode} onValueChange={(v: 'day' | 'week') => setViewMode(v)}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Day View</SelectItem>
              <SelectItem value="week">Week View</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Date Navigation */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <Button variant="outline" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-center">
              <h2 className="text-xl font-semibold">
                {new Date(selectedDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </h2>
              <p className="text-sm text-muted-foreground">
                {appointments.length} appointments scheduled
              </p>
            </div>
            <Button variant="outline" size="icon">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{appointments.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Vitals Checks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {appointments.filter(a => a.type === 'vitals').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Checkups</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {appointments.filter(a => a.type === 'checkup').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Counseling</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pink-600">
              {appointments.filter(a => a.type === 'counseling').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Schedule Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Day Schedule</CardTitle>
          <CardDescription>Your appointments for the day</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {timeSlots.map((time) => {
              const slotAppointments = appointments.filter(a => {
                const aptHour = parseInt(a.time.split(':')[0]);
                const slotHour = parseInt(time.split(':')[0]);
                return aptHour === slotHour;
              });

              return (
                <div key={time} className="flex gap-4 min-h-[60px]">
                  <div className="w-16 text-sm text-muted-foreground pt-2">
                    {time}
                  </div>
                  <div className="flex-1 border-l pl-4 space-y-2">
                    {slotAppointments.length > 0 ? (
                      slotAppointments.map((apt) => (
                        <div
                          key={apt.id}
                          className={`p-3 rounded-lg border ${
                            apt.type === 'checkup' ? 'bg-blue-50 border-blue-200' :
                            apt.type === 'medication' ? 'bg-purple-50 border-purple-200' :
                            apt.type === 'counseling' ? 'bg-pink-50 border-pink-200' :
                            'bg-green-50 border-green-200'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                {getAppointmentIcon(apt.type)}
                                <span className="font-medium">{apt.patientName}</span>
                                <Badge className={getAppointmentTypeColor(apt.type)}>
                                  {apt.type}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {apt.time} • {apt.duration} min • {apt.room}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Doctor: {apt.doctor}
                              </p>
                            </div>
                            <Badge variant={
                              apt.status === 'completed' ? 'default' :
                              apt.status === 'in-progress' ? 'secondary' :
                              apt.status === 'cancelled' ? 'destructive' : 'outline'
                            }>
                              {apt.status}
                            </Badge>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="h-full min-h-[40px] border-b border-dashed" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming List */}
      <Card>
        <CardHeader>
          <CardTitle>Appointment List</CardTitle>
          <CardDescription>Quick overview of all appointments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {appointments.map((apt) => (
              <div key={apt.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-4">
                  <div className="text-center min-w-[60px]">
                    <p className="text-lg font-bold">{apt.time}</p>
                    <p className="text-xs text-muted-foreground">{apt.duration}min</p>
                  </div>
                  <div>
                    <p className="font-medium">{apt.patientName}</p>
                    <p className="text-sm text-muted-foreground">
                      {apt.doctor} • {apt.room}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getAppointmentTypeColor(apt.type)}>
                    {apt.type}
                  </Badge>
                  <Button size="sm" variant="outline" onClick={() => openDetailDialog(apt)}>View Details</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Appointment Details Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
            <DialogDescription>
              View and manage this appointment
            </DialogDescription>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Patient</p>
                  <p className="font-medium">{selectedAppointment.patientName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Patient ID</p>
                  <p className="font-medium">{selectedAppointment.patientId}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Time</p>
                  <p className="font-medium">{selectedAppointment.time}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-medium">{selectedAppointment.duration} minutes</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <Badge className={getAppointmentTypeColor(selectedAppointment.type)}>
                    {selectedAppointment.type}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant={
                    selectedAppointment.status === 'completed' ? 'default' :
                    selectedAppointment.status === 'in-progress' ? 'secondary' :
                    selectedAppointment.status === 'cancelled' ? 'destructive' : 'outline'
                  }>
                    {selectedAppointment.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Doctor</p>
                  <p className="font-medium">{selectedAppointment.doctor}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Room</p>
                  <p className="font-medium">{selectedAppointment.room}</p>
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={handleCallPatient}
                  className="flex-1"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call Patient
                </Button>
                {selectedAppointment.status === 'scheduled' && (
                  <Button
                    onClick={handleStartAppointment}
                    className="flex-1 bg-teal-600 hover:bg-teal-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Start
                  </Button>
                )}
                {selectedAppointment.status === 'in-progress' && (
                  <Button
                    onClick={handleCompleteAppointment}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Complete
                  </Button>
                )}
                {selectedAppointment.status !== 'cancelled' && selectedAppointment.status !== 'completed' && (
                  <Button
                    variant="destructive"
                    onClick={handleCancelAppointment}
                    className="flex-1"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
