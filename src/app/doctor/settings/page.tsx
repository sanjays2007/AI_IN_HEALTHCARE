'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  Shield,
  Bell,
  Eye,
  Lock,
  Settings2,
  Save,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    // Privacy Settings
    showPatientPhotos: true,
    anonymizeInReports: false,
    auditLogEnabled: true,
    twoFactorAuth: true,
    
    // Alert Settings
    alertCritical: true,
    alertHigh: true,
    alertModerate: true,
    alertLow: false,
    emailNotifications: true,
    pushNotifications: true,
    
    // Clinical Preferences
    defaultRiskThreshold: 'medium',
    defaultTimeRange: '30',
    autoRefreshEnabled: true,
    showAIPredictions: true,
    showConfidenceScores: true,
    
    // Display Settings
    compactView: false,
    darkModeDefault: false,
    showRiskColors: true,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Settings2 className="h-8 w-8 text-blue-600" />
            Settings
          </h1>
          <p className="text-muted-foreground">
            Configure privacy controls and clinical preferences
          </p>
        </div>
        <Button onClick={handleSave}>
          {saved ? (
            <>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Saved!
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Privacy & Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600" />
              Privacy & Security
            </CardTitle>
            <CardDescription>
              HIPAA compliance and data protection settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Show Patient Photos</Label>
                <p className="text-sm text-muted-foreground">Display patient photos in lists and profiles</p>
              </div>
              <Switch 
                checked={settings.showPatientPhotos}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, showPatientPhotos: checked }))}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Anonymize in Reports</Label>
                <p className="text-sm text-muted-foreground">Use patient IDs instead of names in exports</p>
              </div>
              <Switch 
                checked={settings.anonymizeInReports}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, anonymizeInReports: checked }))}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Audit Log</Label>
                <p className="text-sm text-muted-foreground">Track all access and changes for compliance</p>
              </div>
              <Switch 
                checked={settings.auditLogEnabled}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, auditLogEnabled: checked }))}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">Require 2FA for sensitive operations</p>
              </div>
              <Switch 
                checked={settings.twoFactorAuth}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, twoFactorAuth: checked }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Alert Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-orange-600" />
              Alert Preferences
            </CardTitle>
            <CardDescription>
              Configure which alerts you want to receive
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label>Alert Priorities</Label>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-red-500" />
                    Critical Alerts
                  </span>
                  <Switch 
                    checked={settings.alertCritical}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, alertCritical: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-orange-500" />
                    High Priority
                  </span>
                  <Switch 
                    checked={settings.alertHigh}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, alertHigh: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-yellow-500" />
                    Moderate
                  </span>
                  <Switch 
                    checked={settings.alertModerate}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, alertModerate: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-blue-500" />
                    Low Priority
                  </span>
                  <Switch 
                    checked={settings.alertLow}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, alertLow: checked }))}
                  />
                </div>
              </div>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive alerts via email</p>
              </div>
              <Switch 
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, emailNotifications: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Push Notifications</Label>
                <p className="text-sm text-muted-foreground">Browser push notifications</p>
              </div>
              <Switch 
                checked={settings.pushNotifications}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, pushNotifications: checked }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Clinical Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-blue-600" />
              Clinical Preferences
            </CardTitle>
            <CardDescription>
              Customize clinical decision support settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Default Risk Threshold</Label>
              <Select 
                value={settings.defaultRiskThreshold}
                onValueChange={(value) => setSettings(prev => ({ ...prev, defaultRiskThreshold: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low (Show all risk levels)</SelectItem>
                  <SelectItem value="medium">Medium (Focus on moderate+)</SelectItem>
                  <SelectItem value="high">High (Critical patients only)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Default Time Range</Label>
              <Select 
                value={settings.defaultTimeRange}
                onValueChange={(value) => setSettings(prev => ({ ...prev, defaultTimeRange: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="14">Last 14 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-Refresh Dashboard</Label>
                <p className="text-sm text-muted-foreground">Update data every 5 minutes</p>
              </div>
              <Switch 
                checked={settings.autoRefreshEnabled}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoRefreshEnabled: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Show AI Predictions</Label>
                <p className="text-sm text-muted-foreground">Display predictive analytics</p>
              </div>
              <Switch 
                checked={settings.showAIPredictions}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, showAIPredictions: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Show Confidence Scores</Label>
                <p className="text-sm text-muted-foreground">Display AI confidence percentages</p>
              </div>
              <Switch 
                checked={settings.showConfidenceScores}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, showConfidenceScores: checked }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Display Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings2 className="h-5 w-5 text-purple-600" />
              Display Settings
            </CardTitle>
            <CardDescription>
              Customize your interface preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Compact View</Label>
                <p className="text-sm text-muted-foreground">Show more data in less space</p>
              </div>
              <Switch 
                checked={settings.compactView}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, compactView: checked }))}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Show Risk Colors</Label>
                <p className="text-sm text-muted-foreground">Color-code patients by risk level</p>
              </div>
              <Switch 
                checked={settings.showRiskColors}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, showRiskColors: checked }))}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Danger Zone */}
      <Card className="border-red-200 dark:border-red-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>
            Irreversible actions that require additional confirmation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10">
            <div>
              <p className="font-medium">Clear All Alert History</p>
              <p className="text-sm text-muted-foreground">Remove all read alerts from your history</p>
            </div>
            <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20">
              Clear History
            </Button>
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10">
            <div>
              <p className="font-medium">Reset All Preferences</p>
              <p className="text-sm text-muted-foreground">Restore all settings to default values</p>
            </div>
            <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20">
              Reset All
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
