import { type ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setLeads } from '../store/leadsSlice';
import Layout from '../components/layout/Layout';
import LeadCard from '../components/ui/LeadCard';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { fetchLeads } from '../services/leads';
import { PlusCircle, Flame, Thermometer, Snowflake, LayoutGrid, CalendarDays } from 'lucide-react';

type FilterType = 'All' | 'Hot' | 'Warm' | 'Cold';

const filterConfig: { label: FilterType; icon: ReactNode; activeClass: string }[] = [
  { label: 'All', icon: <LayoutGrid className="w-3.5 h-3.5" />, activeClass: 'bg-background-elevated text-text-primary border-border-default' },
  { label: 'Hot', icon: <Flame className="w-3.5 h-3.5" />, activeClass: 'bg-[#2A1515] text-[#FF8080] border-[#FF5B5B]/40' },
  { label: 'Warm', icon: <Thermometer className="w-3.5 h-3.5" />, activeClass: 'bg-[#2A2010] text-[#FFD080] border-[#FFB347]/40' },
  { label: 'Cold', icon: <Snowflake className="w-3.5 h-3.5" />, activeClass: 'bg-[#111E2A] text-[#80C4FF] border-[#5BA8FF]/40' },
];

const skeletonStats = [
  'bg-background-secondary',
  'bg-[#2A1515]',
  'bg-[#2A2010]',
  'bg-[#111E2A]',
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const leads = useAppSelector((s) => s.leads.leads);
  const [filter, setFilter] = useState<FilterType>('All');
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const loadLeads = async () => {
      setLoading(true);
      setError('');

      try {
        const data = await fetchLeads();

        if (!cancelled) {
          dispatch(setLeads(data));
        }
      } catch (fetchError) {
        if (!cancelled) {
          setError(fetchError instanceof Error ? fetchError.message : 'Failed to load leads.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadLeads();

    return () => {
      cancelled = true;
    };
  }, [dispatch]);

  const activeLeads = leads.filter((l) => !l.dropped);
  const typeFilteredLeads = filter === 'All' ? activeLeads : activeLeads.filter((l) => l.type === filter);
  const filtered = selectedDate
    ? typeFilteredLeads.filter((l) => l.followUpDate === selectedDate)
    : typeFilteredLeads;

  const stats = {
    total: activeLeads.length,
    hot: activeLeads.filter((l) => l.type === 'Hot').length,
    warm: activeLeads.filter((l) => l.type === 'Warm').length,
    cold: activeLeads.filter((l) => l.type === 'Cold').length,
  };

  return (
    <Layout>
      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
          <p className="text-sm text-text-secondary mt-0.5">
            {filtered.length} lead{filtered.length !== 1 ? 's' : ''} shown
          </p>
        </div>
        <Button
          icon={<PlusCircle className="w-4 h-4" />}
          onClick={() => navigate('/add-lead')}
        >
          Add Lead
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {loading ? (
          skeletonStats.map((bgClass, index) => (
            <div
              key={index}
              className={`${bgClass} border border-border-subtle rounded-2xl px-5 py-4 animate-pulse`}
            >
              <div className="h-3 w-16 rounded bg-background-elevated/80 mb-3" />
              <div className="h-8 w-12 rounded bg-background-elevated/80" />
            </div>
          ))
        ) : (
          [
            { label: 'Total', value: stats.total, color: 'text-text-primary', bg: 'bg-background-secondary' },
            { label: 'Hot', value: stats.hot, color: 'text-[#FF8080]', bg: 'bg-[#2A1515]' },
            { label: 'Warm', value: stats.warm, color: 'text-[#FFD080]', bg: 'bg-[#2A2010]' },
            { label: 'Cold', value: stats.cold, color: 'text-[#80C4FF]', bg: 'bg-[#111E2A]' },
          ].map((stat) => (
            <div
              key={stat.label}
              className={`${stat.bg} border border-border-subtle rounded-2xl px-5 py-4`}
            >
              <p className="text-xs text-text-disabled font-medium uppercase tracking-wider mb-1">{stat.label}</p>
              <p className={`text-3xl font-bold font-display ${stat.color}`}>{stat.value}</p>
            </div>
          ))
        )}
      </div>

      {/* Filter tabs */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          {loading ? (
            filterConfig.map(({ label }) => (
              <div
                key={label}
                className="h-10 w-24 rounded-xl border border-border-subtle bg-background-elevated animate-pulse"
              />
            ))
          ) : (
            filterConfig.map(({ label, icon, activeClass }) => (
              <button
                key={label}
                onClick={() => setFilter(label)}
                className={`
                  flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium border transition-all duration-200
                  ${filter === label
                    ? activeClass
                    : 'bg-background-elevated border-border-subtle text-text-secondary hover:text-text-primary hover:border-border-default'
                  }
                `}
              >
                {icon}
                {label}
                {label !== 'All' && (
                  <span className="text-xs opacity-60 ml-0.5">
                    ({label === 'Hot' ? stats.hot : label === 'Warm' ? stats.warm : stats.cold})
                  </span>
                )}
              </button>
            ))
          )}
        </div>

        <div className="w-full lg:w-[280px]">
          <Input
            id="dashboard-followup-date"
            label="Filter By follow up date"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            icon={<CalendarDays className="w-4 h-4" />}
          />
        </div>
      </div>

      {selectedDate && !loading && (
        <div className="mb-6 flex items-center justify-between gap-3 rounded-2xl border border-border-subtle bg-background-secondary px-4 py-3">
          <p className="text-sm text-text-secondary">
            Showing leads with follow-up date on <span className="font-medium text-text-primary">{selectedDate}</span>.
          </p>
          <button
            onClick={() => setSelectedDate('')}
            className="text-sm font-medium text-brand-primary transition-colors hover:text-text-primary"
          >
            Clear
          </button>
        </div>
      )}

      {/* Lead grid */}
      {error && (
        <div className="mb-6 rounded-2xl border border-semantic-error/30 bg-semantic-error-bg px-4 py-3">
          <p className="text-sm text-semantic-error">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="bg-background-secondary border border-border-subtle rounded-2xl p-5 animate-pulse"
            >
              <div className="flex items-start justify-between gap-3 mb-5">
                <div className="flex-1">
                  <div className="h-5 w-32 rounded bg-background-elevated mb-2" />
                  <div className="h-3 w-24 rounded bg-background-elevated" />
                </div>
                <div className="h-7 w-16 rounded-full bg-background-elevated" />
              </div>

              <div className="space-y-3 mb-5">
                <div className="h-3 w-full rounded bg-background-elevated" />
                <div className="h-3 w-5/6 rounded bg-background-elevated" />
                <div className="h-3 w-2/3 rounded bg-background-elevated" />
              </div>

              <div className="flex items-center justify-between">
                <div className="h-3 w-20 rounded bg-background-elevated" />
                <div className="h-8 w-24 rounded-xl bg-background-elevated" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((lead) => (
            <LeadCard
              key={lead.id}
              lead={lead}
              onClick={() => navigate(`/lead/${lead.id}`)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-background-secondary border border-border-subtle flex items-center justify-center mb-4">
            <LayoutGrid className="w-7 h-7 text-text-disabled" />
          </div>
          <h3 className="text-base font-semibold text-text-secondary">No leads found</h3>
          <p className="text-sm text-text-disabled mt-1 mb-6">
            {selectedDate
              ? 'No leads match the selected follow-up date.'
              : filter !== 'All'
                ? `No ${filter} leads yet.`
                : 'Start by adding your first lead.'}
          </p>
          <Button icon={<PlusCircle className="w-4 h-4" />} onClick={() => navigate('/add-lead')}>
            Add Lead
          </Button>
        </div>
      )}
    </Layout>
  );
}
