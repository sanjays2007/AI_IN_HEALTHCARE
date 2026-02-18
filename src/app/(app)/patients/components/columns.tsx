'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Patient, RiskCategory } from '@/lib/types';
import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const riskCategoryColors: Record<RiskCategory, string> = {
  Critical: 'bg-red-500/80 text-destructive-foreground hover:bg-red-500/90',
  High: 'bg-yellow-500/80 text-yellow-foreground hover:bg-yellow-500/90',
  Medium: 'bg-blue-500/80 text-white hover:bg-blue-500/90',
  Low: 'bg-green-500/80 text-white hover:bg-green-500/90',
};

export const columns: ColumnDef<Patient>[] = [
  {
    accessorKey: 'name',
    header: 'Patient',
    cell: ({ row }) => {
      const patient = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage asChild src={patient.avatarUrl}>
              <Image src={patient.avatarUrl} alt={patient.name} width={36} height={36} data-ai-hint="person portrait" />
            </AvatarImage>
            <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">{patient.name}</span>
            <span className="text-xs text-muted-foreground">ID: {patient.id}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'diagnosis',
    header: 'Diagnosis',
  },
  {
    accessorKey: 'riskScore',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Risk Score
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="text-center font-medium">{row.getValue('riskScore')}%</div>,
  },
  {
    accessorKey: 'riskCategory',
    header: 'Risk Category',
    cell: ({ row }) => {
      const category = row.getValue('riskCategory') as RiskCategory;
      return <Badge className={riskCategoryColors[category]}>{category}</Badge>;
    },
  },
  {
    accessorKey: 'primaryRiskFactor',
    header: 'Primary Risk Factor',
  },
  {
    accessorKey: 'lastVisit',
    header: 'Last Visit',
    cell: ({ row }) => new Date(row.getValue('lastVisit')).toLocaleDateString(),
  },
  {
    accessorKey: 'missedAppointments',
    header: 'Missed Appts',
    cell: ({ row }) => <div className="text-center">{row.getValue('missedAppointments')}</div>,
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const patient = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={`/patients/${patient.id}`}>View Risk Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Schedule Follow-up</DropdownMenuItem>
            <DropdownMenuItem>Log Interaction</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
