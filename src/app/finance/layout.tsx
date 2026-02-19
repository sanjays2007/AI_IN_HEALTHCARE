'use client';

import { FinanceSidebar } from '@/components/layout/finance-sidebar';
import { PortalSwitcher } from '@/components/layout/portal-switcher';
import { ThemeToggle } from '@/components/layout/theme-toggle';

export default function FinanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-background">
      <FinanceSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 border-b bg-card flex items-center justify-end px-6 gap-4">
          <PortalSwitcher />
          <ThemeToggle />
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
