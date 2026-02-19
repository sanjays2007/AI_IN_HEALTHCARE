'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  MessageSquare,
  Calendar,
  Settings,
  Activity,
  LogOut,
  Bell,
  Heart,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/auth-context';

const menuItems = [
  {
    title: 'Overview',
    items: [
      { title: 'Dashboard', href: '/nurse/dashboard', icon: LayoutDashboard },
      { title: 'Alerts', href: '/nurse/alerts', icon: Bell, badge: 3 },
    ],
  },
  {
    title: 'Patient Care',
    items: [
      { title: 'My Patients', href: '/nurse/patients', icon: Users },
      { title: 'Follow-ups', href: '/nurse/follow-ups', icon: ClipboardList, badge: 8 },
      { title: 'Vitals Records', href: '/nurse/vitals', icon: Activity },
    ],
  },
  {
    title: 'Communication',
    items: [
      { title: 'Messages', href: '/nurse/communication', icon: MessageSquare },
      { title: 'Schedule', href: '/nurse/schedule', icon: Calendar },
    ],
  },
  {
    title: 'Settings',
    items: [
      { title: 'Settings', href: '/nurse/settings', icon: Settings },
    ],
  },
];

export function NurseSidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  return (
    <aside className="w-64 h-screen bg-card border-r flex flex-col">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-teal-100 dark:bg-teal-900">
            <Heart className="h-6 w-6 text-teal-600" />
          </div>
          <div>
            <h1 className="font-bold text-lg">Nurse Portal</h1>
            <p className="text-xs text-muted-foreground">Patient Care</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        {menuItems.map((group) => (
          <div key={group.title} className="mb-6">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-3">
              {group.title}
            </h2>
            <ul className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                        isActive
                          ? 'bg-teal-100 text-teal-900 dark:bg-teal-900 dark:text-teal-100'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      <span className="flex-1">{item.title}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="bg-teal-600 text-white text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* User Info */}
      <div className="p-4 border-t">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
            <span className="text-teal-700 font-medium text-sm">
              {user?.name?.split(' ').map(n => n[0]).join('') || 'NS'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name || 'Nurse'}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
