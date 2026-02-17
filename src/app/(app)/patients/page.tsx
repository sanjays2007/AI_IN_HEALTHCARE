import { patients } from '@/lib/data';
import type { Patient } from '@/lib/types';
import { DataTable } from './components/data-table';
import { columns } from './components/columns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

async function getData(): Promise<Patient[]> {
  // Fetch data from your API here.
  return patients;
}

export default async function PatientsPage() {
  const data = await getData();

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Patients</h1>
      <Card>
        <CardHeader>
          <CardTitle>Patient Risk List</CardTitle>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Input placeholder="Filter by name..." />
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Filter by risk level..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Filter by treatment..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tb">TB</SelectItem>
                <SelectItem value="dialysis">Dialysis</SelectItem>
                <SelectItem value="chemo">Chemo</SelectItem>
                <SelectItem value="mental-health">Mental Health</SelectItem>
              </SelectContent>
            </Select>
             <Select>
              <SelectTrigger>
                <SelectValue placeholder="Filter by primary risk..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="financial">Financial</SelectItem>
                <SelectItem value="side-effects">Side Effects</SelectItem>
                <SelectItem value="emotional">Emotional</SelectItem>
                <SelectItem value="travel">Travel</SelectItem>
                <SelectItem value="engagement">Engagement</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={data} />
        </CardContent>
      </Card>
    </div>
  );
}
