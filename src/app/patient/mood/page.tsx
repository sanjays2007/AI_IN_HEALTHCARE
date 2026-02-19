'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  Smile, 
  Meh, 
  Frown, 
  AlertCircle,
  TrendingUp,
  MessageCircle,
  Heart,
  HeartCrack,
  Clock, 
  Send, 
  CalendarDays
} from 'lucide-react';
import { mockMoodEntries, MoodEntry } from '@/lib/patient-data';

type MoodType = 'Good' | 'Neutral' | 'Stressed' | 'Hopeless' | 'Overwhelmed';

const moodOptions: { mood: MoodType; icon: React.ElementType; color: string; bgColor: string; description: string }[] = [
  { mood: 'Good', icon: Smile, color: 'text-green-600', bgColor: 'bg-green-100 dark:bg-green-900 hover:bg-green-200', description: 'Feeling positive and hopeful' },
  { mood: 'Neutral', icon: Meh, color: 'text-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-900 hover:bg-blue-200', description: 'Neither good nor bad' },
  { mood: 'Stressed', icon: Frown, color: 'text-yellow-600', bgColor: 'bg-yellow-100 dark:bg-yellow-900 hover:bg-yellow-200', description: 'Feeling anxious or worried' },
  { mood: 'Hopeless', icon: HeartCrack, color: 'text-orange-600', bgColor: 'bg-orange-100 dark:bg-orange-900 hover:bg-orange-200', description: 'Feeling down or without hope' },
  { mood: 'Overwhelmed', icon: AlertCircle, color: 'text-red-600', bgColor: 'bg-red-100 dark:bg-red-900 hover:bg-red-200', description: 'Feeling unable to cope' },
];

export default function MoodPage() {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>(mockMoodEntries);
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [notes, setNotes] = useState('');
  const [hasCheckedInToday, setHasCheckedInToday] = useState(
    moodEntries.some(e => e.date === new Date().toISOString().split('T')[0])
  );
  const [chatDialogOpen, setChatDialogOpen] = useState(false);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<{ sender: 'user' | 'counselor'; text: string }[]>([
    { sender: 'counselor', text: 'Hello! I\'m here to listen. How are you feeling today?' }
  ]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState('');
  const { toast } = useToast();

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    
    setChatMessages(prev => [...prev, { sender: 'user', text: chatMessage }]);
    setChatMessage('');
    
    // Simulate counselor response
    setTimeout(() => {
      setChatMessages(prev => [...prev, { 
        sender: 'counselor', 
        text: 'Thank you for sharing that with me. It takes courage to open up. Can you tell me more about what\'s been on your mind?' 
      }]);
    }, 1500);
  };

  const handleScheduleSession = () => {
    if (!selectedDate || !selectedTime) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please select both a date and time for your session.",
      });
      return;
    }
    
    setScheduleDialogOpen(false);
    toast({
      title: "Session Scheduled",
      description: `Your counseling session is booked for ${selectedDate.toLocaleDateString()} at ${selectedTime}.`,
    });
    setSelectedDate(undefined);
    setSelectedTime('');
  };

  const handleSubmit = () => {
    if (!selectedMood) {
      toast({
        variant: "destructive",
        title: "Please select a mood",
        description: "Let us know how you're feeling today.",
      });
      return;
    }

    const newEntry: MoodEntry = {
      id: `MOOD${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      mood: selectedMood,
      notes: notes || undefined,
    };

    setMoodEntries(prev => [newEntry, ...prev]);
    setHasCheckedInToday(true);
    setSelectedMood(null);
    setNotes('');

    // Show appropriate toast based on mood
    if (selectedMood === 'Hopeless' || selectedMood === 'Overwhelmed') {
      toast({
        title: "Thank you for sharing",
        description: "We understand this is difficult. A support team member will reach out to you soon. You're not alone.",
      });
    } else {
      toast({
        title: "Check-in recorded",
        description: "Thank you for sharing how you feel. Keep up with regular check-ins!",
      });
    }
  };

  const getMoodIcon = (mood: MoodType) => {
    const option = moodOptions.find(m => m.mood === mood);
    if (!option) return null;
    const Icon = option.icon;
    return <Icon className={`h-5 w-5 ${option.color}`} />;
  };

  const getMoodColor = (mood: MoodType) => {
    const option = moodOptions.find(m => m.mood === mood);
    return option?.color || '';
  };

  // Calculate mood stats
  const last30Days = moodEntries.filter(e => {
    const date = new Date(e.date);
    const monthAgo = new Date();
    monthAgo.setDate(monthAgo.getDate() - 30);
    return date >= monthAgo;
  });

  const moodCounts = last30Days.reduce((acc, entry) => {
    acc[entry.mood] = (acc[entry.mood] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const mostCommonMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] as MoodType | undefined;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mood Check-In</h1>
        <p className="text-muted-foreground">Your emotional well-being matters to us</p>
      </div>

      {/* Today's Check-In */}
      <Card className={hasCheckedInToday ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950' : ''}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            {hasCheckedInToday ? "Today's Check-In Complete" : "How are you feeling today?"}
          </CardTitle>
          <CardDescription>
            {hasCheckedInToday 
              ? "Thank you for checking in. Your well-being is important to us."
              : "Take a moment to reflect on your emotional state. This helps us support you better."}
          </CardDescription>
        </CardHeader>
        {!hasCheckedInToday && (
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {moodOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.mood}
                    onClick={() => setSelectedMood(option.mood)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                      selectedMood === option.mood 
                        ? `${option.bgColor} border-current ${option.color}` 
                        : 'border-border hover:border-muted-foreground'
                    }`}
                  >
                    <Icon className={`h-8 w-8 ${selectedMood === option.mood ? option.color : 'text-muted-foreground'}`} />
                    <span className="font-medium text-sm">{option.mood}</span>
                    <span className="text-xs text-muted-foreground text-center">{option.description}</span>
                  </button>
                );
              })}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Would you like to share more? (optional)
              </label>
              <Textarea
                placeholder="Share your thoughts, concerns, or what's on your mind..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>

            <Button onClick={handleSubmit} className="w-full md:w-auto">
              <MessageCircle className="mr-2 h-4 w-4" />
              Submit Check-In
            </Button>

            {(selectedMood === 'Hopeless' || selectedMood === 'Overwhelmed') && (
              <Card className="border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950">
                <CardContent className="pt-4">
                  <p className="text-sm text-purple-700 dark:text-purple-300">
                    <Heart className="inline mr-2 h-4 w-4" />
                    We understand that treatment can be challenging. Remember, you're not alone in this journey. 
                    If you submit this check-in, a member of our support team will reach out to you.
                  </p>
                </CardContent>
              </Card>
            )}
          </CardContent>
        )}
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Check-Ins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{moodEntries.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{last30Days.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Most Common</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {mostCommonMood && getMoodIcon(mostCommonMood)}
              <span className={`text-lg font-bold ${mostCommonMood ? getMoodColor(mostCommonMood) : ''}`}>
                {mostCommonMood || 'N/A'}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Positive Days</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {last30Days.filter(e => e.mood === 'Good').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Mood History
          </CardTitle>
          <CardDescription>Your emotional journey over time</CardDescription>
        </CardHeader>
        <CardContent>
          {moodEntries.length > 0 ? (
            <div className="space-y-3">
              {moodEntries.map((entry) => (
                <div key={entry.id} className="flex items-start gap-4 p-3 rounded-lg border">
                  <div className={`rounded-full p-2 ${moodOptions.find(m => m.mood === entry.mood)?.bgColor || 'bg-muted'}`}>
                    {getMoodIcon(entry.mood)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${getMoodColor(entry.mood)}`}>{entry.mood}</span>
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <CalendarDays className="h-3 w-3" />
                        {new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    {entry.notes && (
                      <p className="mt-1 text-sm text-muted-foreground">{entry.notes}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10">
              <Heart className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">No check-ins yet</p>
              <p className="text-sm text-muted-foreground">Start tracking your mood above</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Support Info */}
      <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
            <MessageCircle className="h-5 w-5" />
            Need Someone to Talk To?
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-blue-700 dark:text-blue-300">
          <p className="mb-4">
            Emotional support is available 24/7. You don&apos;t have to face this alone.
          </p>
          <div className="flex flex-wrap gap-2">
            <Dialog open={chatDialogOpen} onOpenChange={setChatDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-blue-300">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Chat with Counselor
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-blue-600" />
                    Chat with Counselor
                  </DialogTitle>
                  <DialogDescription>
                    Our counselors are here to support you. Messages are confidential.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col h-[300px]">
                  <div className="flex-1 overflow-y-auto space-y-3 p-3 border rounded-lg bg-muted/30">
                    {chatMessages.map((msg, idx) => (
                      <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-3 rounded-lg text-sm ${
                          msg.sender === 'user' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted'
                        }`}>
                          {msg.text}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Textarea
                      placeholder="Type your message..."
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      rows={2}
                      className="flex-1"
                    />
                    <Button onClick={handleSendMessage} size="icon" className="h-auto">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            <Dialog open={scheduleDialogOpen} onOpenChange={setScheduleDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-blue-300">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  Schedule Counseling Session
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <CalendarDays className="h-5 w-5 text-blue-600" />
                    Schedule Counseling Session
                  </DialogTitle>
                  <DialogDescription>
                    Book a private session with one of our counselors.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="flex justify-center">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date < new Date() || date.getDay() === 0}
                      className="rounded-md border"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="time">Select Time</Label>
                    <Select value={selectedTime} onValueChange={setSelectedTime}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a time slot" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="09:00 AM">09:00 AM</SelectItem>
                        <SelectItem value="10:00 AM">10:00 AM</SelectItem>
                        <SelectItem value="11:00 AM">11:00 AM</SelectItem>
                        <SelectItem value="02:00 PM">02:00 PM</SelectItem>
                        <SelectItem value="03:00 PM">03:00 PM</SelectItem>
                        <SelectItem value="04:00 PM">04:00 PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {selectedDate && selectedTime && (
                    <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
                      <p className="text-sm text-green-700 dark:text-green-300">
                        <strong>Your session:</strong> {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at {selectedTime}
                      </p>
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setScheduleDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleScheduleSession}>
                    <Clock className="mr-2 h-4 w-4" />
                    Confirm Booking
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
