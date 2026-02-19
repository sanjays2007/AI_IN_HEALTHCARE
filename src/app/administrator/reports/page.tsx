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
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  FileText,
  Download,
  FileSpreadsheet,
  File,
  Calendar,
  Building2,
  Shield,
  Users,
  Clock,
  CheckCircle2,
} from 'lucide-react';

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  format: string[];
  lastGenerated?: string;
  icon: React.ReactNode;
}

const reportTemplates: ReportTemplate[] = [
  {
    id: '1',
    name: 'Monthly Adherence Report',
    description: 'Comprehensive monthly overview of treatment adherence across all departments',
    category: 'Compliance',
    format: ['PDF', 'CSV', 'Excel'],
    lastGenerated: '2026-02-01',
    icon: <FileText className="h-5 w-5 text-blue-500" />,
  },
  {
    id: '2',
    name: 'Department Performance Summary',
    description: 'Detailed performance metrics for each department including dropout rates',
    category: 'Performance',
    format: ['PDF', 'Excel'],
    lastGenerated: '2026-02-15',
    icon: <Building2 className="h-5 w-5 text-purple-500" />,
  },
  {
    id: '3',
    name: 'Government Compliance Report',
    description: 'Formatted report meeting government healthcare reporting requirements',
    category: 'Regulatory',
    format: ['PDF'],
    lastGenerated: '2026-01-31',
    icon: <Shield className="h-5 w-5 text-green-500" />,
  },
  {
    id: '4',
    name: 'Financial Aid Utilization',
    description: 'Breakdown of financial assistance distributed and ROI metrics',
    category: 'Financial',
    format: ['PDF', 'Excel', 'CSV'],
    lastGenerated: '2026-02-10',
    icon: <FileSpreadsheet className="h-5 w-5 text-yellow-500" />,
  },
  {
    id: '5',
    name: 'Staff Performance Analytics',
    description: 'Individual and team performance metrics for all healthcare staff',
    category: 'Performance',
    format: ['PDF', 'Excel'],
    icon: <Users className="h-5 w-5 text-orange-500" />,
  },
  {
    id: '6',
    name: 'AI Prediction Accuracy Report',
    description: 'Model performance metrics including sensitivity, specificity, and accuracy',
    category: 'AI/Technical',
    format: ['PDF', 'CSV'],
    lastGenerated: '2026-02-18',
    icon: <File className="h-5 w-5 text-purple-500" />,
  },
  {
    id: '7',
    name: 'Research Dataset (Anonymized)',
    description: 'De-identified patient data for research and analysis purposes',
    category: 'Research',
    format: ['CSV', 'JSON'],
    icon: <FileSpreadsheet className="h-5 w-5 text-teal-500" />,
  },
  {
    id: '8',
    name: 'Board Executive Summary',
    description: 'High-level summary for board meetings and stakeholder presentations',
    category: 'Executive',
    format: ['PDF', 'PowerPoint'],
    lastGenerated: '2026-02-01',
    icon: <FileText className="h-5 w-5 text-red-500" />,
  },
];

const recentExports = [
  { name: 'Monthly_Adherence_Feb_2026.pdf', date: '2026-02-15', size: '2.4 MB', status: 'completed' },
  { name: 'Dept_Performance_Q1.xlsx', date: '2026-02-14', size: '1.8 MB', status: 'completed' },
  { name: 'Financial_Aid_Report.pdf', date: '2026-02-10', size: '892 KB', status: 'completed' },
  { name: 'AI_Accuracy_Weekly.csv', date: '2026-02-18', size: '156 KB', status: 'completed' },
];

export default function ReportsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDateRange, setSelectedDateRange] = useState<string>('month');
  const [selectedFormat, setSelectedFormat] = useState<string>('pdf');
  const [generating, setGenerating] = useState<string | null>(null);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>(['all']);

  const filteredTemplates = selectedCategory === 'all'
    ? reportTemplates
    : reportTemplates.filter(r => r.category === selectedCategory);

  const handleGenerate = (reportId: string) => {
    setGenerating(reportId);
    setTimeout(() => setGenerating(null), 2000);
  };

  const categories = ['all', ...Array.from(new Set(reportTemplates.map(r => r.category)))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <FileText className="h-8 w-8 text-purple-600" />
            Reports & Export Center
          </h1>
          <p className="text-muted-foreground">
            Generate and download reports for compliance, analysis, and stakeholder communication
          </p>
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(cat => (
              <SelectItem key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Quick Generate Section */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Report Generator</CardTitle>
          <CardDescription>Configure and generate a custom report</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-4">
            <div className="space-y-2">
              <Label>Time Period</Label>
              <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Last 7 Days</SelectItem>
                  <SelectItem value="month">Last 30 Days</SelectItem>
                  <SelectItem value="quarter">Last Quarter</SelectItem>
                  <SelectItem value="year">Last Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Format</Label>
              <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF Document</SelectItem>
                  <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                  <SelectItem value="csv">CSV File</SelectItem>
                  <SelectItem value="json">JSON Data</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Department</Label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="oncology">Oncology</SelectItem>
                  <SelectItem value="tb">TB Treatment</SelectItem>
                  <SelectItem value="dialysis">Dialysis</SelectItem>
                  <SelectItem value="mental">Mental Health</SelectItem>
                  <SelectItem value="substance">Substance Abuse</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>&nbsp;</Label>
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                <Download className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </div>
          </div>
          
          {/* Include Options */}
          <div className="mt-6 pt-6 border-t">
            <Label className="mb-3 block">Include in Report:</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox id="summary" defaultChecked />
                <label htmlFor="summary" className="text-sm">Executive Summary</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="charts" defaultChecked />
                <label htmlFor="charts" className="text-sm">Charts & Graphs</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="patient-list" />
                <label htmlFor="patient-list" className="text-sm">Patient Details</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="recommendations" defaultChecked />
                <label htmlFor="recommendations" className="text-sm">AI Recommendations</label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Templates Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {template.icon}
                  <div>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <Badge variant="outline" className="mt-1">{template.category}</Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{template.description}</p>
              
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Formats:</span>
                {template.format.map(fmt => (
                  <Badge key={fmt} variant="secondary" className="text-xs">{fmt}</Badge>
                ))}
              </div>
              
              {template.lastGenerated && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Last generated: {new Date(template.lastGenerated).toLocaleDateString()}
                </p>
              )}
              
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => handleGenerate(template.id)}
                disabled={generating === template.id}
              >
                {generating === template.id ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Generate Report
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Exports */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Exports</CardTitle>
          <CardDescription>Previously generated reports available for download</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentExports.map((export_, i) => (
              <div 
                key={i}
                className="flex items-center justify-between p-3 rounded-lg border bg-muted/30"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-sm">{export_.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(export_.date).toLocaleDateString()} • {export_.size}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    {export_.status}
                  </Badge>
                  <Button size="sm" variant="ghost">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Scheduled Reports */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Scheduled Reports</CardTitle>
            <CardDescription>Automatically generated reports</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Add Schedule
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <p className="font-medium">Weekly Performance Summary</p>
                <p className="text-sm text-muted-foreground">Every Monday at 6:00 AM</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge>Active</Badge>
                <Button size="sm" variant="ghost">Edit</Button>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <p className="font-medium">Monthly Compliance Report</p>
                <p className="text-sm text-muted-foreground">1st of every month at 8:00 AM</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge>Active</Badge>
                <Button size="sm" variant="ghost">Edit</Button>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <p className="font-medium">Quarterly Board Report</p>
                <p className="text-sm text-muted-foreground">End of each quarter</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Paused</Badge>
                <Button size="sm" variant="ghost">Edit</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
