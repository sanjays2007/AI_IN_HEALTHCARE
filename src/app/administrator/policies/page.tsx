'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  FileText,
  Target,
  Plus,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Users,
  IndianRupee,
  AlertCircle,
  Play,
  Pause,
  Settings,
} from 'lucide-react';
import { mockPolicyPrograms, getStatusBadgeVariant, formatCurrency } from '@/lib/admin-data';

export default function PoliciesPage() {
  const { toast } = useToast();
  const [programs] = useState(mockPolicyPrograms);

  const handleCreateProgram = () => {
    toast({
      title: 'Create Program',
      description: 'Opening program creation wizard...',
    });
  };

  const handleProgramSettings = (name: string) => {
    toast({
      title: 'Program Settings',
      description: `Opening settings for ${name}`,
    });
  };

  const handlePauseProgram = (name: string) => {
    toast({
      title: 'Program Paused',
      description: `${name} has been paused.`,
    });
  };

  const handleLaunchProgram = (name: string) => {
    toast({
      title: 'Program Launched',
      description: `${name} is now active.`,
    });
  };

  const activePrograms = programs.filter(p => p.status === 'active').length;
  const totalBudget = programs.reduce((sum, p) => sum + p.budget, 0);
  const totalUtilized = programs.reduce((sum, p) => sum + p.utilized, 0);
  const avgEffectiveness = Math.round(programs.reduce((sum, p) => sum + p.effectiveness, 0) / programs.length);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <FileText className="h-8 w-8 text-purple-600" />
            Policy & Strategy Management
          </h1>
          <p className="text-muted-foreground">
            Manage dropout prevention programs, campaigns, and support initiatives
          </p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700" onClick={handleCreateProgram}>
          <Plus className="h-4 w-4 mr-2" />
          Create New Program
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Programs</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activePrograms}</div>
            <p className="text-xs text-muted-foreground">of {programs.length} total programs</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalBudget)}</div>
            <p className="text-xs text-muted-foreground">FY 2024-25 allocation</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Utilized</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round((totalUtilized / totalBudget) * 100)}%</div>
            <Progress value={(totalUtilized / totalBudget) * 100} className="h-1 mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Effectiveness</CardTitle>
            <Target className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{avgEffectiveness}%</div>
            <p className="text-xs text-muted-foreground">Based on outcome metrics</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="programs">
        <TabsList>
          <TabsTrigger value="programs">Active Programs</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="programs" className="space-y-4">
          {/* Active Programs */}
          <div className="grid gap-4 md:grid-cols-2">
            {programs.filter(p => p.status === 'active').map((program) => (
              <Card key={program.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{program.name}</CardTitle>
                      <CardDescription>{program.description}</CardDescription>
                    </div>
                    <Badge variant={getStatusBadgeVariant(program.status) as any} className="capitalize">
                      {program.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-purple-600">{program.targetPatients}</p>
                      <p className="text-xs text-muted-foreground">Target Patients</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-600">{program.currentEnrollment}</p>
                      <p className="text-xs text-muted-foreground">Enrolled</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{program.effectiveness}%</p>
                      <p className="text-xs text-muted-foreground">Effectiveness</p>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Budget Utilization</span>
                      <span>{Math.round((program.utilized / program.budget) * 100)}%</span>
                    </div>
                    <Progress value={(program.utilized / program.budget) * 100} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>{formatCurrency(program.utilized)} used</span>
                      <span>{formatCurrency(program.budget)} budget</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Enrollment Progress</span>
                      <span>{Math.round((program.currentEnrollment / program.targetPatients) * 100)}%</span>
                    </div>
                    <Progress value={(program.currentEnrollment / program.targetPatients) * 100} className="h-2" />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 inline mr-1" />
                      {program.startDate} - {program.endDate}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" onClick={() => handleProgramSettings(program.name)}>
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handlePauseProgram(program.name)}>
                        <Pause className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pipeline" className="space-y-4">
          {/* Pipeline Programs */}
          <Card>
            <CardHeader>
              <CardTitle>Planned Programs</CardTitle>
              <CardDescription>Programs scheduled for future implementation</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Program Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Target Group</TableHead>
                    <TableHead>Planned Budget</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {programs.filter(p => p.status === 'planned').map((program) => (
                    <TableRow key={program.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{program.name}</p>
                          <p className="text-xs text-muted-foreground">{program.description}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{program.type}</Badge>
                      </TableCell>
                      <TableCell>{program.targetPatients} patients</TableCell>
                      <TableCell>{formatCurrency(program.budget)}</TableCell>
                      <TableCell>{program.startDate}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="capitalize">
                          <Clock className="h-3 w-3 mr-1" />
                          {program.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline" onClick={() => handleLaunchProgram(program.name)}>
                          <Play className="h-4 w-4 mr-1" />
                          Launch
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {programs.filter(p => p.status === 'planned').length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No planned programs. Create a new program to get started.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {/* Completed Programs */}
          <Card>
            <CardHeader>
              <CardTitle>Completed Programs</CardTitle>
              <CardDescription>Programs that have concluded with outcome metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Program Name</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Patients Served</TableHead>
                    <TableHead>Budget Spent</TableHead>
                    <TableHead>Effectiveness</TableHead>
                    <TableHead>Outcome</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {programs.filter(p => p.status === 'completed').map((program) => (
                    <TableRow key={program.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{program.name}</p>
                          <p className="text-xs text-muted-foreground">{program.description}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {program.startDate} - {program.endDate}
                      </TableCell>
                      <TableCell>{program.currentEnrollment}</TableCell>
                      <TableCell>{formatCurrency(program.utilized)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{program.effectiveness}%</span>
                          {program.effectiveness >= 70 ? (
                            <TrendingUp className="h-4 w-4 text-green-500" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-yellow-500" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={program.effectiveness >= 70 ? 'default' : 'secondary'}>
                          {program.effectiveness >= 70 ? 'Successful' : 'Moderate'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  {programs.filter(p => p.status === 'completed').length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No completed programs yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Strategic Initiatives */}
      <Card>
        <CardHeader>
          <CardTitle>Strategic Initiative Types</CardTitle>
          <CardDescription>Categories of dropout prevention strategies</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 rounded-lg border border-purple-200 bg-purple-50 dark:bg-purple-950/20">
              <h3 className="font-semibold flex items-center gap-2 mb-2">
                <IndianRupee className="h-5 w-5 text-purple-600" />
                Financial Support
              </h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Emergency assistance funds</li>
                <li>• Transport subsidies</li>
                <li>• Medicine cost coverage</li>
                <li>• Income loss compensation</li>
              </ul>
              <p className="text-xs mt-2 text-purple-600 font-medium">
                3 active programs | ₹12L allocated
              </p>
            </div>

            <div className="p-4 rounded-lg border border-blue-200 bg-blue-50 dark:bg-blue-950/20">
              <h3 className="font-semibold flex items-center gap-2 mb-2">
                <Users className="h-5 w-5 text-blue-600" />
                Outreach Campaigns
              </h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Community awareness drives</li>
                <li>• Family engagement programs</li>
                <li>• Peer support networks</li>
                <li>• Religious/cultural liaisons</li>
              </ul>
              <p className="text-xs mt-2 text-blue-600 font-medium">
                2 active programs | ₹5L allocated
              </p>
            </div>

            <div className="p-4 rounded-lg border border-green-200 bg-green-50 dark:bg-green-950/20">
              <h3 className="font-semibold flex items-center gap-2 mb-2">
                <Target className="h-5 w-5 text-green-600" />
                Operational Adjustments
              </h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Flexible scheduling</li>
                <li>• Home visit programs</li>
                <li>• Telemedicine options</li>
                <li>• Extended clinic hours</li>
              </ul>
              <p className="text-xs mt-2 text-green-600 font-medium">
                4 active programs | ₹8L allocated
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Success Stories / Case Studies */}
      <Card>
        <CardHeader>
          <CardTitle>Program Success Stories</CardTitle>
          <CardDescription>Highlighted outcomes from dropout prevention initiatives</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 rounded-lg border">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold">Transport Assistance Program</h3>
                <Badge className="bg-green-100 text-green-800">85% effective</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Provided subsidized transport to rural patients, reducing travel barrier-related dropouts by 40%.
              </p>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 bg-muted rounded">
                  <p className="text-lg font-bold">156</p>
                  <p className="text-xs">Patients Helped</p>
                </div>
                <div className="p-2 bg-muted rounded">
                  <p className="text-lg font-bold">₹3.2L</p>
                  <p className="text-xs">Invested</p>
                </div>
                <div className="p-2 bg-muted rounded">
                  <p className="text-lg font-bold">₹18L</p>
                  <p className="text-xs">Value Saved</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg border">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold">Family Engagement Initiative</h3>
                <Badge className="bg-green-100 text-green-800">78% effective</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Involved family members in treatment planning, improving adherence and reducing caregiver fatigue-related dropouts.
              </p>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 bg-muted rounded">
                  <p className="text-lg font-bold">89</p>
                  <p className="text-xs">Families Engaged</p>
                </div>
                <div className="p-2 bg-muted rounded">
                  <p className="text-lg font-bold">₹1.5L</p>
                  <p className="text-xs">Invested</p>
                </div>
                <div className="p-2 bg-muted rounded">
                  <p className="text-lg font-bold">₹12L</p>
                  <p className="text-xs">Value Saved</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
