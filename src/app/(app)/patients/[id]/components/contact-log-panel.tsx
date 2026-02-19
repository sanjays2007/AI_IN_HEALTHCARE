'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Calendar as CalendarIcon, ClipboardList } from 'lucide-react';
import { useState, useTransition } from 'react';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const contactModes = ['Call', 'SMS', 'Home Visit', 'Tele-consult'];
const patientResponses = [
  'Cooperative',
  'Financial Concern',
  'Emotional Distress',
  'Severe Side Effect',
  'No Response',
];
const interactionStatuses = ['Resolved', 'Monitoring', 'Escalated'];

export default function ContactLogPanel() {
  const [contactMode, setContactMode] = useState<string>('');
  const [patientResponse, setPatientResponse] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [nextFollowUp, setNextFollowUp] = useState<Date | undefined>();
  const [status, setStatus] = useState<string>('');
  const [isLogging, startLoggingTransition] = useTransition();
  const { toast } = useToast();

  const handleLogContact = () => {
    startLoggingTransition(() => {
      // In a real app, this would be saved to a database.
      console.log({
        contactMode,
        patientResponse,
        notes,
        nextFollowUp,
        status,
      });

      toast({
        title: 'Contact Logged',
        description: 'The patient interaction has been saved.',
      });

      // Reset form
      setContactMode('');
      setPatientResponse('');
      setNotes('');
      setNextFollowUp(undefined);
      setStatus('');
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClipboardList className="text-primary" />
          <span>Log Patient Contact</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="contact-mode">Contact Mode</Label>
            <Select
              value={contactMode}
              onValueChange={setContactMode}
              disabled={isLogging}
            >
              <SelectTrigger id="contact-mode">
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
              <SelectContent>
                {contactModes.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="patient-response">Patient Response</Label>
            <Select
              value={patientResponse}
              onValueChange={setPatientResponse}
              disabled={isLogging}
            >
              <SelectTrigger id="patient-response">
                <SelectValue placeholder="Select response" />
              </SelectTrigger>
              <SelectContent>
                {patientResponses.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            placeholder="Log details of the interaction..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            disabled={isLogging}
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="next-follow-up">Next Follow-Up</Label>
                <Popover>
                <PopoverTrigger asChild>
                    <Button
                    variant={'outline'}
                    className={cn(
                        'w-full justify-start text-left font-normal',
                        !nextFollowUp && 'text-muted-foreground'
                    )}
                    >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {nextFollowUp ? format(nextFollowUp, 'PPP') : <span>Pick a date</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Calendar
                    mode="single"
                    selected={nextFollowUp}
                    onSelect={setNextFollowUp}
                    initialFocus
                    />
                </PopoverContent>
                </Popover>
            </div>

            <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={setStatus} disabled={isLogging}>
                <SelectTrigger id="status">
                    <SelectValue placeholder="Set status" />
                </SelectTrigger>
                <SelectContent>
                    {interactionStatuses.map((option) => (
                    <SelectItem key={option} value={option}>
                        {option}
                    </SelectItem>
                    ))}
                </SelectContent>
                </Select>
            </div>
        </div>

        <Button
          onClick={handleLogContact}
          disabled={isLogging || !contactMode || !patientResponse}
          className="w-full"
        >
          {isLogging ? 'Logging...' : 'Log Interaction'}
        </Button>
      </CardContent>
    </Card>
  );
}
