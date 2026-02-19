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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  ClipboardList,
  Phone,
  MessageSquare,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Plus,
} from 'lucide-react';
import {
  mockFollowUps,
  getPriorityColor,
  getFollowUpStatusColor,
  FollowUp,
} from '@/lib/nurse-data';

export default function FollowUpsPage() {
  const [followUps, setFollowUps] = useState<FollowUp[]>(mockFollowUps);
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [selectedFollowUp, setSelectedFollowUp] = useState<FollowUp | null>(null);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [notes, setNotes] = useState('');

  const filteredFollowUps = followUps.filter(f => 
    priorityFilter === 'all' || f.priority === priorityFilter
  );

  const pendingFollowUps = filteredFollowUps.filter(f => f.status === 'pending');
  const completedFollowUps = filteredFollowUps.filter(f => f.status === 'completed');

  const handleComplete = () => {
    if (selectedFollowUp) {
      setFollowUps(followUps.map(f => 
        f.id === selectedFollowUp.id 
          ? { ...f, status: 'completed', notes: notes || f.notes }
          : f
      ));
      setShowCompleteDialog(false);
      setSelectedFollowUp(null);
      setNotes('');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'phone': return <Phone className="h-4 w-4" />;
      case 'visit': return <Calendar className="h-4 w-4" />;
      case 'message': return <MessageSquare className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <ClipboardList className="h-8 w-8 text-teal-600" />
            Follow-ups
          </h1>
          <p className="text-muted-foreground">
            Manage your scheduled patient follow-ups
          </p>
        </div>
        <Button className="bg-teal-600 hover:bg-teal-700">
          <Plus className="h-4 w-4 mr-2" />
          Schedule Follow-up
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {followUps.filter(f => f.status === 'pending').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-700">Urgent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {followUps.filter(f => f.priority === 'urgent' && f.status === 'pending').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Today's</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {followUps.filter(f => f.scheduledDate === '2026-02-19').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {followUps.filter(f => f.status === 'completed').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">
            Pending ({pendingFollowUps.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedFollowUps.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingFollowUps.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {pendingFollowUps.map((followUp) => (
                <Card key={followUp.id} className={followUp.priority === 'urgent' ? 'border-red-300' : ''}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{followUp.patientName}</CardTitle>
                        <CardDescription>{followUp.patientId}</CardDescription>
                      </div>
                      <Badge className={getPriorityColor(followUp.priority)}>
                        {followUp.priority}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        {getTypeIcon(followUp.type)}
                        <span className="capitalize">{followUp.type}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(followUp.scheduledDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{followUp.scheduledTime}</span>
                      </div>
                    </div>
                    <p className="text-sm font-medium">{followUp.reason}</p>
                    <p className="text-sm text-muted-foreground">{followUp.notes}</p>
                    <div className="flex gap-2 pt-2">
                      <Button 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => {
                          setSelectedFollowUp(followUp);
                          setShowCompleteDialog(true);
                        }}
                      >
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        Complete
                      </Button>
                      <Button size="sm" variant="outline">
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Reschedule
                      </Button>
                      {followUp.type === 'phone' && (
                        <Button size="sm" variant="outline">
                          <Phone className="h-4 w-4 mr-1" />
                          Call Now
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                No pending follow-ups
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedFollowUps.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {completedFollowUps.map((followUp) => (
                <Card key={followUp.id} className="bg-green-50 dark:bg-green-950/20">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{followUp.patientName}</CardTitle>
                        <CardDescription>{followUp.patientId}</CardDescription>
                      </div>
                      <Badge className={getFollowUpStatusColor(followUp.status)}>
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        {followUp.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        {getTypeIcon(followUp.type)}
                        <span className="capitalize">{followUp.type}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(followUp.scheduledDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <p className="text-sm">{followUp.reason}</p>
                    <p className="text-sm text-muted-foreground">{followUp.notes}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                No completed follow-ups yet
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Complete Dialog */}
      <Dialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Follow-up</DialogTitle>
            <DialogDescription>
              Mark this follow-up as completed for {selectedFollowUp?.patientName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Completion Notes</label>
              <Textarea
                placeholder="Enter notes about the follow-up outcome..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCompleteDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleComplete} className="bg-green-600 hover:bg-green-700">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Mark Complete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
