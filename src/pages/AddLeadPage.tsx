import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../store/hooks';
import { addLead } from '../store/leadsSlice';
import Layout from '../components/layout/Layout';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Textarea from '../components/ui/Textarea';
import Button from '../components/ui/Button';
import type { LeadType } from '../types';
import { createLead } from '../services/leads';
import { ArrowLeft, CheckCircle } from 'lucide-react';

interface FormValues {
  name: string;
  phone: string;
  type: string;
  category: string;
  feedback: string;
  followUpDate: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
  type?: string;
  category?: string;
  followUpDate?: string;
}

const LEAD_TYPE_OPTIONS = [
  { value: 'Hot', label: '🔥 Hot — High intent' },
  { value: 'Warm', label: '🌡️ Warm — Considering' },
  { value: 'Cold', label: '❄️ Cold — Unresponsive' },
];

export default function AddLeadPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [createdLeadId, setCreatedLeadId] = useState('');

  const [values, setValues] = useState<FormValues>({
    name: '',
    phone: '',
    type: '',
    category: '',
    feedback: '',
    followUpDate: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const set = (field: keyof FormValues) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
    setErrors((err) => ({ ...err, [field]: undefined }));
    setSubmitError('');
  };

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!values.name.trim()) e.name = 'Lead name is required.';
    if (!values.phone.trim()) e.phone = 'Phone number is required.';
    if (!values.type) e.type = 'Please select a lead type.';
    if (!values.category.trim()) e.category = 'Category is required.';
    if (!values.followUpDate) e.followUpDate = 'Follow-up date is required.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setSubmitError('');

    try {
      const newLead = await createLead({
        name: values.name.trim(),
        phone: values.phone.trim(),
        type: values.type as LeadType,
        category: values.category.trim(),
        feedback: values.feedback.trim(),
        followUpDate: values.followUpDate,
      });

      dispatch(addLead(newLead));
      setCreatedLeadId(newLead.id);
      setSubmitted(true);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save lead.';
      setSubmitError(message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <Layout>
        <div className="max-w-md mx-auto flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-full bg-semantic-success-bg border border-semantic-success/30 flex items-center justify-center mb-5">
            <CheckCircle className="w-8 h-8 text-semantic-success" />
          </div>
          <h2 className="text-xl font-bold text-text-primary mb-2">Lead Added!</h2>
          <p className="text-sm text-text-secondary mb-8">
            <strong className="text-text-primary">{values.name}</strong> has been added to your leads.
          </p>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => { setSubmitted(false); setCreatedLeadId(''); setValues({ name: '', phone: '', type: '', category: '', feedback: '', followUpDate: '' }); }}>
              Add Another
            </Button>
            <Button onClick={() => navigate(`/lead/${createdLeadId}`)}>View Lead</Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl text-text-disabled hover:text-text-primary hover:bg-background-elevated transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Add New Lead</h1>
            <p className="text-sm text-text-secondary mt-0.5">Fill in the details to track a new lead</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* Basic Info */}
          <div className="bg-background-secondary border border-border-subtle rounded-2xl p-6 mb-4">
            <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-5">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input
                id="lead-name"
                label="Lead Name"
                placeholder="e.g. Arjun Mehta"
                value={values.name}
                onChange={set('name')}
                error={errors.name}
              />
              <Input
                id="lead-phone"
                label="Phone Number"
                placeholder="e.g. +91 98765 43210"
                value={values.phone}
                onChange={set('phone')}
                error={errors.phone}
              />
              <Select
                id="lead-type"
                label="Lead Type"
                value={values.type}
                onChange={set('type')}
                options={LEAD_TYPE_OPTIONS}
                error={errors.type}
              />
              <Input
                id="lead-category"
                label="Category"
                placeholder="e.g. Real Estate, SaaS"
                value={values.category}
                onChange={set('category')}
                error={errors.category}
              />
            </div>
          </div>

          {/* Follow-up & Feedback */}
          <div className="bg-background-secondary border border-border-subtle rounded-2xl p-6 mb-6">
            <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-5">
              Follow-up & Notes
            </h3>
            <div className="space-y-5">
              <Input
                id="follow-up-date"
                label="Follow-up Date"
                type="date"
                value={values.followUpDate}
                onChange={set('followUpDate')}
                error={errors.followUpDate}
              />
              <Textarea
                id="feedback"
                label="Initial Feedback / Notes"
                placeholder="Describe the lead's current status, intent level, or any key notes..."
                value={values.feedback}
                onChange={set('feedback')}
                rows={4}
              />
            </div>
          </div>

          {submitError && (
            <div className="mb-6 rounded-2xl border border-semantic-error/30 bg-semantic-error-bg px-4 py-3">
              <p className="text-sm text-semantic-error">{submitError}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" type="button" onClick={() => navigate('/dashboard')}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              {loading ? 'Saving...' : 'Save Lead'}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
