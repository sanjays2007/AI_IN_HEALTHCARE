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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  MapPin,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import {
  mockGeographicClusters,
  mockRiskFactorBreakdown,
  mockAdminStats,
  getRiskLevelColor,
  getTrendIcon,
} from '@/lib/admin-data';

export default function PopulationAnalyticsPage() {
  const [clusters] = useState(mockGeographicClusters);
  const [riskFactors] = useState(mockRiskFactorBreakdown);
  const [stats] = useState(mockAdminStats);

  const totalPatients = clusters.reduce((sum, c) => sum + c.patientCount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <BarChart3 className="h-8 w-8 text-purple-600" />
          Population-Level Risk Analytics
        </h1>
        <p className="text-muted-foreground">
          Strategic insights into patient demographics and risk distribution
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Population</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPatients.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Active patients</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High-Risk Regions</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {clusters.filter(c => c.riskLevel === 'high').length}
            </div>
            <p className="text-xs text-muted-foreground">Require intervention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Travel Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(clusters.reduce((sum, c) => sum + c.avgTravelTime, 0) / clusters.length)} min
            </div>
            <p className="text-xs text-muted-foreground">To healthcare facility</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Dropout Rate</CardTitle>
            <TrendingDown className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(clusters.reduce((sum, c) => sum + c.dropoutRate, 0) / clusters.length).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">Across all regions</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="geographic" className="space-y-4">
        <TabsList>
          <TabsTrigger value="geographic">Geographic Clusters</TabsTrigger>
          <TabsTrigger value="factors">Risk Factor Analysis</TabsTrigger>
          <TabsTrigger value="heatmap">Risk Heatmap</TabsTrigger>
        </TabsList>

        {/* Geographic Clusters Tab */}
        <TabsContent value="geographic" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Cluster Cards */}
            <Card>
              <CardHeader>
                <CardTitle>Regional Risk Distribution</CardTitle>
                <CardDescription>Patient clusters by geographic area</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {clusters.map((cluster) => (
                  <div
                    key={cluster.region}
                    className="flex items-center justify-between p-4 rounded-lg border bg-muted/30"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`h-3 w-3 rounded-full ${getRiskLevelColor(cluster.riskLevel)}`} />
                      <div>
                        <p className="font-medium">{cluster.region}</p>
                        <p className="text-sm text-muted-foreground">
                          {cluster.patientCount} patients • {cluster.avgTravelTime} min travel
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{cluster.dropoutRate}%</div>
                      <Badge 
                        variant={cluster.riskLevel === 'high' ? 'destructive' : cluster.riskLevel === 'medium' ? 'secondary' : 'outline'}
                        className="capitalize"
                      >
                        {cluster.riskLevel} risk
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Visual Map Representation */}
            <Card>
              <CardHeader>
                <CardTitle>Geographic Visualization</CardTitle>
                <CardDescription>Risk level by region</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px] relative bg-muted/30 rounded-lg flex items-center justify-center">
                  <svg viewBox="0 0 400 300" className="w-full h-full p-4">
                    {/* Simplified map visualization */}
                    {clusters.map((cluster, i) => {
                      const positions = [
                        { x: 200, y: 60 },  // North
                        { x: 200, y: 240 }, // South
                        { x: 320, y: 150 }, // East
                        { x: 80, y: 150 },  // West
                        { x: 200, y: 150 }, // Central
                      ];
                      const pos = positions[i] || { x: 200, y: 150 };
                      const color = cluster.riskLevel === 'high' ? '#ef4444' : cluster.riskLevel === 'medium' ? '#eab308' : '#22c55e';
                      const size = Math.sqrt(cluster.patientCount) * 2;
                      
                      return (
                        <g key={cluster.region}>
                          <circle
                            cx={pos.x}
                            cy={pos.y}
                            r={size}
                            fill={color}
                            fillOpacity="0.3"
                            stroke={color}
                            strokeWidth="2"
                          />
                          <circle
                            cx={pos.x}
                            cy={pos.y}
                            r="6"
                            fill={color}
                          />
                          <text
                            x={pos.x}
                            y={pos.y + size + 15}
                            textAnchor="middle"
                            className="text-xs fill-current font-medium"
                          >
                            {cluster.region.split(' ')[0]}
                          </text>
                          <text
                            x={pos.x}
                            y={pos.y + size + 28}
                            textAnchor="middle"
                            className="text-xs fill-muted-foreground"
                          >
                            {cluster.dropoutRate}%
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
                <div className="flex justify-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500" />
                    <span className="text-sm">High Risk</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-yellow-500" />
                    <span className="text-sm">Medium Risk</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                    <span className="text-sm">Low Risk</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Travel Burden Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Travel Burden Analysis</CardTitle>
              <CardDescription>Correlation between travel time and dropout rates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <svg viewBox="0 0 600 180" className="w-full h-full">
                  {/* Axis */}
                  <line x1="60" y1="150" x2="580" y2="150" stroke="currentColor" strokeOpacity="0.2" />
                  <line x1="60" y1="20" x2="60" y2="150" stroke="currentColor" strokeOpacity="0.2" />
                  
                  {/* Axis labels */}
                  <text x="320" y="175" textAnchor="middle" className="text-xs fill-muted-foreground">
                    Average Travel Time (minutes)
                  </text>
                  <text x="20" y="85" textAnchor="middle" transform="rotate(-90 20 85)" className="text-xs fill-muted-foreground">
                    Dropout Rate (%)
                  </text>
                  
                  {/* Data points */}
                  {clusters.map((cluster, i) => {
                    const x = 60 + (cluster.avgTravelTime / 100) * 500;
                    const y = 150 - (cluster.dropoutRate / 35) * 120;
                    const color = cluster.riskLevel === 'high' ? '#ef4444' : cluster.riskLevel === 'medium' ? '#eab308' : '#22c55e';
                    
                    return (
                      <g key={cluster.region}>
                        <circle cx={x} cy={y} r="10" fill={color} fillOpacity="0.7" />
                        <text x={x} y={y - 15} textAnchor="middle" className="text-xs fill-current">
                          {cluster.region.split(' ')[0]}
                        </text>
                      </g>
                    );
                  })}
                  
                  {/* Trend line */}
                  <line x1="80" y1="130" x2="520" y2="40" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="5,5" />
                </svg>
              </div>
              <p className="text-sm text-muted-foreground text-center mt-2">
                Higher travel times correlate with increased dropout risk
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Risk Factor Analysis Tab */}
        <TabsContent value="factors" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Detailed Risk Factors */}
            <Card>
              <CardHeader>
                <CardTitle>Risk Factor Breakdown</CardTitle>
                <CardDescription>What causes patients to drop out</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {riskFactors.map((factor) => (
                  <div key={factor.factor} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="h-3 w-3 rounded-full" 
                          style={{ backgroundColor: factor.color }}
                        />
                        <span className="font-medium">{factor.factor}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-sm ${factor.trend === 'up' ? 'text-red-500' : factor.trend === 'down' ? 'text-green-500' : 'text-gray-500'}`}>
                          {getTrendIcon(factor.trend)}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {factor.patientCount} patients
                        </span>
                        <span className="font-bold text-lg">{factor.percentage}%</span>
                      </div>
                    </div>
                    <Progress 
                      value={factor.percentage} 
                      className="h-3"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Pie Chart Visualization */}
            <Card>
              <CardHeader>
                <CardTitle>Risk Distribution</CardTitle>
                <CardDescription>Visual breakdown of dropout causes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <svg viewBox="0 0 200 200" className="w-64 h-64">
                    {(() => {
                      let cumulativePercent = 0;
                      return riskFactors.map((factor, i) => {
                        const startAngle = cumulativePercent * 3.6;
                        cumulativePercent += factor.percentage;
                        const endAngle = cumulativePercent * 3.6;
                        
                        const startRad = (startAngle - 90) * Math.PI / 180;
                        const endRad = (endAngle - 90) * Math.PI / 180;
                        
                        const x1 = 100 + 80 * Math.cos(startRad);
                        const y1 = 100 + 80 * Math.sin(startRad);
                        const x2 = 100 + 80 * Math.cos(endRad);
                        const y2 = 100 + 80 * Math.sin(endRad);
                        
                        const largeArc = factor.percentage > 50 ? 1 : 0;
                        
                        return (
                          <path
                            key={factor.factor}
                            d={`M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`}
                            fill={factor.color}
                            stroke="white"
                            strokeWidth="2"
                          />
                        );
                      });
                    })()}
                  </svg>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {riskFactors.map((factor) => (
                    <div key={factor.factor} className="flex items-center gap-2">
                      <div 
                        className="h-3 w-3 rounded-sm" 
                        style={{ backgroundColor: factor.color }}
                      />
                      <span className="text-sm">{factor.factor}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Strategic Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Strategic Recommendations</CardTitle>
              <CardDescription>Based on risk factor analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 rounded-lg border bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800">
                  <h4 className="font-semibold text-red-700 dark:text-red-400">Financial Support</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    35% of dropouts are due to financial stress. Expand emergency fund and installment programs.
                  </p>
                </div>
                <div className="p-4 rounded-lg border bg-orange-50 dark:bg-orange-900/10 border-orange-200 dark:border-orange-800">
                  <h4 className="font-semibold text-orange-700 dark:text-orange-400">Mental Health</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    20% emotional factors. Increase counselor availability and peer support programs.
                  </p>
                </div>
                <div className="p-4 rounded-lg border bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800">
                  <h4 className="font-semibold text-blue-700 dark:text-blue-400">Travel Solutions</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    12% travel burden. Expand telemedicine and mobile clinic schedules for remote areas.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Heatmap Tab */}
        <TabsContent value="heatmap" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Risk Heatmap by Region & Factor</CardTitle>
              <CardDescription>Identify hotspots requiring intervention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left p-2 font-medium">Region</th>
                      {riskFactors.map((f) => (
                        <th key={f.factor} className="text-center p-2 font-medium text-sm">
                          {f.factor.split(' ')[0]}
                        </th>
                      ))}
                      <th className="text-center p-2 font-medium">Overall</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clusters.map((cluster) => (
                      <tr key={cluster.region} className="border-t">
                        <td className="p-2 font-medium">{cluster.region}</td>
                        {riskFactors.map((f, i) => {
                          // Generate pseudo-random but consistent values
                          const value = Math.round(((cluster.dropoutRate * (i + 1) * 7) % 40) + 10);
                          const bgOpacity = value / 50;
                          return (
                            <td 
                              key={f.factor} 
                              className="text-center p-2"
                              style={{ 
                                backgroundColor: `rgba(239, 68, 68, ${bgOpacity})`,
                              }}
                            >
                              <span className={bgOpacity > 0.5 ? 'text-white' : ''}>
                                {value}%
                              </span>
                            </td>
                          );
                        })}
                        <td 
                          className="text-center p-2 font-bold"
                          style={{ 
                            backgroundColor: cluster.riskLevel === 'high' ? 'rgba(239, 68, 68, 0.3)' : 
                                           cluster.riskLevel === 'medium' ? 'rgba(234, 179, 8, 0.3)' : 
                                           'rgba(34, 197, 94, 0.3)'
                          }}
                        >
                          {cluster.dropoutRate}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-center gap-4 mt-6">
                <span className="text-sm text-muted-foreground">Risk Intensity:</span>
                <div className="flex items-center gap-1">
                  <div className="h-4 w-8 bg-red-100" />
                  <div className="h-4 w-8 bg-red-300" />
                  <div className="h-4 w-8 bg-red-500" />
                  <div className="h-4 w-8 bg-red-700" />
                </div>
                <span className="text-sm text-muted-foreground">Low → High</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
