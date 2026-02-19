'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';
import { Fragment } from 'react';
import { UserNav } from './user-nav';
import { Home, Bell, Globe, Users, Stethoscope, Heart, DollarSign, Shield, User } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';
import Link from 'next/link';

const alerts = [
    { id: 1, patient: 'Anjali Sharma', message: 'Risk score increased to 82%', time: '2m ago', patientId: 'p001' },
    { id: 2, patient: 'Sunita Devi', message: 'Missed a scheduled check-in', time: '1h ago', patientId: 'p005' },
    { id: 3, patient: 'Raj Patel', message: 'Reported new severe side effect', time: '3h ago', patientId: 'p002' },
];

const portals = [
  { title: 'Patient Portal', href: '/patient/dashboard', icon: User, color: 'text-blue-500' },
  { title: 'Doctor Portal', href: '/doctor/dashboard', icon: Stethoscope, color: 'text-green-500' },
  { title: 'Nurse Portal', href: '/nurse/dashboard', icon: Heart, color: 'text-pink-500' },
  { title: 'Finance Portal', href: '/finance/dashboard', icon: DollarSign, color: 'text-emerald-500' },
  { title: 'Admin Portal', href: '/administrator/dashboard', icon: Shield, color: 'text-purple-500' },
];


export default function AppHeader() {
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter(Boolean);

  // Determine current portal
  const currentPortal = portals.find(p => pathname.startsWith(p.href.split('/dashboard')[0]));

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-card px-4 sm:px-6">
      <SidebarTrigger className="md:hidden" />
      <Breadcrumb className="hidden md:flex">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">
              <Home className="h-4 w-4" />
            </BreadcrumbLink>
          </BreadcrumbItem>
          {pathSegments.map((segment, index) => {
            const href = '/' + pathSegments.slice(0, index + 1).join('/');
            const isLast = index === pathSegments.length - 1;
            return (
              <Fragment key={href}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage className="capitalize">{segment}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={href} className="capitalize">
                      {segment}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
      <div className="ml-auto flex items-center gap-2">
        {/* Portal Switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              {currentPortal ? (
                <>
                  <currentPortal.icon className={`h-4 w-4 ${currentPortal.color}`} />
                  <span className="hidden sm:inline">{currentPortal.title.replace(' Portal', '')}</span>
                </>
              ) : (
                <>
                  <Users className="h-4 w-4" />
                  <span className="hidden sm:inline">Switch Portal</span>
                </>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Switch Portal</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {portals.map((portal) => (
              <DropdownMenuItem key={portal.href} asChild className="cursor-pointer">
                <Link href={portal.href} className="flex items-center gap-2">
                  <portal.icon className={`h-4 w-4 ${portal.color}`} />
                  <span>{portal.title}</span>
                  {currentPortal?.href === portal.href && (
                    <Badge variant="secondary" className="ml-auto text-xs">Current</Badge>
                  )}
                </Link>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href="/" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative h-8 w-8">
              <Bell className="h-5 w-5" />
              <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 justify-center rounded-full p-0">{alerts.length}</Badge>
              <span className="sr-only">Toggle notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Recent Alerts</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {alerts.map((alert) => (
                <DropdownMenuItem key={alert.id} asChild className="cursor-pointer">
                    <Link href={`/patients/${alert.patientId}`} className="grid grid-cols-[1fr_auto] items-start gap-2 p-2">
                        <div>
                            <p className="font-medium">{alert.patient}</p>
                            <p className="text-xs text-muted-foreground">{alert.message}</p>
                        </div>
                        <p className="text-xs text-muted-foreground/80">{alert.time}</p>
                    </Link>
                </DropdownMenuItem>
            ))}
             <DropdownMenuSeparator />
             <DropdownMenuItem asChild>
                <Link href="/alerts" className="flex items-center justify-center py-2 text-sm font-medium cursor-pointer">View All Alerts</Link>
             </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Globe className="h-5 w-5" />
              <span className="sr-only">Toggle language</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Language</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>English</DropdownMenuItem>
            <DropdownMenuItem>Español</DropdownMenuItem>
            <DropdownMenuItem>हिन्दी</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <ThemeToggle />
        <UserNav />
      </div>
    </header>
  );
}
