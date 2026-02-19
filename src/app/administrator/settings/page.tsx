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
import { Switch } from '@/components/ui/switch';
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
  Settings,
  Bell,
  Mail,
  Shield,
  Database,
  Globe,
  Palette,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function SettingsPage() {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
    criticalOnly: false,
    dailyDigest: true,
  });

  const [systemSettings, setSystemSettings] = useState({
    sessionTimeout: '30',
    language: 'en',
    timezone: 'IST',
    dateFormat: 'dd/mm/yyyy',
  });

  const [riskSettings, setRiskSettings] = useState({
    highRiskThreshold: '70',
    criticalRiskThreshold: '85',
    autoFlag: true,
    autoEnrollSupport: false,
  });

  const handleSave = () => {
    toast({
      title: 'Settings Saved',
      description: 'Your preferences have been updated successfully.',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Settings className="h-8 w-8 text-purple-600" />
            System Settings
          </h1>
          <p className="text-muted-foreground">
            Configure system-wide settings and preferences
          </p>
        </div>
        <Button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700">
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="risk">Risk Thresholds</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Regional Settings
              </CardTitle>
              <CardDescription>Configure language, timezone, and date formats</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select value={systemSettings.language} onValueChange={(v) => setSystemSettings({...systemSettings, language: v})}>
                    <SelectTrigger id="language">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="hi">Hindi</SelectItem>
                      <SelectItem value="mr">Marathi</SelectItem>
                      <SelectItem value="ta">Tamil</SelectItem>
                      <SelectItem value="te">Telugu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={systemSettings.timezone} onValueChange={(v) => setSystemSettings({...systemSettings, timezone: v})}>
                    <SelectTrigger id="timezone">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IST">IST (UTC+5:30)</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateFormat">Date Format</Label>
                  <Select value={systemSettings.dateFormat} onValueChange={(v) => setSystemSettings({...systemSettings, dateFormat: v})}>
                    <SelectTrigger id="dateFormat">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dd/mm/yyyy">DD/MM/YYYY</SelectItem>
                      <SelectItem value="mm/dd/yyyy">MM/DD/YYYY</SelectItem>
                      <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select defaultValue="INR">
                    <SelectTrigger id="currency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INR">INR (₹)</SelectItem>
                      <SelectItem value="USD">USD ($)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Appearance
              </CardTitle>
              <CardDescription>Customize the look and feel of the application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Theme Mode</Label>
                  <Select defaultValue="system">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Sidebar Style</Label>
                  <Select defaultValue="expanded">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="expanded">Always Expanded</SelectItem>
                      <SelectItem value="collapsed">Always Collapsed</SelectItem>
                      <SelectItem value="auto">Auto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Hospital Information
              </CardTitle>
              <CardDescription>Basic information about your healthcare facility</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="hospitalName">Hospital Name</Label>
                  <Input id="hospitalName" defaultValue="City General Hospital" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hospitalCode">Hospital Code</Label>
                  <Input id="hospitalCode" defaultValue="CGH-001" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea id="address" defaultValue="123 Healthcare Ave, Medical District, Mumbai - 400001" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Alert Preferences
              </CardTitle>
              <CardDescription>Configure how you receive system alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-alerts" className="font-medium">Email Alerts</Label>
                  <p className="text-sm text-muted-foreground">Receive alerts via email</p>
                </div>
                <Switch
                  id="email-alerts"
                  checked={notifications.emailAlerts}
                  onCheckedChange={(v) => setNotifications({...notifications, emailAlerts: v})}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="sms-alerts" className="font-medium">SMS Alerts</Label>
                  <p className="text-sm text-muted-foreground">Receive critical alerts via SMS</p>
                </div>
                <Switch
                  id="sms-alerts"
                  checked={notifications.smsAlerts}
                  onCheckedChange={(v) => setNotifications({...notifications, smsAlerts: v})}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="critical-only" className="font-medium">Critical Alerts Only</Label>
                  <p className="text-sm text-muted-foreground">Only notify for critical priority items</p>
                </div>
                <Switch
                  id="critical-only"
                  checked={notifications.criticalOnly}
                  onCheckedChange={(v) => setNotifications({...notifications, criticalOnly: v})}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="daily-digest" className="font-medium">Daily Digest</Label>
                  <p className="text-sm text-muted-foreground">Receive a summary email each morning</p>
                </div>
                <Switch
                  id="daily-digest"
                  checked={notifications.dailyDigest}
                  onCheckedChange={(v) => setNotifications({...notifications, dailyDigest: v})}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Configuration
              </CardTitle>
              <CardDescription>Configure email delivery settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="adminEmail">Admin Email</Label>
                  <Input id="adminEmail" type="email" defaultValue="admin@hospital.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="replyTo">Reply-To Address</Label>
                  <Input id="replyTo" type="email" defaultValue="support@hospital.com" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Risk Threshold Configuration
              </CardTitle>
              <CardDescription>Define risk score thresholds for patient categorization</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="highRisk">High Risk Threshold (%)</Label>
                  <Input
                    id="highRisk"
                    type="number"
                    min="0"
                    max="100"
                    value={riskSettings.highRiskThreshold}
                    onChange={(e) => setRiskSettings({...riskSettings, highRiskThreshold: e.target.value})}
                  />
                  <p className="text-xs text-muted-foreground">Patients above this score are flagged as high risk</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="criticalRisk">Critical Risk Threshold (%)</Label>
                  <Input
                    id="criticalRisk"
                    type="number"
                    min="0"
                    max="100"
                    value={riskSettings.criticalRiskThreshold}
                    onChange={(e) => setRiskSettings({...riskSettings, criticalRiskThreshold: e.target.value})}
                  />
                  <p className="text-xs text-muted-foreground">Patients above this require immediate attention</p>
                </div>
              </div>

              {/* Visual representation */}
              <div className="p-4 rounded-lg bg-muted">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-medium">Risk Categories</span>
                </div>
                <div className="flex h-6 rounded-full overflow-hidden">
                  <div 
                    className="bg-green-500 flex items-center justify-center text-xs text-white"
                    style={{ width: `${riskSettings.highRiskThreshold}%` }}
                  >
                    Low/Moderate
                  </div>
                  <div 
                    className="bg-yellow-500 flex items-center justify-center text-xs text-white"
                    style={{ width: `${parseInt(riskSettings.criticalRiskThreshold) - parseInt(riskSettings.highRiskThreshold)}%` }}
                  >
                    High
                  </div>
                  <div 
                    className="bg-red-500 flex items-center justify-center text-xs text-white"
                    style={{ width: `${100 - parseInt(riskSettings.criticalRiskThreshold)}%` }}
                  >
                    Critical
                  </div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>0%</span>
                  <span>{riskSettings.highRiskThreshold}%</span>
                  <span>{riskSettings.criticalRiskThreshold}%</span>
                  <span>100%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="autoFlag" className="font-medium">Auto-Flag High Risk</Label>
                  <p className="text-sm text-muted-foreground">Automatically flag patients exceeding threshold</p>
                </div>
                <Switch
                  id="autoFlag"
                  checked={riskSettings.autoFlag}
                  onCheckedChange={(v) => setRiskSettings({...riskSettings, autoFlag: v})}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="autoEnroll" className="font-medium">Auto-Enroll in Support Programs</Label>
                  <p className="text-sm text-muted-foreground">Automatically enroll critical risk patients in support</p>
                </div>
                <Switch
                  id="autoEnroll"
                  checked={riskSettings.autoEnrollSupport}
                  onCheckedChange={(v) => setRiskSettings({...riskSettings, autoEnrollSupport: v})}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Session Security
              </CardTitle>
              <CardDescription>Configure session timeout and authentication settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Select value={systemSettings.sessionTimeout} onValueChange={(v) => setSystemSettings({...systemSettings, sessionTimeout: v})}>
                    <SelectTrigger id="sessionTimeout">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxAttempts">Max Login Attempts</Label>
                  <Select defaultValue="5">
                    <SelectTrigger id="maxAttempts">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 attempts</SelectItem>
                      <SelectItem value="5">5 attempts</SelectItem>
                      <SelectItem value="10">10 attempts</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <div>
                  <Label className="font-medium">Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Require 2FA for all admin users</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Enforce Strong Passwords</Label>
                  <p className="text-sm text-muted-foreground">Require minimum 8 characters, mixed case, numbers</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Privacy</CardTitle>
              <CardDescription>HIPAA and data protection compliance settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Audit Logging</Label>
                  <p className="text-sm text-muted-foreground">Log all data access and changes</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Data Encryption at Rest</Label>
                  <p className="text-sm text-muted-foreground">Encrypt all stored patient data</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Auto Data Anonymization</Label>
                  <p className="text-sm text-muted-foreground">Anonymize data for analytics exports</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>External Integrations</CardTitle>
              <CardDescription>Connect with external systems and services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'Hospital Management System (HMS)', status: 'connected', type: 'Data Sync' },
                  { name: 'Government Health Portal', status: 'connected', type: 'Reporting' },
                  { name: 'SMS Gateway (MSG91)', status: 'connected', type: 'Notifications' },
                  { name: 'Email Service (SendGrid)', status: 'connected', type: 'Notifications' },
                  { name: 'Payment Gateway', status: 'pending', type: 'Payments' },
                ].map((integration) => (
                  <div key={integration.name} className="flex items-center justify-between p-4 rounded-lg border">
                    <div>
                      <p className="font-medium">{integration.name}</p>
                      <p className="text-sm text-muted-foreground">{integration.type}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={integration.status === 'connected' ? 'default' : 'secondary'} className="capitalize">
                        {integration.status === 'connected' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                        {integration.status}
                      </Badge>
                      <Button size="sm" variant="outline">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>API Configuration</CardTitle>
              <CardDescription>Manage API keys and webhooks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>API Key</Label>
                <div className="flex gap-2">
                  <Input type="password" value="sk_live_xxxxxxxxxxxxx" readOnly className="font-mono" />
                  <Button variant="outline">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Last rotated: 30 days ago</p>
              </div>
              <div className="space-y-2">
                <Label>Webhook URL</Label>
                <Input defaultValue="https://hospital.com/api/webhook" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
