'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/layout/admin-sidebar';
import { Separator } from '@/components/ui/separator';
import { ThemeToggle } from '@/components/layout/theme-toggle';

export default function AdministratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (user?.role !== 'admin') {
      // Redirect non-admins to their respective portals
      if (user?.role === 'doctor') {
        router.push('/doctor/dashboard');
      } else if (user?.role === 'patient') {
        router.push('/patient/dashboard');
      } else {
        router.push('/dashboard');
      }
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, user, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-pulse text-lg">Loading Administrator Portal...</div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <span className="text-sm text-muted-foreground">Administrator Portal</span>
          </div>
          <ThemeToggle />
        </header>
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
