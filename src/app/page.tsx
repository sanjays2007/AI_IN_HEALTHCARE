import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Stethoscope, Heart, DollarSign, Shield, User } from 'lucide-react';

const portals = [
  {
    title: 'Patient Portal',
    description: 'View appointments, track medications, and manage your health journey',
    href: '/patient/dashboard',
    icon: User,
    color: 'bg-blue-500',
  },
  {
    title: 'Doctor Portal',
    description: 'Manage patients, view analytics, and track interventions',
    href: '/doctor/dashboard',
    icon: Stethoscope,
    color: 'bg-green-500',
  },
  {
    title: 'Nurse Portal',
    description: 'Track vitals, manage schedules, and coordinate patient care',
    href: '/nurse/dashboard',
    icon: Heart,
    color: 'bg-pink-500',
  },
  {
    title: 'Finance Portal',
    description: 'Manage budgets, process applications, and track disbursements',
    href: '/finance/dashboard',
    icon: DollarSign,
    color: 'bg-emerald-500',
  },
  {
    title: 'Administrator Portal',
    description: 'System settings, user management, and organization oversight',
    href: '/administrator/dashboard',
    icon: Shield,
    color: 'bg-purple-500',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Silent Guardian</h1>
          <p className="text-xl text-muted-foreground">
            AI-Powered Patient Dropout Detection System
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {portals.map((portal) => (
            <Link key={portal.href} href={portal.href}>
              <Card className="h-full transition-all hover:shadow-lg hover:scale-[1.02] cursor-pointer">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${portal.color} flex items-center justify-center mb-4`}>
                    <portal.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle>{portal.title}</CardTitle>
                  <CardDescription>{portal.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
