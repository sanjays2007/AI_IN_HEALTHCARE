'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CalendarCheck,
  Pill,
  AlertTriangle,
  Heart,
  Wallet,
  BookOpen,
  HelpCircle,
  History,
  Bell,
  Settings,
  LogOut,
  User,
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
import { cn } from '@/lib/utils';

const mainMenuItems = [
  { title: 'Dashboard', href: '/patient/dashboard', icon: LayoutDashboard },
  { title: 'Appointments', href: '/patient/appointments', icon: CalendarCheck },
  { title: 'Medications', href: '/patient/medications', icon: Pill },
  { title: 'Side Effects', href: '/patient/side-effects', icon: AlertTriangle },
  { title: 'Mood Check-In', href: '/patient/mood', icon: Heart },
];

const supportMenuItems = [
  { title: 'Financial Support', href: '/patient/financial', icon: Wallet },
  { title: 'Education Center', href: '/patient/education', icon: BookOpen },
  { title: 'Support & Help', href: '/patient/support', icon: HelpCircle },
];

const historyMenuItems = [
  { title: 'Treatment History', href: '/patient/history', icon: History },
  { title: 'Alerts & Nudges', href: '/patient/alerts', icon: Bell },
  { title: 'Settings', href: '/patient/settings', icon: Settings },
];

export default function PatientSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
            HC
          </div>
          <div>
            <h2 className="font-semibold">HealthCare AI</h2>
            <p className="text-xs text-muted-foreground">Patient Portal</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    className={cn(
                      pathname === item.href && 'bg-primary/10 text-primary'
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
          <SidebarGroupLabel>Support & Resources</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {supportMenuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    className={cn(
                      pathname === item.href && 'bg-primary/10 text-primary'
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
          <SidebarGroupLabel>History & Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {historyMenuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    className={cn(
                      pathname === item.href && 'bg-primary/10 text-primary'
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
            <AvatarImage src="/avatars/patient.png" />
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name || 'Patient'}</p>
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
