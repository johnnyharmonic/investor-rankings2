'use client';
import { useState } from 'react';
import { METRICS } from '@/data/investors';

export default function CorrectionForm({ investorName, investorSlug }) {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    fund: investorName || '',
    metric: '',
    issue: '',
    evidence: '',
  });

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    // TODO: wire to backend / CRM
    console.log('Correction submitted:', { investorSlug, ...form });
    setSubmitted(true);
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-sm text-gray-500 hover:text-gray-800 border border-gray-200 hover:border-gray-400 rounded-lg px-4 py-2 transition-colors flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        Dispute this data
      </button>
    );
  }

  return (
    <div className="border border-gray-200 rounded-xl p-6 bg-gray-50">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900">Suggest a Data Correction</h3>
          <p className="text-sm text-gray-500 mt-0.5">We review all submissions. Corrections are reflected in the next data update.</p>
        </div>
        <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {submitted ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h4 className="font-semibold text-gray-900 mb-1">Submission received</h4>
          <p className="text-sm text-gray-500 mb-4">Our data team will review your feedback within 5 business days.</p>
          <a
            href="https://harmonic.ai/contact"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-harmonic-500 hover:underline"
          >
            Want to talk to us directly? Book a call →
          </a>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Your name" name="name" value={form.name} onChange={handleChange} placeholder="Jane Smith" required />
            <Field label="Work email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="jane@fund.vc" required />
          </div>
          <Field label="Fund name" name="fund" value={form.fund} onChange={handleChange} placeholder="Acme Ventures" required />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Metric in question</label>
            <select
              name="metric"
              value={form.metric}
              onChange={handleChange}
              required
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-harmonic-500 bg-white"
            >
              <option value="">Select a metric</option>
              {Object.values(METRICS).map(m => (
                <option key={m.id} value={m.id}>{m.fullLabel}</option>
              ))}
              <option value="composite">Composite Score / Overall Ranking</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">What do you believe is incorrect?</label>
            <textarea
              name="issue"
              value={form.issue}
              onChange={handleChange}
              required
              rows={3}
              placeholder="Describe the issue with the current data..."
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-harmonic-500 resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Supporting evidence <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              name="evidence"
              value={form.evidence}
              onChange={handleChange}
              rows={2}
              placeholder="Links, documents, or data sources that support your correction..."
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-harmonic-500 resize-none"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-harmonic-500 text-white py-2.5 rounded-lg font-medium text-sm hover:bg-harmonic-600 transition-colors"
          >
            Submit correction
          </button>
        </form>
      )}
    </div>
  );
}

function Field({ label, name, value, onChange, placeholder, type = 'text', required }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-harmonic-500"
      />
    </div>
  );
}
