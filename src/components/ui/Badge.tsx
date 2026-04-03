import type { LeadType } from '../../types';

interface BadgeProps {
  type: LeadType;
  size?: 'sm' | 'md';
}

const config: Record<LeadType, { label: string; classes: string; dot: string }> = {
  Hot: {
    label: 'Hot',
    classes: 'bg-[#2A1515] text-[#FF8080] border border-[#FF5B5B]/30',
    dot: 'bg-[#FF5B5B]',
  },
  Warm: {
    label: 'Warm',
    classes: 'bg-[#2A2010] text-[#FFD080] border border-[#FFB347]/30',
    dot: 'bg-[#FFB347]',
  },
  Cold: {
    label: 'Cold',
    classes: 'bg-[#111E2A] text-[#80C4FF] border border-[#5BA8FF]/30',
    dot: 'bg-[#5BA8FF]',
  },
};

export default function Badge({ type, size = 'md' }: BadgeProps) {
  const { label, classes, dot } = config[type];
  const padding = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-3 py-1 text-xs';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold tracking-wider uppercase ${padding} ${classes}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
}
