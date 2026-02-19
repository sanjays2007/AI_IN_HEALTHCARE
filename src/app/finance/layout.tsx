'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { FinanceSidebar } from '@/components/layout/finance-sidebar';

export default function FinanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    } else if (!isLoading && user && user.role !== 'finance') {
      // Redirect to appropriate portal based on role
      switch (user.role) {
        case 'admin':
          router.push('/admin');
          break;
        case 'doctor':
          router.push('/dashboard');
          break;
        case 'nurse':
          router.push('/nurse/dashboard');
          break;
        case 'patient':
          router.push('/patient/dashboard');
          break;
        default:
          router.push('/login');
      }
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!user || user.role !== 'finance') {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <FinanceSidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
