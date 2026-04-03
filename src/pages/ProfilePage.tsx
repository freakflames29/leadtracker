import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import Layout from '../components/layout/Layout';
import Badge from '../components/ui/Badge';
import { format } from 'date-fns';
import { User, Mail, Calendar, Phone, Tag, XCircle } from 'lucide-react';

export default function ProfilePage() {
  const user = useAppSelector((s) => s.auth.user);
  const leads = useAppSelector((s) => s.leads.leads);
  const navigate = useNavigate();
  const droppedLeads = leads.filter((l) => l.dropped);

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-5">
        <h1 className="text-2xl font-bold text-text-primary mb-2">Profile</h1>

        {/* User card */}
        <div className="bg-background-secondary border border-border-subtle rounded-2xl p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-hover flex items-center justify-center shadow-lg shadow-brand-primary/20">
              <span className="text-2xl font-bold text-white">
                {user?.name?.charAt(0).toUpperCase() ?? 'U'}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-primary capitalize">{user?.name ?? 'User'}</h2>
              <p className="text-sm text-text-secondary mt-0.5">Personal Account</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 bg-background-elevated rounded-xl px-4 py-3">
              <Mail className="w-4 h-4 text-text-disabled flex-shrink-0" />
              <div>
                <p className="text-xs text-text-disabled mb-0.5">Email</p>
                <p className="text-sm text-text-primary font-medium">{user?.email ?? '—'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-background-elevated rounded-xl px-4 py-3">
              <User className="w-4 h-4 text-text-disabled flex-shrink-0" />
              <div>
                <p className="text-xs text-text-disabled mb-0.5">Display Name</p>
                <p className="text-sm text-text-primary font-medium capitalize">{user?.name ?? '—'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats summary */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Active Leads', value: leads.filter((l) => !l.dropped).length, color: 'text-text-primary' },
            { label: 'Follow-ups', value: leads.reduce((acc, l) => acc + l.followUps.length, 0), color: 'text-brand-primary' },
            { label: 'Dropped', value: droppedLeads.length, color: 'text-semantic-error' },
          ].map((s) => (
            <div key={s.label} className="bg-background-secondary border border-border-subtle rounded-2xl p-4 text-center">
              <p className={`text-2xl font-bold font-display ${s.color}`}>{s.value}</p>
              <p className="text-xs text-text-disabled mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Dropped leads */}
        <div className="bg-background-secondary border border-border-subtle rounded-2xl p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-7 h-7 rounded-lg bg-semantic-error-bg flex items-center justify-center">
              <XCircle className="w-3.5 h-3.5 text-semantic-error" />
            </div>
            <h2 className="text-base font-semibold text-text-primary">Dropped Leads</h2>
            <span className="ml-auto text-xs text-text-disabled bg-background-elevated border border-border-subtle px-2 py-0.5 rounded-full">
              {droppedLeads.length}
            </span>
          </div>

          {droppedLeads.length === 0 ? (
            <div className="flex flex-col items-center py-8 text-center">
              <p className="text-sm text-text-disabled">No dropped leads yet.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {droppedLeads.map((lead) => (
                <button
                  key={lead.id}
                  onClick={() => navigate(`/lead/${lead.id}`)}
                  className="w-full text-left flex items-center gap-4 bg-background-elevated hover:bg-background-primary border border-border-subtle rounded-xl px-4 py-3.5 transition-all duration-200 group"
                >
                  {/* Avatar */}
                  <div className="w-8 h-8 rounded-full bg-background-secondary border border-border-subtle flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-text-secondary">
                      {lead.name.charAt(0).toUpperCase()}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text-secondary group-hover:text-text-primary transition-colors truncate line-through decoration-text-disabled">
                      {lead.name}
                    </p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="flex items-center gap-1 text-xs text-text-disabled">
                        <Tag className="w-3 h-3" />{lead.category}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-text-disabled">
                        <Phone className="w-3 h-3" />{lead.phone}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                    <Badge type={lead.type} size="sm" />
                    <span className="flex items-center gap-1 text-xs text-text-disabled">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(lead.createdAt), 'MMM d')}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
