'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
import { Home, Users, Stethoscope, Heart, DollarSign, Shield, User } from 'lucide-react';

const portals = [
  { title: 'Patient Portal', href: '/patient/dashboard', icon: User, color: 'text-blue-500' },
  { title: 'Doctor Portal', href: '/doctor/dashboard', icon: Stethoscope, color: 'text-green-500' },
  { title: 'Nurse Portal', href: '/nurse/dashboard', icon: Heart, color: 'text-pink-500' },
  { title: 'Finance Portal', href: '/finance/dashboard', icon: DollarSign, color: 'text-emerald-500' },
  { title: 'Admin Portal', href: '/administrator/dashboard', icon: Shield, color: 'text-purple-500' },
];

export function PortalSwitcher() {
  const pathname = usePathname();

  // Determine current portal
  const currentPortal = portals.find(p => pathname.startsWith(p.href.split('/dashboard')[0]));

  return (
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
  );
}
