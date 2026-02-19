'use client';

import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { NurseSidebar } from '@/components/layout/nurse-sidebar';

export default function NurseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (user?.role !== 'nurse') {
      // Redirect to appropriate portal
      if (user?.role === 'admin') router.push('/administrator/dashboard');
      else if (user?.role === 'doctor') router.push('/doctor/dashboard');
      else if (user?.role === 'finance') router.push('/finance/dashboard');
      else if (user?.role === 'patient') router.push('/patient/dashboard');
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || user?.role !== 'nurse') {
    return null;
  }

  return (
    <div className="flex h-screen bg-background">
      <NurseSidebar />
      <main className="flex-1 overflow-y-auto p-6">
        {children}
      </main>
    </div>
  );
}
