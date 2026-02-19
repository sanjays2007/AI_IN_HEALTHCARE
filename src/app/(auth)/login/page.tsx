'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth, UserRole } from "@/contexts/auth-context";
import { useState } from "react";
import { Logo } from "@/components/icons";
import { Loader2, Settings, User, Stethoscope, Heart, DollarSign, Shield, Eye, EyeOff } from "lucide-react";

type AuthMode = 'login' | 'register';

interface RoleConfig {
  role: UserRole;
  label: string;
  icon: React.ElementType;
  color: string;
  description: string;
}

const STAFF_ROLES: RoleConfig[] = [
  { role: 'doctor', label: 'Doctor', icon: Stethoscope, color: 'text-blue-500', description: 'Medical professionals' },
  { role: 'nurse', label: 'Nurse', icon: Heart, color: 'text-pink-500', description: 'Nursing staff' },
  { role: 'finance', label: 'Finance', icon: DollarSign, color: 'text-green-500', description: 'Financial department' },
  { role: 'admin', label: 'Admin', icon: Shield, color: 'text-purple-500', description: 'System administrators' },
];

function AuthForm({ role, mode, onModeChange }: { role: UserRole; mode: AuthMode; onModeChange: (mode: AuthMode) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, register } = useAuth();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      if (mode === 'login') {
        const success = login(email, password, role);
        if (!success) {
          toast({
            variant: "destructive",
            title: "Login Failed",
            description: "Invalid email or password for this role.",
          });
        } else {
          toast({
            title: "Welcome!",
            description: `Successfully logged in as ${role}.`,
          });
        }
      } else {
        if (password !== confirmPassword) {
          toast({
            variant: "destructive",
            title: "Registration Failed",
            description: "Passwords do not match.",
          });
          setIsLoading(false);
          return;
        }

        const success = register({ name, email, password, role, phone });
        if (!success) {
          toast({
            variant: "destructive",
            title: "Registration Failed",
            description: "Email already exists.",
          });
        } else {
          toast({
            title: "Welcome!",
            description: "Account created successfully.",
          });
        }
      }
      setIsLoading(false);
    }, 1000);
  };

  const roleLabel = role === 'patient' ? 'Patient' : STAFF_ROLES.find(r => r.role === role)?.label || role;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {mode === 'register' && (
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="Enter your full name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
          />
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="m@example.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />
      </div>

      {mode === 'register' && (
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+1 (555) 000-0000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={isLoading}
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            className="pr-10"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {mode === 'register' && (
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isLoading}
          />
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {mode === 'login' ? `Login as ${roleLabel}` : `Register as ${roleLabel}`}
      </Button>

      <div className="text-center text-sm">
        {mode === 'login' ? (
          <p>
            Don&apos;t have an account?{' '}
            <button
              type="button"
              onClick={() => onModeChange('register')}
              className="text-primary hover:underline font-medium"
            >
              Register here
            </button>
          </p>
        ) : (
          <p>
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => onModeChange('login')}
              className="text-primary hover:underline font-medium"
            >
              Login here
            </button>
          </p>
        )}
      </div>
    </form>
  );
}

export default function LoginPage() {
  const [showStaffPanel, setShowStaffPanel] = useState(false);
  const [selectedStaffRole, setSelectedStaffRole] = useState<UserRole | null>(null);
  const [authMode, setAuthMode] = useState<AuthMode>('login');

  const handleStaffRoleSelect = (role: UserRole) => {
    setSelectedStaffRole(role);
    setAuthMode('login');
  };

  const handleBackToPatient = () => {
    setShowStaffPanel(false);
    setSelectedStaffRole(null);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md relative">
        {/* Hidden Staff Access Icon */}
        <button
          onClick={() => setShowStaffPanel(!showStaffPanel)}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors opacity-30 hover:opacity-100"
          title="Staff Access"
        >
          <Settings className="h-5 w-5 text-muted-foreground" />
        </button>

        <CardHeader className="text-center pb-2">
          <div className="flex justify-center items-center gap-2 mb-4">
            <Logo className="size-10 text-primary" />
            <CardTitle className="text-2xl font-bold">Silent Guardian</CardTitle>
          </div>
          
          {!showStaffPanel && !selectedStaffRole && (
            <>
              <div className="flex items-center justify-center gap-2 mb-2">
                <User className="h-6 w-6 text-primary" />
                <span className="text-lg font-semibold">Patient Portal</span>
              </div>
              <CardDescription>
                {authMode === 'login' 
                  ? 'Sign in to access your health records and appointments'
                  : 'Create an account to manage your healthcare journey'
                }
              </CardDescription>
            </>
          )}

          {showStaffPanel && !selectedStaffRole && (
            <>
              <CardTitle className="text-lg">Staff Portal</CardTitle>
              <CardDescription>Select your role to continue</CardDescription>
            </>
          )}

          {selectedStaffRole && (
            <>
              <div className="flex items-center justify-center gap-2 mb-2">
                {(() => {
                  const config = STAFF_ROLES.find(r => r.role === selectedStaffRole);
                  if (config) {
                    const Icon = config.icon;
                    return <Icon className={`h-6 w-6 ${config.color}`} />;
                  }
                  return null;
                })()}
                <span className="text-lg font-semibold">
                  {STAFF_ROLES.find(r => r.role === selectedStaffRole)?.label} Portal
                </span>
              </div>
              <CardDescription>
                {authMode === 'login' ? 'Sign in to your staff account' : 'Register your staff account'}
              </CardDescription>
            </>
          )}
        </CardHeader>

        <CardContent>
          {/* Patient Login/Register - Default View */}
          {!showStaffPanel && !selectedStaffRole && (
            <Tabs value={authMode} onValueChange={(v) => setAuthMode(v as AuthMode)} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <AuthForm role="patient" mode="login" onModeChange={setAuthMode} />
              </TabsContent>
              <TabsContent value="register">
                <AuthForm role="patient" mode="register" onModeChange={setAuthMode} />
              </TabsContent>
            </Tabs>
          )}

          {/* Staff Role Selection */}
          {showStaffPanel && !selectedStaffRole && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {STAFF_ROLES.map((roleConfig) => {
                  const Icon = roleConfig.icon;
                  return (
                    <button
                      key={roleConfig.role}
                      onClick={() => handleStaffRoleSelect(roleConfig.role)}
                      className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:border-primary hover:bg-muted/50 transition-all"
                    >
                      <Icon className={`h-8 w-8 ${roleConfig.color}`} />
                      <span className="font-medium text-sm">{roleConfig.label}</span>
                      <span className="text-xs text-muted-foreground">{roleConfig.description}</span>
                    </button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={handleBackToPatient}
              >
                <User className="mr-2 h-4 w-4" />
                Back to Patient Portal
              </Button>
            </div>
          )}

          {/* Staff Login/Register Form */}
          {selectedStaffRole && (
            <div className="space-y-4">
              <Tabs value={authMode} onValueChange={(v) => setAuthMode(v as AuthMode)} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                  <AuthForm role={selectedStaffRole} mode="login" onModeChange={setAuthMode} />
                </TabsContent>
                <TabsContent value="register">
                  <AuthForm role={selectedStaffRole} mode="register" onModeChange={setAuthMode} />
                </TabsContent>
              </Tabs>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setSelectedStaffRole(null)}
                >
                  Change Role
                </Button>
                <Button
                  variant="ghost"
                  className="flex-1"
                  onClick={handleBackToPatient}
                >
                  Patient Portal
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
