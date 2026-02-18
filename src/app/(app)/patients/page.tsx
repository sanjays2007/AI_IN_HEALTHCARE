'use client';

import { patients } from '@/lib/data';
import { DataTable } from './components/data-table';
import { columns } from './components/columns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type ColumnFiltersState,
  type SortingState,
} from '@tanstack/react-table';

const treatmentPhases = [...new Set(patients.map((p) => p.treatmentPhase))];

export default function PatientsPage() {
  const data = patients;

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
  });

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Patients</h1>
      <Card>
        <CardHeader>
          <CardTitle>Patient Risk List</CardTitle>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <Input
              placeholder="Filter by name or ID..."
              value={globalFilter ?? ''}
              onChange={(event) => setGlobalFilter(event.target.value)}
              className="lg:col-span-1"
            />
            <Select
              value={
                (table.getColumn('riskCategory')?.getFilterValue() as string) ??
                ''
              }
              onValueChange={(value) =>
                table
                  .getColumn('riskCategory')
                  ?.setFilterValue(value === 'all' ? null : value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by risk level..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={
                (table.getColumn('diagnosis')?.getFilterValue() as string) ?? ''
              }
              onValueChange={(value) => {
                table
                  .getColumn('diagnosis')
                  ?.setFilterValue(value === 'all' ? null : value);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by treatment..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Treatments</SelectItem>
                <SelectItem value="Tuberculosis">TB</SelectItem>
                <SelectItem value="End-Stage Renal Disease">Dialysis</SelectItem>
                <SelectItem value="Breast Cancer">Chemo</SelectItem>
                <SelectItem value="Major Depressive Disorder">
                  Mental Health
                </SelectItem>
                <SelectItem value="Alcohol Use Disorder">
                  Substance Use
                </SelectItem>
              </SelectContent>
            </Select>
             <Select
              value={
                (table.getColumn('treatmentPhase')?.getFilterValue() as string) ?? ''
              }
              onValueChange={(value) =>
                table
                  .getColumn('treatmentPhase')
                  ?.setFilterValue(value === 'all' ? null : value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by treatment phase..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Phases</SelectItem>
                {treatmentPhases.map((phase) => (
                  <SelectItem key={phase} value={phase}>
                    {phase}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={
                (table
                  .getColumn('primaryRiskFactor')
                  ?.getFilterValue() as string) ?? ''
              }
              onValueChange={(value) =>
                table
                  .getColumn('primaryRiskFactor')
                  ?.setFilterValue(value === 'all' ? null : value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by primary risk..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Risks</SelectItem>
                <SelectItem value="Financial">Financial</SelectItem>
                <SelectItem value="Side Effects">Side Effects</SelectItem>
                <SelectItem value="Emotional">Emotional</SelectItem>
                <SelectItem value="Travel">Travel</SelectItem>
                <SelectItem value="Engagement">Engagement</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable table={table} />
        </CardContent>
      </Card>
    </div>
  );
}
