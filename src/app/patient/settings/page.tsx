'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  Settings, 
  Bell, 
  Shield, 
  Clock, 
  MessageSquare,
  Download,
  Trash2,
  Eye,
  EyeOff,
  Smartphone,
  Mail,
  Phone
} from 'lucide-react';
import { mockPatientProfile } from '@/lib/patient-data';

export default function SettingsPage() {
  const { toast } = useToast();
  const profile = mockPatientProfile;
  
  const [settings, setSettings] = useState({
    // Communication Preferences
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    appointmentReminders: true,
    medicationReminders: true,
    
    // Contact Time Preferences
    preferredContactTime: 'morning',
    preferredContactMethod: 'email',
    
    // Privacy Settings
    privacyMode: false, // Hide sensitive info in messages
    dataSharing: true, // Share anonymized data for research
    
    // Display Settings
    showRiskScore: false,
    compactView: false,
  });

  const handleSettingChange = (key: string, value: boolean | string) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }));
    toast({
      title: "Setting Updated",
      description: "Your preference has been saved.",
    });
  };

  const handleDownloadData = () => {
    toast({
      title: "Download Started",
      description: "Your treatment summary is being prepared. It will be downloaded shortly.",
    });
  };

  const handleDeleteAccount = () => {
    toast({
      variant: "destructive",
      title: "Account Deletion",
      description: "Please contact support to delete your account.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Privacy & Settings</h1>
        <p className="text-muted-foreground">Manage your preferences and privacy options</p>
      </div>

      {/* Profile Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{profile.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{profile.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium">{profile.phone}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Treatment Type</p>
              <p className="font-medium">{profile.treatmentType}</p>
            </div>
          </div>
          <Button variant="outline" className="mt-4">Edit Profile</Button>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Preferences
          </CardTitle>
          <CardDescription>Control how and when you receive notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive updates via email</p>
                </div>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(value) => handleSettingChange('emailNotifications', value)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <Label>SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive updates via text message</p>
                </div>
              </div>
              <Switch
                checked={settings.smsNotifications}
                onCheckedChange={(value) => handleSettingChange('smsNotifications', value)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <Label>Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive push notifications on your device</p>
                </div>
              </div>
              <Switch
                checked={settings.pushNotifications}
                onCheckedChange={(value) => handleSettingChange('pushNotifications', value)}
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-medium">Reminder Types</h4>
            <div className="flex items-center justify-between">
              <div>
                <Label>Appointment Reminders</Label>
                <p className="text-sm text-muted-foreground">Get reminded about upcoming appointments</p>
              </div>
              <Switch
                checked={settings.appointmentReminders}
                onCheckedChange={(value) => handleSettingChange('appointmentReminders', value)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Medication Reminders</Label>
                <p className="text-sm text-muted-foreground">Get reminded to take your medications</p>
              </div>
              <Switch
                checked={settings.medicationReminders}
                onCheckedChange={(value) => handleSettingChange('medicationReminders', value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Contact Preferences
          </CardTitle>
          <CardDescription>Set your preferred contact time and method</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Preferred Contact Time</Label>
              <Select 
                value={settings.preferredContactTime} 
                onValueChange={(value) => handleSettingChange('preferredContactTime', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">Morning (8AM - 12PM)</SelectItem>
                  <SelectItem value="afternoon">Afternoon (12PM - 5PM)</SelectItem>
                  <SelectItem value="evening">Evening (5PM - 8PM)</SelectItem>
                  <SelectItem value="anytime">Anytime</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Preferred Contact Method</Label>
              <Select 
                value={settings.preferredContactMethod} 
                onValueChange={(value) => handleSettingChange('preferredContactMethod', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="phone">Phone Call</SelectItem>
                  <SelectItem value="sms">Text Message</SelectItem>
                  <SelectItem value="app">In-App Message</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privacy Settings
          </CardTitle>
          <CardDescription>Control your privacy and data sharing preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {settings.privacyMode ? (
                <EyeOff className="h-5 w-5 text-muted-foreground" />
              ) : (
                <Eye className="h-5 w-5 text-muted-foreground" />
              )}
              <div>
                <Label>Privacy Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Hide sensitive health information in notifications and messages
                </p>
              </div>
            </div>
            <Switch
              checked={settings.privacyMode}
              onCheckedChange={(value) => handleSettingChange('privacyMode', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Anonymous Data Sharing</Label>
              <p className="text-sm text-muted-foreground">
                Help improve healthcare by sharing anonymized data for research
              </p>
            </div>
            <Switch
              checked={settings.dataSharing}
              onCheckedChange={(value) => handleSettingChange('dataSharing', value)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label>Show Risk Insights</Label>
              <p className="text-sm text-muted-foreground">
                Display personalized risk insights on your dashboard
              </p>
            </div>
            <Switch
              checked={settings.showRiskScore}
              onCheckedChange={(value) => handleSettingChange('showRiskScore', value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Data Management
          </CardTitle>
          <CardDescription>Download or delete your data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4 md:flex-row">
            <Button variant="outline" onClick={handleDownloadData}>
              <Download className="mr-2 h-4 w-4" />
              Download Treatment Summary
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Download All My Data
            </Button>
          </div>
          
          <Separator />
          
          <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4">
            <h4 className="font-medium text-destructive mb-2">Danger Zone</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <Button variant="destructive" onClick={handleDeleteAccount}>
              <Trash2 className="mr-2 h-4 w-4" />
              Request Account Deletion
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Message */}
      <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-1">Your Privacy Matters</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                We understand that health information is sensitive. All your data is encrypted and protected. 
                We never share your personal information without your explicit consent. 
                You have full control over your data and can request its deletion at any time.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
