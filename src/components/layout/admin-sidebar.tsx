'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  BarChart3,
  Building2,
  Users,
  Target,
  IndianRupee,
  Calendar,
  FileText,
  Bell,
  Shield,
  Brain,
  Settings,
  LogOut,
  Activity,
} from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

const menuGroups = [
  {
    label: 'Overview',
    items: [
      { title: 'Dashboard', href: '/administrator/dashboard', icon: LayoutDashboard },
      { title: 'Global Alerts', href: '/administrator/alerts', icon: Bell, badge: 3 },
    ],
  },
  {
    label: 'Analytics',
    items: [
      { title: 'Population Analytics', href: '/administrator/population', icon: BarChart3 },
      { title: 'Department Performance', href: '/administrator/departments', icon: Building2 },
      { title: 'Staff Performance', href: '/administrator/staff', icon: Users },
      { title: 'Intervention Outcomes', href: '/administrator/interventions', icon: Target },
    ],
  },
  {
    label: 'Financial & Planning',
    items: [
      { title: 'Financial Impact', href: '/administrator/financial', icon: IndianRupee },
      { title: 'Seasonal Analysis', href: '/administrator/seasonal', icon: Calendar },
      { title: 'Policy Management', href: '/administrator/policies', icon: FileText },
    ],
  },
  {
    label: 'System Management',
    items: [
      { title: 'AI Model Monitoring', href: '/administrator/ai-model', icon: Brain },
      { title: 'Reports & Export', href: '/administrator/reports', icon: FileText },
      { title: 'User Management', href: '/administrator/users', icon: Shield },
      { title: 'Settings', href: '/administrator/settings', icon: Settings },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <Sidebar className="border-r border-purple-200 dark:border-purple-800">
      <SidebarHeader className="border-b border-purple-200 dark:border-purple-800 p-4">
        <Link href="/administrator/dashboard" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-600 text-white">
            <Activity className="h-6 w-6" />
          </div>
          <div>
            <h2 className="font-bold text-lg">Admin Portal</h2>
            <p className="text-xs text-muted-foreground">System Management</p>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {menuGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className="text-purple-600 dark:text-purple-400">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.href}
                      className="data-[active=true]:bg-purple-100 data-[active=true]:text-purple-700 dark:data-[active=true]:bg-purple-900/30 dark:data-[active=true]:text-purple-300"
                    >
                      <Link href={item.href}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                        {item.badge && (
                          <Badge variant="destructive" className="ml-auto text-xs">
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
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-purple-200 dark:border-purple-800 p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border-2 border-purple-300">
            <AvatarFallback className="bg-purple-100 text-purple-700">
              {user?.name?.split(' ').map(n => n[0]).join('') || 'AD'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name || 'Administrator'}</p>
            <p className="text-xs text-muted-foreground">System Admin</p>
          </div>
          <Button variant="ghost" size="icon" onClick={logout} title="Logout">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
