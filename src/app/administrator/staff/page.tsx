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
import { Progress } from '@/components/ui/progress';
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Users,
  Clock,
  CheckCircle2,
  TrendingDown,
  Award,
  AlertCircle,
} from 'lucide-react';
import { mockStaffPerformance, getRoleBadgeColor } from '@/lib/admin-data';

export default function StaffPerformancePage() {
  const [staff] = useState(mockStaffPerformance);
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('performanceScore');

  const filteredStaff = roleFilter === 'all' 
    ? staff 
    : staff.filter(s => s.role === roleFilter);

  const sortedStaff = [...filteredStaff].sort((a, b) => {
    return (b[sortBy as keyof typeof b] as number) - (a[sortBy as keyof typeof a] as number);
  });

  const avgResponseTime = (staff.reduce((sum, s) => sum + s.interventionResponseTime, 0) / staff.length).toFixed(1);
  const avgFollowUpRate = (staff.reduce((sum, s) => sum + s.followUpCompletionRate, 0) / staff.length).toFixed(1);
  const avgPerformance = (staff.reduce((sum, s) => sum + s.performanceScore, 0) / staff.length).toFixed(1);
  const topPerformer = [...staff].sort((a, b) => b.performanceScore - a.performanceScore)[0];

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-blue-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceBadge = (score: number) => {
    if (score >= 90) return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">Excellent</Badge>;
    if (score >= 75) return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">Good</Badge>;
    if (score >= 60) return <Badge variant="secondary">Average</Badge>;
    return <Badge variant="destructive">Needs Improvement</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Users className="h-8 w-8 text-purple-600" />
            Staff Performance Analytics
          </h1>
          <p className="text-muted-foreground">
            Track intervention response times and staff effectiveness
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="doctor">Doctors</SelectItem>
              <SelectItem value="nurse">Nurses</SelectItem>
              <SelectItem value="counselor">Counselors</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="performanceScore">Performance Score</SelectItem>
              <SelectItem value="interventionResponseTime">Response Time</SelectItem>
              <SelectItem value="followUpCompletionRate">Follow-up Rate</SelectItem>
              <SelectItem value="patientsManaged">Patients Managed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgResponseTime} hrs</div>
            <p className="text-xs text-muted-foreground">Target: &lt;3 hours</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Follow-up Rate</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{avgFollowUpRate}%</div>
            <p className="text-xs text-muted-foreground">Completion rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Performance</CardTitle>
            <Award className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getPerformanceColor(Number(avgPerformance))}`}>
              {avgPerformance}
            </div>
            <p className="text-xs text-muted-foreground">Out of 100</p>
          </CardContent>
        </Card>
        <Card className="border-green-200 dark:border-green-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Performer</CardTitle>
            <Award className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-green-600">{topPerformer.name}</div>
            <p className="text-xs text-muted-foreground">Score: {topPerformer.performanceScore}</p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Comparison Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Score Distribution</CardTitle>
          <CardDescription>Staff ranked by overall performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedStaff.map((member) => (
              <div key={member.id} className="flex items-center gap-4">
                <div className="w-40 flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{member.name.split(' ')[0]}</p>
                    <p className="text-xs text-muted-foreground capitalize">{member.role}</p>
                  </div>
                </div>
                <div className="flex-1">
                  <Progress 
                    value={member.performanceScore} 
                    className="h-3"
                  />
                </div>
                <div className="w-16 text-right">
                  <span className={`font-bold ${getPerformanceColor(member.performanceScore)}`}>
                    {member.performanceScore}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Staff Metrics</CardTitle>
          <CardDescription>Comprehensive performance breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Staff Member</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead className="text-center">Response Time</TableHead>
                <TableHead className="text-center">Follow-up %</TableHead>
                <TableHead className="text-center">Resolution Time</TableHead>
                <TableHead className="text-center">Escalations</TableHead>
                <TableHead className="text-center">Patients</TableHead>
                <TableHead className="text-center">Performance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedStaff.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{member.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getRoleBadgeColor(member.role)}>
                      {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{member.department}</TableCell>
                  <TableCell className="text-center">
                    <span className={member.interventionResponseTime > 3 ? 'text-red-600' : 'text-green-600'}>
                      {member.interventionResponseTime} hrs
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={member.followUpCompletionRate >= 90 ? 'text-green-600' : member.followUpCompletionRate < 80 ? 'text-red-600' : ''}>
                      {member.followUpCompletionRate}%
                    </span>
                  </TableCell>
                  <TableCell className="text-center">{member.resolutionTime} hrs</TableCell>
                  <TableCell className="text-center">{member.escalationsHandled}</TableCell>
                  <TableCell className="text-center">{member.patientsManaged}</TableCell>
                  <TableCell className="text-center">
                    {getPerformanceBadge(member.performanceScore)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Staff Cards by Role */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Doctors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-blue-500" />
              Doctor Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {staff.filter(s => s.role === 'doctor').map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                <div>
                  <p className="font-medium">{doc.name}</p>
                  <p className="text-sm text-muted-foreground">{doc.department}</p>
                </div>
                <div className="text-right">
                  <p className={`text-xl font-bold ${getPerformanceColor(doc.performanceScore)}`}>
                    {doc.performanceScore}
                  </p>
                  <p className="text-xs text-muted-foreground">{doc.patientsManaged} patients</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Nurses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-500" />
              Nurse Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {staff.filter(s => s.role === 'nurse').map((nurse) => (
              <div key={nurse.id} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                <div>
                  <p className="font-medium">{nurse.name}</p>
                  <p className="text-sm text-muted-foreground">{nurse.department}</p>
                </div>
                <div className="text-right">
                  <p className={`text-xl font-bold ${getPerformanceColor(nurse.performanceScore)}`}>
                    {nurse.performanceScore}
                  </p>
                  <p className="text-xs text-muted-foreground">{nurse.followUpCompletionRate}% follow-up</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Key Metrics Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Insights</CardTitle>
          <CardDescription>Key findings and recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 rounded-lg border bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <h4 className="font-semibold text-green-700 dark:text-green-400">Top Performers</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                {staff.filter(s => s.performanceScore >= 90).length} staff members exceeding expectations with 90+ scores.
              </p>
            </div>
            <div className="p-4 rounded-lg border bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-yellow-600" />
                <h4 className="font-semibold text-yellow-700 dark:text-yellow-400">Response Times</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                {staff.filter(s => s.interventionResponseTime > 3).length} staff members above target response time.
              </p>
            </div>
            <div className="p-4 rounded-lg border bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <h4 className="font-semibold text-red-700 dark:text-red-400">Needs Support</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                {staff.filter(s => s.performanceScore < 75).length} staff members may need additional training or resources.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
