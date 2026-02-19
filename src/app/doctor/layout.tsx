'use client';

import DoctorSidebar from '@/components/layout/doctor-sidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AppHeader from '@/components/layout/header';

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
