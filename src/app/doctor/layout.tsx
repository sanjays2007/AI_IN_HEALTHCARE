'use client';

import { useEffect, useState } from 'react';
import DoctorSidebar from '@/components/layout/doctor-sidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AppHeader from '@/components/layout/header';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function DoctorLayout({
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
    } else if (user?.role !== 'doctor') {
      // Redirect non-doctors to their appropriate portal
      if (user?.role === 'patient') {
        router.push('/patient/dashboard');
      } else {
        router.push('/dashboard');
      }
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, user, router]);

  if (isLoading || !isAuthenticated || user?.role !== 'doctor') {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <DoctorSidebar />
      <SidebarInset>
        <AppHeader />
        <main className="flex-1 overflow-auto p-6 bg-muted/30">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
