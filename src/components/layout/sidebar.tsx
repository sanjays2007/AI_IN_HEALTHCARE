'use client';

import {
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/icons';
import { usePathname } from 'next/navigation';
import { Home, Users, BarChart2, LifeBuoy, Settings } from 'lucide-react';
import { UserNav } from './user-nav';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/patients', label: 'Patients', icon: Users },
  { href: '/analytics', label: 'Analytics', icon: BarChart2 },
];

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Logo className="size-7 text-primary" />
          <span className="text-lg font-semibold">Silent Guardian</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                href={item.href}
                asChild
                isActive={pathname.startsWith(item.href)}
                tooltip={item.label}
              >
                <item.icon />
                <span>{item.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="md:hidden">
        <UserNav />
      </SidebarFooter>
    </>
  );
}
