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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Activity,
  Plus,
  Search,
  TrendingUp,
  TrendingDown,
  Minus,
  Heart,
  Thermometer,
  Droplets,
  Scale,
} from 'lucide-react';
import { mockPatientAssignments, VitalRecord } from '@/lib/nurse-data';
import { useToast } from '@/hooks/use-toast';

export default function VitalsPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [showRecordDialog, setShowRecordDialog] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<string>('');
  const [vitalRecords, setVitalRecords] = useState<VitalRecord[]>([
    {
      id: '1',
      patientId: 'PT-1001',
      patientName: 'Ramesh Kumar',
      date: '2026-02-19',
      bloodPressure: '140/90',
      heartRate: 82,
      temperature: 98.6,
      weight: 75.5,
      oxygenSaturation: 97,
      notes: 'Slightly elevated BP, monitoring',
      recordedBy: 'Nurse Smith',
    },
    {
      id: '2',
      patientId: 'PT-1002',
      patientName: 'Sunita Devi',
      date: '2026-02-19',
      bloodPressure: '125/82',
      heartRate: 76,
      temperature: 98.4,
      weight: 62.0,
      oxygenSaturation: 98,
      notes: 'All vitals normal',
      recordedBy: 'Nurse Smith',
    },
    {
      id: '3',
      patientId: 'PT-1003',
      patientName: 'Mohan Singh',
      date: '2026-02-18',
      bloodPressure: '118/78',
      heartRate: 88,
      temperature: 99.2,
      weight: 68.5,
      oxygenSaturation: 95,
      notes: 'Low O2 saturation, slight fever',
      recordedBy: 'Nurse Smith',
    },
  ]);

  const [newVital, setNewVital] = useState({
    bloodPressureSystolic: '',
    bloodPressureDiastolic: '',
    heartRate: '',
    temperature: '',
    weight: '',
    oxygenSaturation: '',
    notes: '',
  });

  const handleRecordVitals = () => {
    const patient = mockPatientAssignments.find(p => p.patientId === selectedPatient);
    if (!patient) return;

    const record: VitalRecord = {
      id: String(vitalRecords.length + 1),
      patientId: selectedPatient,
      patientName: patient.patientName,
      date: new Date().toISOString().split('T')[0],
      bloodPressure: `${newVital.bloodPressureSystolic}/${newVital.bloodPressureDiastolic}`,
      heartRate: parseInt(newVital.heartRate),
      temperature: parseFloat(newVital.temperature),
      weight: parseFloat(newVital.weight),
      oxygenSaturation: parseInt(newVital.oxygenSaturation),
      notes: newVital.notes,
      recordedBy: 'Nurse Smith',
    };

    setVitalRecords([record, ...vitalRecords]);
    setShowRecordDialog(false);
    setNewVital({
      bloodPressureSystolic: '',
      bloodPressureDiastolic: '',
      heartRate: '',
      temperature: '',
      weight: '',
      oxygenSaturation: '',
      notes: '',
    });
    setSelectedPatient('');
    toast({
      title: 'Vitals Recorded',
      description: `Vitals for ${patient.patientName} have been recorded successfully.`,
    });
  };

  const filteredRecords = vitalRecords.filter(r =>
    r.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.patientId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getVitalStatus = (type: string, value: number) => {
    switch (type) {
      case 'heartRate':
        if (value < 60) return { icon: TrendingDown, color: 'text-blue-500', label: 'Low' };
        if (value > 100) return { icon: TrendingUp, color: 'text-red-500', label: 'High' };
        return { icon: Minus, color: 'text-green-500', label: 'Normal' };
      case 'temperature':
        if (value < 97) return { icon: TrendingDown, color: 'text-blue-500', label: 'Low' };
        if (value > 99) return { icon: TrendingUp, color: 'text-red-500', label: 'Fever' };
        return { icon: Minus, color: 'text-green-500', label: 'Normal' };
      case 'oxygenSaturation':
        if (value < 95) return { icon: TrendingDown, color: 'text-red-500', label: 'Low' };
        return { icon: Minus, color: 'text-green-500', label: 'Normal' };
      default:
        return { icon: Minus, color: 'text-gray-500', label: 'N/A' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Activity className="h-8 w-8 text-teal-600" />
            Vitals Records
          </h1>
          <p className="text-muted-foreground">
            Record and monitor patient vital signs
          </p>
        </div>
        <Button onClick={() => setShowRecordDialog(true)} className="bg-teal-600 hover:bg-teal-700">
          <Plus className="h-4 w-4 mr-2" />
          Record Vitals
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recorded Today</CardTitle>
            <Activity className="h-4 w-4 text-teal-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {vitalRecords.filter(r => r.date === '2026-02-19').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Abnormal BP</CardTitle>
            <Heart className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">1</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fever Cases</CardTitle>
            <Thermometer className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">1</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low O2</CardTitle>
            <Droplets className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">1</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search patient by name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Records Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Vital Records</CardTitle>
          <CardDescription>Latest recorded vital signs</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Date/Time</TableHead>
                <TableHead>Blood Pressure</TableHead>
                <TableHead>Heart Rate</TableHead>
                <TableHead>Temperature</TableHead>
                <TableHead>O2 Sat</TableHead>
                <TableHead>Weight</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.map((record) => {
                const hrStatus = getVitalStatus('heartRate', record.heartRate);
                const tempStatus = getVitalStatus('temperature', record.temperature);
                const o2Status = getVitalStatus('oxygenSaturation', record.oxygenSaturation);

                return (
                  <TableRow key={record.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{record.patientName}</p>
                        <p className="text-xs text-muted-foreground">{record.patientId}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(record.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono">
                        {record.bloodPressure}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <hrStatus.icon className={`h-4 w-4 ${hrStatus.color}`} />
                        <span>{record.heartRate} bpm</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <tempStatus.icon className={`h-4 w-4 ${tempStatus.color}`} />
                        <span>{record.temperature}°F</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <o2Status.icon className={`h-4 w-4 ${o2Status.color}`} />
                        <span>{record.oxygenSaturation}%</span>
                      </div>
                    </TableCell>
                    <TableCell>{record.weight} kg</TableCell>
                    <TableCell className="max-w-[150px] truncate text-sm text-muted-foreground">
                      {record.notes}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Record Vitals Dialog */}
      <Dialog open={showRecordDialog} onOpenChange={setShowRecordDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Record Vital Signs</DialogTitle>
            <DialogDescription>Enter patient vital measurements</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Select Patient</Label>
              <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose patient" />
                </SelectTrigger>
                <SelectContent>
                  {mockPatientAssignments.map((p) => (
                    <SelectItem key={p.patientId} value={p.patientId}>
                      {p.patientName} ({p.patientId})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>BP Systolic</Label>
                <Input
                  type="number"
                  placeholder="120"
                  value={newVital.bloodPressureSystolic}
                  onChange={(e) => setNewVital({...newVital, bloodPressureSystolic: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>BP Diastolic</Label>
                <Input
                  type="number"
                  placeholder="80"
                  value={newVital.bloodPressureDiastolic}
                  onChange={(e) => setNewVital({...newVital, bloodPressureDiastolic: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Heart Rate (bpm)</Label>
                <Input
                  type="number"
                  placeholder="72"
                  value={newVital.heartRate}
                  onChange={(e) => setNewVital({...newVital, heartRate: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Temperature (°F)</Label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="98.6"
                  value={newVital.temperature}
                  onChange={(e) => setNewVital({...newVital, temperature: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>O2 Saturation (%)</Label>
                <Input
                  type="number"
                  placeholder="98"
                  value={newVital.oxygenSaturation}
                  onChange={(e) => setNewVital({...newVital, oxygenSaturation: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Weight (kg)</Label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="70"
                  value={newVital.weight}
                  onChange={(e) => setNewVital({...newVital, weight: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                placeholder="Any observations..."
                value={newVital.notes}
                onChange={(e) => setNewVital({...newVital, notes: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRecordDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleRecordVitals} disabled={!selectedPatient}>
              <Plus className="h-4 w-4 mr-2" />
              Save Record
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
