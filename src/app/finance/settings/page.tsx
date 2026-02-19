'use client';

import { useState } from 'react';
import {
  User,
  Bell,
  Shield,
  Mail,
  Smartphone,
  Save,
  Lock,
  CreditCard,
  Receipt,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/contexts/auth-context';

export default function FinanceSettingsPage() {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  // Profile settings
  const [name, setName] = useState(user?.name || 'Finance Officer');
  const [email, setEmail] = useState(user?.email || 'finance@hospital.com');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [department, setDepartment] = useState('Finance & Accounts');

  // Notification settings
  const [newApplicationAlert, setNewApplicationAlert] = useState(true);
  const [urgentCaseAlert, setUrgentCaseAlert] = useState(true);
  const [disbursementAlert, setDisbursementAlert] = useState(true);
  const [budgetAlert, setBudgetAlert] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);

  // Preferences
  const [currency, setCurrency] = useState('INR');
  const [dateFormat, setDateFormat] = useState('dd/mm/yyyy');
  const [defaultView, setDefaultView] = useState('dashboard');
  const [approvalLimit, setApprovalLimit] = useState('50000');

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">
            <User className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="preferences">
            <CreditCard className="h-4 w-4 mr-2" />
            Preferences
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="h-20 w-20 rounded-full bg-emerald-100 flex items-center justify-center">
                  <User className="h-10 w-10 text-emerald-600" />
                </div>
                <div>
                  <Button variant="outline" size="sm">
                    Change Photo
                  </Button>
                  <p className="text-xs text-muted-foreground mt-1">
                    JPG, GIF or PNG. Max 2MB.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input id="role" value="Finance Officer" disabled />
                <p className="text-xs text-muted-foreground">
                  Contact administrator to change your role
                </p>
              </div>

              <Button onClick={handleSave} disabled={isSaving} className="bg-emerald-600 hover:bg-emerald-700">
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Configure how you receive alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Application Alerts</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">New Applications</p>
                      <p className="text-sm text-muted-foreground">
                        Get notified when new applications are submitted
                      </p>
                    </div>
                    <Switch
                      checked={newApplicationAlert}
                      onCheckedChange={setNewApplicationAlert}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Urgent Cases</p>
                      <p className="text-sm text-muted-foreground">
                        Immediate alerts for high-priority applications
                      </p>
                    </div>
                    <Switch
                      checked={urgentCaseAlert}
                      onCheckedChange={setUrgentCaseAlert}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Financial Alerts</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Disbursement Updates</p>
                      <p className="text-sm text-muted-foreground">
                        Notifications for payment processing status
                      </p>
                    </div>
                    <Switch
                      checked={disbursementAlert}
                      onCheckedChange={setDisbursementAlert}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Budget Alerts</p>
                      <p className="text-sm text-muted-foreground">
                        Alert when budget utilization exceeds thresholds
                      </p>
                    </div>
                    <Switch
                      checked={budgetAlert}
                      onCheckedChange={setBudgetAlert}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Delivery Channels</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications via email
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">SMS Notifications</p>
                        <p className="text-sm text-muted-foreground">
                          Receive urgent alerts via SMS
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={smsNotifications}
                      onCheckedChange={setSmsNotifications}
                    />
                  </div>
                </div>
              </div>

              <Button onClick={handleSave} disabled={isSaving} className="bg-emerald-600 hover:bg-emerald-700">
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Preferences'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Application Preferences</CardTitle>
              <CardDescription>Customize your finance portal experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="currency">Default Currency</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger id="currency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INR">Indian Rupee (₹)</SelectItem>
                      <SelectItem value="USD">US Dollar ($)</SelectItem>
                      <SelectItem value="EUR">Euro (€)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateFormat">Date Format</Label>
                  <Select value={dateFormat} onValueChange={setDateFormat}>
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
                  <Label htmlFor="defaultView">Default View</Label>
                  <Select value={defaultView} onValueChange={setDefaultView}>
                    <SelectTrigger id="defaultView">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dashboard">Dashboard</SelectItem>
                      <SelectItem value="applications">Applications</SelectItem>
                      <SelectItem value="disbursements">Disbursements</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="approvalLimit">Approval Limit (₹)</Label>
                  <Input
                    id="approvalLimit"
                    type="number"
                    value={approvalLimit}
                    onChange={(e) => setApprovalLimit(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Maximum amount you can approve without escalation
                  </p>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-2 flex items-center gap-2">
                  <Receipt className="h-4 w-4" />
                  Report Preferences
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Default Report Period</Label>
                    <Select defaultValue="this-month">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="this-week">This Week</SelectItem>
                        <SelectItem value="this-month">This Month</SelectItem>
                        <SelectItem value="this-quarter">This Quarter</SelectItem>
                        <SelectItem value="this-year">This Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Export Format</Label>
                    <Select defaultValue="pdf">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="excel">Excel</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Button onClick={handleSave} disabled={isSaving} className="bg-emerald-600 hover:bg-emerald-700">
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Preferences'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your account security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Change Password</h3>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                </div>
                <Button variant="outline">
                  <Lock className="h-4 w-4 mr-2" />
                  Update Password
                </Button>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h3 className="font-medium">Two-Factor Authentication</h3>
                <p className="text-sm text-muted-foreground">
                  Add an extra layer of security to your account
                </p>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Shield className="h-8 w-8 text-emerald-600" />
                    <div>
                      <p className="font-medium">2FA is currently disabled</p>
                      <p className="text-sm text-muted-foreground">
                        Enable for enhanced security
                      </p>
                    </div>
                  </div>
                  <Button className="bg-emerald-600 hover:bg-emerald-700">Enable 2FA</Button>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h3 className="font-medium">Active Sessions</h3>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Current Session</p>
                      <p className="text-sm text-muted-foreground">
                        Windows • Chrome • Last active: Now
                      </p>
                    </div>
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded">
                      Current
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
