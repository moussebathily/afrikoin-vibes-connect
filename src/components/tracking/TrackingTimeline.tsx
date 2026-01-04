import React from 'react';
import { 
  Clock, 
  PackageCheck, 
  Truck, 
  MapPin, 
  CheckCircle2, 
  XCircle, 
  RotateCcw 
} from 'lucide-react';
import { TrackingEvent, TrackingStatus, STATUS_CONFIG } from '@/types/tracking';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Clock,
  PackageCheck,
  Truck,
  MapPin,
  CheckCircle2,
  XCircle,
  RotateCcw
};

interface TrackingTimelineProps {
  events: TrackingEvent[];
}

export function TrackingTimeline({ events }: TrackingTimelineProps) {
  return (
    <div className="space-y-1">
      {events.map((event, index) => {
        const config = STATUS_CONFIG[event.status];
        const Icon = ICONS[config.icon] || Clock;
        const isFirst = index === 0;
        const isLast = index === events.length - 1;

        return (
          <div key={event.id} className="relative flex gap-4">
            {/* Timeline line */}
            <div className="flex flex-col items-center">
              <div 
                className={`relative z-10 p-2 rounded-full ${config.color} transition-all ${
                  isFirst ? 'ring-4 ring-primary/20 scale-110' : ''
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              {!isLast && (
                <div className="w-0.5 h-full min-h-[60px] bg-gradient-to-b from-primary/30 to-border/30" />
              )}
            </div>

            {/* Content */}
            <div className={`flex-1 pb-6 ${isFirst ? 'animate-fade-in' : ''}`}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className={`font-semibold ${isFirst ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {config.label}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {event.description}
                  </p>
                </div>
                <time className="text-xs text-muted-foreground whitespace-nowrap">
                  {format(new Date(event.timestamp), "dd MMM, HH:mm", { locale: fr })}
                </time>
              </div>
              
              <div className="flex items-center gap-2 mt-2">
                <MapPin className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{event.location}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
