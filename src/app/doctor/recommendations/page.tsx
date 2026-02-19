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
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Brain,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingDown,
  AlertTriangle,
  ChevronRight,
  Filter,
  Undo2,
} from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import {
  mockAIRecommendations,
  mockPatientRiskProfiles,
  AIRecommendation,
  formatDateTime,
} from '@/lib/doctor-data';

export default function AIRecommendationsPage() {
  const [recommendations, setRecommendations] = useState(mockAIRecommendations);
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'ignored'>('pending');
  const [showIgnoreDialog, setShowIgnoreDialog] = useState(false);
  const [selectedRec, setSelectedRec] = useState<AIRecommendation | null>(null);
  const [ignoreReason, setIgnoreReason] = useState('');
  const { toast } = useToast();

  const getPatientName = (patientId: string) => {
    const patient = mockPatientRiskProfiles.find(p => p.id === patientId);
    return patient?.name || 'Unknown Patient';
  };

  const filteredRecs = recommendations.filter(rec => {
    if (filter === 'all') return true;
    return rec.status === filter;
  });

  const handleAccept = (rec: AIRecommendation) => {
    setRecommendations(prev => 
      prev.map(r => r.id === rec.id ? { ...r, status: 'accepted' as const } : r)
    );
    toast({
      title: "Recommendation Accepted",
      description: `${rec.title} intervention initiated for ${getPatientName(rec.patientId)}`,
    });
  };

  const openIgnoreDialog = (rec: AIRecommendation) => {
    setSelectedRec(rec);
    setIgnoreReason('');
    setShowIgnoreDialog(true);
  };

  const confirmIgnore = () => {
    if (!selectedRec) return;
    
    setRecommendations(prev => 
      prev.map(r => r.id === selectedRec.id ? { ...r, status: 'ignored' as const, ignoreReason } : r)
    );
    
    toast({
      title: "Recommendation Ignored",
      description: `Decision recorded for ${getPatientName(selectedRec.patientId)}`,
    });
    
    setShowIgnoreDialog(false);
  };

  const handleUndo = (rec: AIRecommendation) => {
    setRecommendations(prev => 
      prev.map(r => r.id === rec.id ? { ...r, status: 'pending' as const, ignoreReason: undefined } : r)
    );
    toast({
      title: "Recommendation Restored",
      description: `${rec.title} moved back to pending review`,
    });
  };

  const pendingCount = recommendations.filter(r => r.status === 'pending').length;
  const acceptedCount = recommendations.filter(r => r.status === 'accepted').length;
  const ignoredCount = recommendations.filter(r => r.status === 'ignored').length;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-50 dark:bg-red-900/10 border-red-300';
      case 'high': return 'bg-orange-50 dark:bg-orange-900/10 border-orange-300';
      case 'moderate': return 'bg-yellow-50 dark:bg-yellow-900/10 border-yellow-300';
      default: return 'bg-muted/50';
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      dosage_adjustment: 'Dosage Adjustment',
      tele_consult: 'Telehealth Consult',
      financial_referral: 'Financial Referral',
      nurse_followup: 'Nurse Follow-up',
      education_intervention: 'Education',
      mental_health_support: 'Mental Health Support',
    };
    return labels[type] || type;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Brain className="h-8 w-8 text-blue-600" />
            AI Recommendations
          </h1>
          <p className="text-muted-foreground">
            Smart intervention suggestions based on patient risk profiles
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card 
          className={`cursor-pointer transition-colors ${filter === 'pending' ? 'ring-2 ring-blue-500' : ''}`}
          onClick={() => setFilter('pending')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">Awaiting your decision</p>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer transition-colors ${filter === 'accepted' ? 'ring-2 ring-blue-500' : ''}`}
          onClick={() => setFilter('accepted')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accepted</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{acceptedCount}</div>
            <p className="text-xs text-muted-foreground">Interventions initiated</p>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer transition-colors ${filter === 'ignored' ? 'ring-2 ring-blue-500' : ''}`}
          onClick={() => setFilter('ignored')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ignored</CardTitle>
            <XCircle className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{ignoredCount}</div>
            <p className="text-xs text-muted-foreground">Declined recommendations</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Filter:</span>
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          All ({recommendations.length})
        </Button>
        <Button
          variant={filter === 'pending' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('pending')}
        >
          Pending ({pendingCount})
        </Button>
        <Button
          variant={filter === 'accepted' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('accepted')}
        >
          Accepted ({acceptedCount})
        </Button>
        <Button
          variant={filter === 'ignored' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('ignored')}
        >
          Ignored ({ignoredCount})
        </Button>
      </div>

      {/* Recommendations List */}
      <div className="space-y-4">
        {filteredRecs.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
              <p className="text-lg font-medium">No recommendations in this category</p>
              <p className="text-sm text-muted-foreground">
                {filter === 'pending' ? 'All recommendations have been reviewed!' : 'Try a different filter'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredRecs.map((rec) => (
            <Card 
              key={rec.id}
              className={`${getPriorityColor(rec.priority)} ${
                rec.status === 'ignored' ? 'opacity-60' : ''
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Link 
                        href={`/doctor/patients/${rec.patientId}`}
                        className="font-semibold text-blue-600 hover:underline"
                      >
                        {getPatientName(rec.patientId)}
                      </Link>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      <Badge variant="outline">{getTypeLabel(rec.type)}</Badge>
                      <Badge variant={rec.priority === 'critical' ? 'destructive' : 'secondary'}>
                        {rec.priority}
                      </Badge>
                      {rec.status !== 'pending' && (
                        <Badge variant={rec.status === 'accepted' ? 'default' : 'outline'}>
                          {rec.status}
                        </Badge>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold mb-1">{rec.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{rec.description}</p>
                    <div className="flex items-center gap-6 text-sm">
                      <span className="flex items-center text-green-600">
                        <TrendingDown className="h-4 w-4 mr-1" />
                        Risk reduction: {rec.riskReduction}%
                      </span>
                      <span className="text-muted-foreground">{rec.expectedImpact}</span>
                      <span className="text-muted-foreground">{formatDateTime(rec.createdAt)}</span>
                    </div>
                  </div>
                  {rec.status === 'pending' && (
                    <div className="flex flex-col gap-2">
                      <Button size="sm" onClick={() => handleAccept(rec)}>
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        Accept
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => openIgnoreDialog(rec)}>
                        <XCircle className="h-4 w-4 mr-1" />
                        Ignore
                      </Button>
                      <Button size="sm" variant="ghost" asChild>
                        <Link href={`/doctor/patients/${rec.patientId}`}>
                          View Patient
                        </Link>
                      </Button>
                    </div>
                  )}
                  {rec.status !== 'pending' && (
                    <div className="flex flex-col gap-2">
                      <Button size="sm" variant="ghost" onClick={() => handleUndo(rec)}>
                        <Undo2 className="h-4 w-4 mr-1" />
                        Undo
                      </Button>
                      <Button size="sm" variant="ghost" asChild>
                        <Link href={`/doctor/patients/${rec.patientId}`}>
                          View Patient
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Ignore Dialog */}
      <Dialog open={showIgnoreDialog} onOpenChange={setShowIgnoreDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ignore Recommendation</DialogTitle>
            <DialogDescription>
              Optionally provide a reason for ignoring this AI recommendation
            </DialogDescription>
          </DialogHeader>
          {selectedRec && (
            <div className="space-y-4 py-4">
              <div className="p-3 rounded-lg border bg-muted/50">
                <p className="font-semibold">{selectedRec.title}</p>
                <p className="text-sm text-muted-foreground">
                  Patient: {getPatientName(selectedRec.patientId)}
                </p>
              </div>
              <div className="space-y-2">
                <Label>Reason for Ignoring (Optional)</Label>
                <Textarea
                  placeholder="e.g., Patient already receiving this treatment, Not applicable, etc."
                  value={ignoreReason}
                  onChange={(e) => setIgnoreReason(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowIgnoreDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmIgnore}>
              <XCircle className="h-4 w-4 mr-2" />
              Ignore Recommendation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
