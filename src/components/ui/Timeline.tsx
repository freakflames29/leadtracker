import type { FollowUp } from '../../types';
import { format } from 'date-fns';
import { MessageSquare } from 'lucide-react';

interface TimelineProps {
  followUps: FollowUp[];
}

export default function Timeline({ followUps }: TimelineProps) {
  if (followUps.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <div className="w-12 h-12 rounded-full bg-background-elevated border border-border-subtle flex items-center justify-center mb-3">
          <MessageSquare className="w-5 h-5 text-text-disabled" />
        </div>
        <p className="text-sm text-text-disabled">No follow-ups yet.</p>
        <p className="text-xs text-text-disabled mt-1">Add your first note below.</p>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {[...followUps].reverse().map((fu, idx, arr) => {
        const isLast = idx === arr.length - 1;
        return (
          <div key={fu.id} className="relative flex gap-4">
            {/* Timeline line + dot */}
            <div className="flex flex-col items-center">
              <div className="w-2.5 h-2.5 rounded-full bg-brand-primary border-2 border-background-primary mt-1 flex-shrink-0 z-10" />
              {!isLast && (
                <div className="w-px flex-1 bg-border-subtle mt-1" />
              )}
            </div>

            {/* Content */}
            <div className={`pb-5 flex-1 ${isLast ? 'pb-1' : ''}`}>
              <p className="text-sm text-text-primary leading-relaxed">{fu.comment}</p>
              <p className="text-xs text-text-disabled mt-1">
                {format(new Date(fu.timestamp), 'MMM d, yyyy · h:mm a')}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
