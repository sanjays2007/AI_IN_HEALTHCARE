import AppHeader from '@/components/layout/header';
import AppSidebar from '@/components/layout/sidebar';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <AppSidebar />
        </Sidebar>
        <SidebarInset>
          <AppHeader />
          <main className="min-h-[calc(100vh-4rem)] bg-background p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl">{children}</div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
