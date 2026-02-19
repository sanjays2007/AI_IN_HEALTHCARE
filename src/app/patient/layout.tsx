'use client';

import PatientSidebar from '@/components/layout/patient-sidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AppHeader from '@/components/layout/header';

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <PatientSidebar />
      <SidebarInset>
        <AppHeader />
        <main className="flex-1 overflow-auto p-6 bg-muted/30">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
