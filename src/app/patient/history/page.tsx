'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  History, 
  Calendar, 
  Stethoscope, 
  FlaskConical, 
  DollarSign, 
  Pill, 
  AlertCircle,
  FileText,
  Search,
  Download,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { mockTreatmentHistory, TreatmentEvent } from '@/lib/patient-data';

export default function HistoryPage() {
  const [events] = useState<TreatmentEvent[]>(mockTreatmentHistory);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set());

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || event.type === filterType;
    return matchesSearch && matchesType;
  });

  const toggleExpand = (id: string) => {
    setExpandedEvents(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'Appointment': return <Stethoscope className="h-4 w-4" />;
      case 'Lab Test': return <FlaskConical className="h-4 w-4" />;
      case 'Payment': return <DollarSign className="h-4 w-4" />;
      case 'Medication Change': return <Pill className="h-4 w-4" />;
      case 'Intervention': return <AlertCircle className="h-4 w-4" />;
      case 'Note': return <FileText className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'Appointment': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'Lab Test': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100';
      case 'Payment': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'Medication Change': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100';
      case 'Intervention': return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-100';
      case 'Note': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
      default: return '';
    }
  };

  const eventTypes = ['Appointment', 'Lab Test', 'Payment', 'Medication Change', 'Intervention', 'Note'];

  // Group events by month
  const groupedEvents = filteredEvents.reduce((acc, event) => {
    const monthYear = new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    acc[monthYear].push(event);
    return acc;
  }, {} as Record<string, TreatmentEvent[]>);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Treatment History</h1>
          <p className="text-muted-foreground">Complete timeline of your treatment journey</p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Download Summary
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search history..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {eventTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <Stethoscope className="h-4 w-4" />
              Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{events.filter(e => e.type === 'Appointment').length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <FlaskConical className="h-4 w-4" />
              Lab Tests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{events.filter(e => e.type === 'Lab Test').length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <DollarSign className="h-4 w-4" />
              Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{events.filter(e => e.type === 'Payment').length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <Pill className="h-4 w-4" />
              Med Changes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{events.filter(e => e.type === 'Medication Change').length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              Interventions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{events.filter(e => e.type === 'Intervention').length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Timeline
          </CardTitle>
          <CardDescription>
            {filteredEvents.length} events found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {Object.keys(groupedEvents).length > 0 ? (
            <div className="space-y-8">
              {Object.entries(groupedEvents).map(([monthYear, monthEvents]) => (
                <div key={monthYear}>
                  <h3 className="font-semibold text-lg mb-4 sticky top-0 bg-background py-2">
                    {monthYear}
                  </h3>
                  <div className="space-y-4 relative">
                    {/* Timeline line */}
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
                    
                    {monthEvents.map((event) => (
                      <div key={event.id} className="relative pl-10">
                        {/* Timeline dot */}
                        <div className={`absolute left-2 top-2 w-5 h-5 rounded-full flex items-center justify-center ${getEventColor(event.type)}`}>
                          {getEventIcon(event.type)}
                        </div>
                        
                        <div 
                          className="rounded-lg border p-4 cursor-pointer hover:border-primary transition-colors"
                          onClick={() => toggleExpand(event.id)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge className={getEventColor(event.type)}>
                                  {event.type}
                                </Badge>
                                <span className="text-sm text-muted-foreground">
                                  {new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                </span>
                              </div>
                              <h4 className="font-semibold">{event.title}</h4>
                              <p className="text-sm text-muted-foreground">{event.description}</p>
                            </div>
                            <Button variant="ghost" size="sm">
                              {expandedEvents.has(event.id) ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                          
                          {expandedEvents.has(event.id) && event.details && (
                            <div className="mt-4 pt-4 border-t">
                              <h5 className="text-sm font-medium mb-2">Details</h5>
                              <div className="grid grid-cols-2 gap-2">
                                {Object.entries(event.details).map(([key, value]) => (
                                  <div key={key} className="text-sm">
                                    <span className="text-muted-foreground capitalize">{key}: </span>
                                    <span className="font-medium">{value}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10">
              <History className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">No events found</p>
              <p className="text-sm text-muted-foreground">Try adjusting your search or filter</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
