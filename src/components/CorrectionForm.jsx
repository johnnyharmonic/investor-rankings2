'use client';
import { useState } from 'react';
import { METRICS } from '@/data/investors';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HugeiconsIcon } from '@hugeicons/react';
import { Edit02Icon, Cancel01Icon, Tick02Icon } from '@hugeicons/core-free-icons';

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
    console.log('Correction submitted:', { investorSlug, ...form });
    setSubmitted(true);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="lg">
          <HugeiconsIcon icon={Edit02Icon} strokeWidth={2} />
          Submit correction
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[28rem] p-5" showCloseButton={false}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-heading font-semibold text-sm text-foreground">Suggest a data correction</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              We review all submissions. Corrections are reflected in the next data update.
            </p>
          </div>
          <Button variant="ghost" size="icon-sm" onClick={() => setOpen(false)} aria-label="Close">
            <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
          </Button>
        </div>

        {submitted ? (
          <div className="text-center py-8">
            <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-500/15 rounded-full flex items-center justify-center mx-auto mb-3">
              <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} className="size-5 text-emerald-600 dark:text-emerald-300" />
            </div>
            <h4 className="font-heading font-semibold text-sm text-foreground mb-1">Submission received</h4>
            <p className="text-xs text-muted-foreground mb-4">
              Our data team will review your feedback within 5 business days.
            </p>
            <Button asChild variant="link" size="sm">
              <a href="https://harmonic.ai/contact" target="_blank" rel="noopener noreferrer">
                Want to talk to us directly? Book a call
              </a>
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Your name" name="name" value={form.name} onChange={handleChange} placeholder="Jane Smith" required />
              <Field label="Work email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="jane@fund.vc" required />
            </div>
            <Field label="Fund name" name="fund" value={form.fund} onChange={handleChange} placeholder="Acme Ventures" required />
            <div className="space-y-1.5">
              <Label htmlFor="metric">Metric in question</Label>
              <Select value={form.metric} onValueChange={v => setForm(f => ({ ...f, metric: v }))} required>
                <SelectTrigger id="metric" className="w-full">
                  <SelectValue placeholder="Select a metric" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(METRICS).map(m => (
                    <SelectItem key={m.id} value={m.id}>{m.fullLabel}</SelectItem>
                  ))}
                  <SelectItem value="composite">Composite score / Overall ranking</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="issue">What do you believe is incorrect?</Label>
              <Textarea
                id="issue"
                name="issue"
                value={form.issue}
                onChange={handleChange}
                required
                rows={3}
                placeholder="Describe the issue with the current data..."
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="evidence">
                Supporting evidence <span className="text-muted-foreground font-normal">(optional)</span>
              </Label>
              <Textarea
                id="evidence"
                name="evidence"
                value={form.evidence}
                onChange={handleChange}
                rows={2}
                placeholder="Links, documents, or data sources that support your correction..."
              />
            </div>
            <Button type="submit" className="w-full" size="lg">
              Submit correction
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, name, value, onChange, placeholder, type = 'text', required }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
}
