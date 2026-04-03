import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { dropLead, addFollowUp, upsertLead } from '../store/leadsSlice';
import Layout from '../components/layout/Layout';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Timeline from '../components/ui/Timeline';
import type { FollowUp } from '../types';
import { createLeadFollowUp, dropLeadById, fetchLeadById } from '../services/leads';
import { format } from 'date-fns';
import {
  ArrowLeft, Phone, Calendar, Tag, MessageSquare,
  AlertTriangle, Send, FileText
} from 'lucide-react';

export default function LeadDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const lead = useAppSelector((s) => s.leads.leads.find((l) => l.id === id));

  const [comment, setComment] = useState('');
  const [commentError, setCommentError] = useState('');
  const [confirmDrop, setConfirmDrop] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [pageError, setPageError] = useState('');

  useEffect(() => {
    if (!id) {
      setPageLoading(false);
      setPageError('Lead not found.');
      return;
    }

    if (lead) {
      setPageLoading(false);
    }

    let cancelled = false;

    const loadLead = async () => {
      setPageLoading(true);
      setPageError('');

      try {
        const freshLead = await fetchLeadById(id);

        if (cancelled) {
          return;
        }

        if (!freshLead) {
          setPageError('Lead not found.');
          return;
        }

        dispatch(upsertLead(freshLead));
      } catch (error) {
        if (!cancelled) {
          setPageError(error instanceof Error ? error.message : 'Failed to load lead.');
        }
      } finally {
        if (!cancelled) {
          setPageLoading(false);
        }
      }
    };

    void loadLead();

    return () => {
      cancelled = true;
    };
  }, [dispatch, id]);

  if (pageLoading) {
    return (
      <Layout>
        <div className="text-center py-24">
          <p className="text-text-secondary text-lg">Loading lead...</p>
        </div>
      </Layout>
    );
  }

  if (!lead) {
    return (
      <Layout>
        <div className="text-center py-24">
          <p className="text-text-secondary text-lg">{pageError || 'Lead not found.'}</p>
          <Button variant="ghost" className="mt-4" onClick={() => navigate('/dashboard')}>
            ← Back to Dashboard
          </Button>
        </div>
      </Layout>
    );
  }

  const handleAddFollowUp = async () => {
    if (!comment.trim()) {
      setCommentError('Please enter a comment.');
      return;
    }

    setActionLoading(true);
    setCommentError('');

    try {
      const fu: FollowUp = await createLeadFollowUp(lead.id, comment.trim());
      dispatch(addFollowUp({ leadId: lead.id, followUp: fu }));
      setComment('');
    } catch (error) {
      setCommentError(error instanceof Error ? error.message : 'Failed to add follow-up.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDrop = async () => {
    if (!confirmDrop) { setConfirmDrop(true); return; }

    setActionLoading(true);
    setPageError('');

    try {
      await dropLeadById(lead.id);
      dispatch(dropLead(lead.id));
      navigate('/dashboard');
    } catch (error) {
      setPageError(error instanceof Error ? error.message : 'Failed to drop lead.');
      setConfirmDrop(false);
    } finally {
      setActionLoading(false);
    }
  };

  const accentColor: Record<string, string> = {
    Hot: '#FF5B5B', Warm: '#FFB347', Cold: '#5BA8FF',
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        {/* Back */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-sm text-text-disabled hover:text-text-primary mb-6 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Dashboard
        </button>

        {/* Lead header card */}
        <div
          className="bg-background-secondary border border-border-subtle rounded-2xl p-6 mb-4"
          style={{ borderTopColor: accentColor[lead.type], borderTopWidth: 3 }}
        >
          {pageError && (
            <div className="mb-4 rounded-xl border border-semantic-error/30 bg-semantic-error-bg px-4 py-3">
              <p className="text-sm text-semantic-error">{pageError}</p>
            </div>
          )}

          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-text-primary mb-1.5">{lead.name}</h1>
              <Badge type={lead.type} />
            </div>
            <Button
              variant="danger"
              size="sm"
              onClick={handleDrop}
              loading={actionLoading}
              icon={<AlertTriangle className="w-3.5 h-3.5" />}
            >
              {confirmDrop ? 'Confirm Drop' : 'Drop Lead'}
            </Button>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-start gap-3 bg-background-elevated rounded-xl p-3.5">
              <Phone className="w-4 h-4 text-text-disabled mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-text-disabled font-medium mb-0.5">Phone</p>
                <p className="text-sm text-text-primary font-medium">{lead.phone}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-background-elevated rounded-xl p-3.5">
              <Tag className="w-4 h-4 text-text-disabled mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-text-disabled font-medium mb-0.5">Category</p>
                <p className="text-sm text-text-primary font-medium">{lead.category}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-background-elevated rounded-xl p-3.5">
              <Calendar className="w-4 h-4 text-text-disabled mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-text-disabled font-medium mb-0.5">Follow-up Date</p>
                <p className="text-sm text-text-primary font-medium">
                  {format(new Date(lead.followUpDate), 'MMM d, yyyy')}
                </p>
              </div>
            </div>
          </div>

          {/* Feedback */}
          {lead.feedback && (
            <div className="mt-4 flex items-start gap-3 bg-background-elevated rounded-xl p-3.5">
              <FileText className="w-4 h-4 text-text-disabled mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-text-disabled font-medium mb-0.5">Notes / Feedback</p>
                <p className="text-sm text-text-primary leading-relaxed">{lead.feedback}</p>
              </div>
            </div>
          )}

          {/* Added date */}
          <p className="text-xs text-text-disabled mt-4">
            Added {format(new Date(lead.createdAt), 'MMM d, yyyy')}
          </p>
        </div>

        {/* Follow-up section */}
        <div className="bg-background-secondary border border-border-subtle rounded-2xl p-6">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-7 h-7 rounded-lg bg-brand-subtle flex items-center justify-center">
              <MessageSquare className="w-3.5 h-3.5 text-brand-primary" />
            </div>
            <h2 className="text-base font-semibold text-text-primary">Follow-up History</h2>
            {lead.followUps.length > 0 && (
              <span className="ml-auto text-xs text-text-disabled bg-background-elevated border border-border-subtle px-2 py-0.5 rounded-full">
                {lead.followUps.length} note{lead.followUps.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {/* Add follow-up */}
          {!lead.dropped && (
            <div className="mb-6 p-4 bg-background-elevated rounded-xl border border-border-subtle">
              <label htmlFor="follow-up-input" className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-2.5">
                Add Note
              </label>
              <textarea
                id="follow-up-input"
                value={comment}
                onChange={(e) => { setComment(e.target.value); setCommentError(''); }}
                placeholder="What happened in this interaction?"
                rows={3}
                className={`
                  w-full bg-background-secondary border rounded-xl px-4 py-3 text-sm
                  text-text-primary placeholder:text-text-disabled resize-none outline-none
                  transition-all duration-200 border-border-subtle
                  focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20
                  ${commentError ? 'border-semantic-error' : ''}
                `}
              />
              {commentError && (
                <p className="text-xs text-semantic-error mt-1.5">{commentError}</p>
              )}
              <div className="flex justify-end mt-3">
                <Button
                  size="sm"
                  icon={<Send className="w-3.5 h-3.5" />}
                  loading={actionLoading}
                  onClick={handleAddFollowUp}
                >
                  Add Follow-up
                </Button>
              </div>
            </div>
          )}

          {lead.dropped && (
            <div className="mb-6 px-4 py-3 bg-semantic-error-bg border border-semantic-error/20 rounded-xl">
              <p className="text-sm text-semantic-error font-medium">This lead has been dropped.</p>
            </div>
          )}

          {/* Timeline */}
          <Timeline followUps={lead.followUps} />
        </div>
      </div>
    </Layout>
  );
}
