import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { BehaviorEvent } from '@/lib/types';

export default function BehavioralTimeline({ events }: { events: BehaviorEvent[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Behavioral Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative pl-6">
          <div className="absolute left-[35px] top-0 bottom-0 w-0.5 bg-border -translate-x-1/2"></div>
          {events.map((event, index) => (
            <div key={event.id} className="relative mb-6">
              <div className="absolute left-0 top-1.5 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full bg-card border-2 border-primary">
                <event.icon className="h-4 w-4 text-primary" />
              </div>
              <div className="pl-8">
                <p className="font-medium">{event.description}</p>
                <p className="text-sm text-muted-foreground">{event.details}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(event.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
