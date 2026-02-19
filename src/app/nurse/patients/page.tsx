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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Users,
  Search,
  Phone,
  Calendar,
  Activity,
  MessageSquare,
  Eye,
} from 'lucide-react';
import {
  mockPatientAssignments,
  getStatusColor,
  getRiskColor,
} from '@/lib/nurse-data';

export default function NursePatientsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const patients = mockPatientAssignments;

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.patientId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || patient.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Users className="h-8 w-8 text-teal-600" />
          My Patients
        </h1>
        <p className="text-muted-foreground">
          View and manage your assigned patients
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Assigned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{patients.length}</div>
          </CardContent>
        </Card>
        <Card className="border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Stable</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {patients.filter(p => p.status === 'stable').length}
            </div>
          </CardContent>
        </Card>
        <Card className="border-yellow-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-700">Needs Attention</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {patients.filter(p => p.status === 'needs-attention').length}
            </div>
          </CardContent>
        </Card>
        <Card className="border-red-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-700">Critical</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {patients.filter(p => p.status === 'critical').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="stable">Stable</SelectItem>
                <SelectItem value="needs-attention">Needs Attention</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Patients Table */}
      <Card>
        <CardHeader>
          <CardTitle>Patient List</CardTitle>
          <CardDescription>Click on a patient for detailed view</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead>Risk Score</TableHead>
                <TableHead>Adherence</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Visit</TableHead>
                <TableHead>Next Follow-up</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{patient.patientName}</p>
                      <p className="text-sm text-muted-foreground">
                        {patient.patientId} • {patient.age}y • {patient.gender}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{patient.condition}</TableCell>
                  <TableCell>
                    <span className={`font-bold ${getRiskColor(patient.riskScore)}`}>
                      {patient.riskScore}%
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${patient.adherenceRate >= 80 ? 'bg-green-500' : patient.adherenceRate >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{ width: `${patient.adherenceRate}%` }}
                        />
                      </div>
                      <span className="text-sm">{patient.adherenceRate}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(patient.status)}>
                      {patient.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {new Date(patient.lastVisit).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-sm">
                    {new Date(patient.nextFollowUp).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" title="View Details">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" title="Call">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" title="Message">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" title="Record Vitals">
                        <Activity className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
