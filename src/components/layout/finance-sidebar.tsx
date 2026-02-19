'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  CreditCard,
  BarChart3,
  Settings,
  LogOut,
  DollarSign,
  Wallet,
  PiggyBank,
  Bell,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/auth-context';
import { cn } from '@/lib/utils';

const menuGroups = [
  {
    label: 'Overview',
    items: [
      { href: '/finance/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/finance/alerts', label: 'Alerts', icon: Bell, badge: 5 },
    ],
  },
  {
    label: 'Financial Aid',
    items: [
      { href: '/finance/applications', label: 'Applications', icon: FileText, badge: 23 },
      { href: '/finance/disbursements', label: 'Disbursements', icon: CreditCard },
      { href: '/finance/budget', label: 'Budget', icon: PiggyBank },
    ],
  },
  {
    label: 'Analytics',
    items: [
      { href: '/finance/reports', label: 'Reports', icon: BarChart3 },
    ],
  },
  {
    label: 'System',
    items: [
      { href: '/finance/settings', label: 'Settings', icon: Settings },
    ],
  },
];

export function FinanceSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <div className="flex h-full w-64 flex-col border-r bg-white">
      {/* Header */}
      <div className="flex h-16 items-center gap-2 border-b px-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600">
          <DollarSign className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-emerald-600">Finance Portal</h1>
          <p className="text-xs text-muted-foreground">Financial Aid Management</p>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-6">
          {menuGroups.map((group) => (
            <div key={group.label}>
              <h2 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {group.label}
              </h2>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link key={item.href} href={item.href}>
                      <span
                        className={cn(
                          'flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-emerald-50 hover:text-emerald-600',
                          isActive
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'text-gray-600'
                        )}
                      >
                        <span className="flex items-center gap-3">
                          <item.icon className="h-4 w-4" />
                          {item.label}
                        </span>
                        {item.badge && (
                          <Badge
                            variant="secondary"
                            className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* User Info & Logout */}
      <div className="border-t p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
            <Wallet className="h-5 w-5 text-emerald-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.name || 'Finance Officer'}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.email || 'finance@hospital.com'}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
          onClick={logout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}
