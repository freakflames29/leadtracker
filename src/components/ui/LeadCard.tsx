import type { Lead } from '../../types';
import Badge from './Badge';
import { Phone, Calendar, Tag } from 'lucide-react';
import { format } from 'date-fns';

interface LeadCardProps {
  lead: Lead;
  onClick: () => void;
}

const accentBorder: Record<string, string> = {
  Hot: 'border-l-[#FF5B5B]',
  Warm: 'border-l-[#FFB347]',
  Cold: 'border-l-[#5BA8FF]',
};

const accentGlow: Record<string, string> = {
  Hot: 'hover:shadow-[0_4px_24px_-4px_rgba(255,91,91,0.25)]',
  Warm: 'hover:shadow-[0_4px_24px_-4px_rgba(255,179,71,0.25)]',
  Cold: 'hover:shadow-[0_4px_24px_-4px_rgba(91,168,255,0.25)]',
};

export default function LeadCard({ lead, onClick }: LeadCardProps) {
  const followUpDate = lead.followUpDate
    ? format(new Date(lead.followUpDate), 'MMM d, yyyy')
    : '—';

  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left group bg-background-secondary border border-border-subtle
        border-l-4 ${accentBorder[lead.type]} rounded-2xl p-5
        transition-all duration-300 cursor-pointer
        hover:border-border-default hover:-translate-y-0.5
        ${accentGlow[lead.type]}
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/50
      `}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-text-primary truncate group-hover:text-white transition-colors">
            {lead.name}
          </h3>
        </div>
        <Badge type={lead.type} size="sm" />
      </div>

      {/* Details */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <Phone className="w-3.5 h-3.5 flex-shrink-0 text-text-disabled" />
          <span>{lead.phone}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <Tag className="w-3.5 h-3.5 flex-shrink-0 text-text-disabled" />
          <span>{lead.category}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <Calendar className="w-3.5 h-3.5 flex-shrink-0 text-text-disabled" />
          <span>Follow-up: <span className="text-text-primary font-medium">{followUpDate}</span></span>
        </div>
      </div>

      {/* Footer */}
      {lead.followUps.length > 0 && (
        <div className="mt-4 pt-3 border-t border-border-subtle flex items-center gap-1.5">
          <div className="flex -space-x-1">
            {[...Array(Math.min(3, lead.followUps.length))].map((_, i) => (
              <div key={i} className="w-5 h-5 rounded-full bg-background-elevated border border-border-subtle" />
            ))}
          </div>
          <span className="text-xs text-text-disabled">
            {lead.followUps.length} follow-up{lead.followUps.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}
    </button>
  );
}
