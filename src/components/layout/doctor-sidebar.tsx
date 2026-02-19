'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  AlertTriangle,
  Brain,
  ClipboardList,
  Activity,
  Beaker,
  MessageSquare,
  BarChart3,
  Bell,
  Shield,
  LogOut,
  Stethoscope,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/auth-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const mainMenuItems = [
  { title: 'Dashboard', href: '/doctor/dashboard', icon: LayoutDashboard },
  { title: 'Patient Risk List', href: '/doctor/patients', icon: Users, badge: '32' },
  { title: 'Smart Alerts', href: '/doctor/alerts', icon: Bell, badge: '8' },
];

const clinicalMenuItems = [
  { title: 'AI Recommendations', href: '/doctor/recommendations', icon: Brain },
  { title: 'Interventions', href: '/doctor/interventions', icon: ClipboardList },
  { title: 'Adherence Monitor', href: '/doctor/adherence', icon: Activity },
];

const advancedMenuItems = [
  { title: 'Predictive Simulation', href: '/doctor/simulation', icon: Beaker },
  { title: 'Communication Hub', href: '/doctor/communication', icon: MessageSquare },
  { title: 'Department Analytics', href: '/doctor/analytics', icon: BarChart3 },
];

const settingsMenuItems = [
  { title: 'Privacy & Controls', href: '/doctor/settings', icon: Shield },
];

export default function DoctorSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white font-bold">
            <Stethoscope className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-semibold">HealthCare AI</h2>
            <p className="text-xs text-muted-foreground">Clinical Decision Support</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Overview</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href || pathname.startsWith(item.href + '/')}
                    className={cn(
                      (pathname === item.href || pathname.startsWith(item.href + '/')) && 'bg-blue-600/10 text-blue-600'
                    )}
                  >
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span className="flex-1">{item.title}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="ml-auto h-5 px-1.5 text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Clinical Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {clinicalMenuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    className={cn(
                      pathname === item.href && 'bg-blue-600/10 text-blue-600'
                    )}
                  >
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Advanced Features</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {advancedMenuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    className={cn(
                      pathname === item.href && 'bg-blue-600/10 text-blue-600'
                    )}
                  >
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsMenuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    className={cn(
                      pathname === item.href && 'bg-blue-600/10 text-blue-600'
                    )}
                  >
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/avatars/doctor.png" />
            <AvatarFallback className="bg-blue-600 text-white">
              <Stethoscope className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name || 'Doctor'}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start"
          onClick={logout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
