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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Shield,
  Users,
  UserPlus,
  Search,
  MoreHorizontal,
  Mail,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Edit,
  Trash2,
  Key,
} from 'lucide-react';
import { mockSystemUsers, getRoleBadgeColor, getStatusBadgeVariant, SystemUser } from '@/lib/admin-data';

export default function UserManagementPage() {
  const [users, setUsers] = useState<SystemUser[]>(mockSystemUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'nurse' as SystemUser['role'],
    department: '',
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleAddUser = () => {
    const user: SystemUser = {
      id: String(users.length + 1),
      ...newUser,
      status: 'pending',
      lastLogin: '',
      createdAt: new Date().toISOString().split('T')[0],
      permissions: [],
    };
    setUsers([...users, user]);
    setShowAddDialog(false);
    setNewUser({ name: '', email: '', role: 'nurse', department: '' });
  };

  const toggleStatus = (id: string) => {
    setUsers(users.map(u => {
      if (u.id === id) {
        return {
          ...u,
          status: u.status === 'active' ? 'inactive' : 'active',
        };
      }
      return u;
    }));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'inactive': return <XCircle className="h-4 w-4 text-gray-500" />;
      case 'pending': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const formatLastLogin = (lastLogin: string) => {
    if (!lastLogin) return 'Never';
    const date = new Date(lastLogin);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const activeUsers = users.filter(u => u.status === 'active').length;
  const pendingUsers = users.filter(u => u.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Shield className="h-8 w-8 text-purple-600" />
            User Management
          </h1>
          <p className="text-muted-foreground">
            Manage user accounts, roles, and access permissions
          </p>
        </div>
        <Button onClick={() => setShowAddDialog(true)} className="bg-purple-600 hover:bg-purple-700">
          <UserPlus className="h-4 w-4 mr-2" />
          Add New User
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">Registered accounts</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeUsers}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingUsers}</div>
            <p className="text-xs text-muted-foreground">Awaiting activation</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Roles</CardTitle>
            <Shield className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Admin, Doctor, Nurse, Counselor, Finance</p>
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
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="doctor">Doctor</SelectItem>
                <SelectItem value="nurse">Nurse</SelectItem>
                <SelectItem value="counselor">Counselor</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>User Accounts</CardTitle>
          <CardDescription>Manage all registered users and their permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="text-xs">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getRoleBadgeColor(user.role)}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{user.department}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(user.status)}
                      <Badge variant={getStatusBadgeVariant(user.status) as any} className="capitalize">
                        {user.status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatLastLogin(user.lastLogin)}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button size="sm" variant="ghost" title="Edit">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" title="Reset Password">
                        <Key className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => toggleStatus(user.id)}
                        title={user.status === 'active' ? 'Deactivate' : 'Activate'}
                      >
                        {user.status === 'active' ? (
                          <XCircle className="h-4 w-4 text-red-500" />
                        ) : (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Role Permissions */}
      <Card>
        <CardHeader>
          <CardTitle>Role Permissions</CardTitle>
          <CardDescription>Default permissions for each role</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="p-4 rounded-lg border">
              <div className="flex items-center gap-2 mb-3">
                <Badge className={getRoleBadgeColor('admin')}>Admin</Badge>
              </div>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Full system access</li>
                <li>• User management</li>
                <li>• System configuration</li>
                <li>• All reports and exports</li>
              </ul>
            </div>
            <div className="p-4 rounded-lg border">
              <div className="flex items-center gap-2 mb-3">
                <Badge className={getRoleBadgeColor('doctor')}>Doctor</Badge>
              </div>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• View assigned patients</li>
                <li>• Create interventions</li>
                <li>• View analytics</li>
                <li>• AI recommendations</li>
              </ul>
            </div>
            <div className="p-4 rounded-lg border">
              <div className="flex items-center gap-2 mb-3">
                <Badge className={getRoleBadgeColor('nurse')}>Nurse</Badge>
              </div>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• View patients</li>
                <li>• Log follow-ups</li>
                <li>• Send messages</li>
                <li>• View schedules</li>
              </ul>
            </div>
            <div className="p-4 rounded-lg border">
              <div className="flex items-center gap-2 mb-3">
                <Badge className={getRoleBadgeColor('counselor')}>Counselor</Badge>
              </div>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• View patients</li>
                <li>• Create interventions</li>
                <li>• Log sessions</li>
                <li>• Behavioral tracking</li>
              </ul>
            </div>
            <div className="p-4 rounded-lg border">
              <div className="flex items-center gap-2 mb-3">
                <Badge className={getRoleBadgeColor('finance')}>Finance</Badge>
              </div>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• View patients</li>
                <li>• Manage financial aid</li>
                <li>• View reports</li>
                <li>• Payment processing</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add User Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account. They will receive an email to set their password.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter full name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select 
                value={newUser.role} 
                onValueChange={(value: SystemUser['role']) => setNewUser({ ...newUser, role: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="doctor">Doctor</SelectItem>
                  <SelectItem value="nurse">Nurse</SelectItem>
                  <SelectItem value="counselor">Counselor</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select 
                value={newUser.department}
                onValueChange={(value) => setNewUser({ ...newUser, department: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Oncology">Oncology</SelectItem>
                  <SelectItem value="TB Treatment">TB Treatment</SelectItem>
                  <SelectItem value="Dialysis">Dialysis</SelectItem>
                  <SelectItem value="Mental Health">Mental Health</SelectItem>
                  <SelectItem value="Substance Abuse">Substance Abuse</SelectItem>
                  <SelectItem value="Cardiology">Cardiology</SelectItem>
                  <SelectItem value="Administration">Administration</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddUser} disabled={!newUser.name || !newUser.email || !newUser.department}>
              <UserPlus className="h-4 w-4 mr-2" />
              Create User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
