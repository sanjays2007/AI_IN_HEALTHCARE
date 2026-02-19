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
import {
  Building2,
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowUpDown,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { mockDepartmentPerformance } from '@/lib/admin-data';

export default function DepartmentPerformancePage() {
  const [departments, setDepartments] = useState(mockDepartmentPerformance);
  const [sortBy, setSortBy] = useState<string>('dropoutRate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const sortedDepartments = [...departments].sort((a, b) => {
    const aVal = a[sortBy as keyof typeof a] as number;
    const bVal = b[sortBy as keyof typeof b] as number;
    return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
  });

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'declining': return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendBadge = (trend: string) => {
    switch (trend) {
      case 'improving': return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">Improving</Badge>;
      case 'declining': return <Badge variant="destructive">Declining</Badge>;
      default: return <Badge variant="secondary">Stable</Badge>;
    }
  };

  const avgDropoutRate = (departments.reduce((sum, d) => sum + d.dropoutRate, 0) / departments.length).toFixed(1);
  const avgSuccessRate = (departments.reduce((sum, d) => sum + d.interventionSuccessRate, 0) / departments.length).toFixed(1);
  const totalPatients = departments.reduce((sum, d) => sum + d.totalPatients, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Building2 className="h-8 w-8 text-purple-600" />
            Department Performance
          </h1>
          <p className="text-muted-foreground">
            Monitor and compare performance across all departments
          </p>
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dropoutRate">Dropout Rate</SelectItem>
            <SelectItem value="interventionSuccessRate">Success Rate</SelectItem>
            <SelectItem value="totalPatients">Patient Count</SelectItem>
            <SelectItem value="avgRiskScore">Risk Score</SelectItem>
            <SelectItem value="staffResponsivenessScore">Staff Score</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Departments</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{departments.length}</div>
            <p className="text-xs text-muted-foreground">{totalPatients} total patients</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Dropout Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{avgDropoutRate}%</div>
            <p className="text-xs text-muted-foreground">Across all departments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Success Rate</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{avgSuccessRate}%</div>
            <p className="text-xs text-muted-foreground">Intervention success</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Depts Improving</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {departments.filter(d => d.trend === 'improving').length}
            </div>
            <p className="text-xs text-muted-foreground">Positive trend</p>
          </CardContent>
        </Card>
      </div>

      {/* Department Comparison Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Department Comparison</CardTitle>
          <CardDescription>Dropout rate vs Intervention success rate</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <svg viewBox="0 0 700 220" className="w-full h-full">
              {/* Legend */}
              <rect x="500" y="10" width="12" height="12" fill="#ef4444" rx="2" />
              <text x="518" y="20" className="text-xs fill-current">Dropout Rate</text>
              <rect x="600" y="10" width="12" height="12" fill="#22c55e" rx="2" />
              <text x="618" y="20" className="text-xs fill-current">Success Rate</text>
              
              {sortedDepartments.map((dept, i) => {
                const x = 60 + i * 100;
                const barWidth = 35;
                const dropoutHeight = dept.dropoutRate * 3.5;
                const successHeight = dept.interventionSuccessRate * 1.8;
                
                return (
                  <g key={dept.id}>
                    {/* Dropout Rate Bar */}
                    <rect
                      x={x}
                      y={180 - dropoutHeight}
                      width={barWidth}
                      height={dropoutHeight}
                      fill="#ef4444"
                      rx="4"
                    />
                    <text
                      x={x + barWidth / 2}
                      y={175 - dropoutHeight}
                      textAnchor="middle"
                      className="text-xs fill-current font-medium"
                    >
                      {dept.dropoutRate}%
                    </text>
                    
                    {/* Success Rate Bar */}
                    <rect
                      x={x + barWidth + 5}
                      y={180 - successHeight}
                      width={barWidth}
                      height={successHeight}
                      fill="#22c55e"
                      rx="4"
                    />
                    <text
                      x={x + barWidth + 5 + barWidth / 2}
                      y={175 - successHeight}
                      textAnchor="middle"
                      className="text-xs fill-current font-medium"
                    >
                      {dept.interventionSuccessRate}%
                    </text>
                    
                    {/* Department Name */}
                    <text
                      x={x + barWidth + 2}
                      y="200"
                      textAnchor="middle"
                      className="text-xs fill-muted-foreground"
                    >
                      {dept.name.split(' ')[0]}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Department Metrics</CardTitle>
          <CardDescription>Click column headers to sort</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Department</TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('totalPatients')}
                >
                  <div className="flex items-center gap-1">
                    Patients <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('dropoutRate')}
                >
                  <div className="flex items-center gap-1">
                    Dropout % <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('highRiskPercent')}
                >
                  <div className="flex items-center gap-1">
                    High Risk % <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('avgRiskScore')}
                >
                  <div className="flex items-center gap-1">
                    Avg Risk <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('interventionSuccessRate')}
                >
                  <div className="flex items-center gap-1">
                    Success % <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('staffResponsivenessScore')}
                >
                  <div className="flex items-center gap-1">
                    Staff Score <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead>Trend</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedDepartments.map((dept) => (
                <TableRow key={dept.id}>
                  <TableCell className="font-medium">{dept.name}</TableCell>
                  <TableCell>{dept.totalPatients}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress 
                        value={dept.dropoutRate} 
                        className="w-16 h-2"
                      />
                      <span className={dept.dropoutRate > 25 ? 'text-red-600 font-medium' : ''}>
                        {dept.dropoutRate}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={dept.highRiskPercent > 20 ? 'text-red-600 font-medium' : ''}>
                      {dept.highRiskPercent}%
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={dept.avgRiskScore > 55 ? 'text-red-600 font-medium' : ''}>
                      {dept.avgRiskScore}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress 
                        value={dept.interventionSuccessRate} 
                        className="w-16 h-2"
                      />
                      <span className={dept.interventionSuccessRate > 75 ? 'text-green-600 font-medium' : ''}>
                        {dept.interventionSuccessRate}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={dept.staffResponsivenessScore > 90 ? 'text-green-600 font-medium' : ''}>
                      {dept.staffResponsivenessScore}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTrendIcon(dept.trend)}
                      {getTrendBadge(dept.trend)}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Department Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sortedDepartments.map((dept) => (
          <Card 
            key={dept.id}
            className={dept.trend === 'declining' ? 'border-red-200 dark:border-red-800' : ''}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{dept.name}</CardTitle>
                {getTrendBadge(dept.trend)}
              </div>
              <CardDescription>{dept.totalPatients} patients</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Dropout Rate</p>
                  <p className={`text-xl font-bold ${dept.dropoutRate > 25 ? 'text-red-600' : ''}`}>
                    {dept.dropoutRate}%
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Success Rate</p>
                  <p className={`text-xl font-bold ${dept.interventionSuccessRate > 75 ? 'text-green-600' : ''}`}>
                    {dept.interventionSuccessRate}%
                  </p>
                </div>
              </div>
              <div className="pt-2 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">High Risk</span>
                  <span className="font-medium">{dept.highRiskPercent}%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Staff Score</span>
                  <span className="font-medium">{dept.staffResponsivenessScore}/100</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
