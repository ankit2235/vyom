'use client';

import { useId, useState } from 'react';
import { siteConfig } from '~/site.config';
import { contactPage } from '@/content/contact';
import { submitBenchmarkRequest, type BenchmarkRequest } from '@/lib/api';
import { ArrowRightIcon, CheckIcon } from '@/components/icons';
import { Button } from '@/components/ui';
import { cn } from '@/lib/cn';

const { form } = contactPage;

type FieldName = 'name' | 'email' | 'company' | 'role' | 'molecules' | 'message';
type Errors = Partial<Record<'name' | 'email' | 'company', string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EMPTY: Record<FieldName, string> = {
  name: '',
  email: '',
  company: '',
  role: '',
  molecules: '',
  message: '',
};

/**
 * Collects a benchmark request and hands it to submitBenchmarkRequest().
 *
 * Today that builds a mailto: link, so nothing is sent anywhere and nothing
 * is stored. When the backend lands, only src/lib/api.ts changes.
 */
export function BenchmarkForm() {
  const id = useId();
  const [values, setValues] = useState(EMPTY);
  const [interest, setInterest] = useState<BenchmarkRequest['interest']>(undefined);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [mailto, setMailto] = useState<string | null>(null);
  const [failure, setFailure] = useState<string | null>(null);

  function validate(): Errors {
    const next: Errors = {};
    if (!values.name.trim()) next.name = form.errors.name;
    if (!values.email.trim()) next.email = form.errors.email;
    else if (!EMAIL.test(values.email.trim())) next.email = form.errors.emailFormat;
    if (!values.company.trim()) next.company = form.errors.company;
    return next;
  }

  function set(field: FieldName, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found = validate();
    setErrors(found);

    if (Object.keys(found).length > 0) {
      // Move focus to the first field that needs attention.
      const first = (['name', 'email', 'company'] as const).find((key) => found[key]);
      if (first) document.getElementById(`${id}-${first}`)?.focus();
      return;
    }

    const request: BenchmarkRequest = {
      name: values.name.trim(),
      email: values.email.trim(),
      company: values.company.trim(),
      ...(values.role.trim() ? { role: values.role.trim() } : {}),
      ...(interest ? { interest } : {}),
      message: [
        values.molecules.trim() ? `Molecules: ${values.molecules.trim()}` : null,
        values.message.trim(),
      ]
        .filter(Boolean)
        .join('\n\n'),
    };

    const result = await submitBenchmarkRequest(request);

    if (!result.ok) {
      setFailure(result.error);
      return;
    }

    setSubmitted(true);
    if (result.via === 'mailto' && result.mailto) {
      setMailto(result.mailto);
      window.location.href = result.mailto;
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col gap-4 rounded-panel border border-accent-line bg-surface p-7">
        <span className="flex size-10 items-center justify-center rounded-button border border-accent-line bg-accent-tint text-accent">
          <CheckIcon />
        </span>
        <h3 className="m-0 text-[21px] font-semibold tracking-[-0.01em] text-primary">
          {form.successHeading}
        </h3>
        <p className="m-0 text-[15.5px] leading-[1.6] text-muted">{form.successBody}</p>
        <div className="flex flex-col gap-2 border-t border-line pt-4">
          <span className="font-mono text-[11px] tracking-[0.1em] text-meta">
            {form.fallbackLabel}
          </span>
          <a
            href={mailto ?? `mailto:${siteConfig.email}`}
            className="font-mono text-[13px] tracking-[0.04em] text-accent underline-offset-4 hover:underline"
          >
            {siteConfig.email}
          </a>
        </div>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={onSubmit}
      className="flex flex-col gap-5 rounded-panel border border-strong bg-panel p-7"
    >
      <h3 className="m-0 text-[21px] font-semibold tracking-[-0.01em] text-primary">
        {form.heading}
      </h3>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(240px,100%),1fr))] gap-5">
        <Field
          id={`${id}-name`}
          label={form.fields.name.label}
          placeholder={form.fields.name.placeholder}
          value={values.name}
          onChange={(v) => set('name', v)}
          error={errors.name}
          required
          autoComplete="name"
        />
        <Field
          id={`${id}-email`}
          label={form.fields.email.label}
          placeholder={form.fields.email.placeholder}
          value={values.email}
          onChange={(v) => set('email', v)}
          error={errors.email}
          required
          type="email"
          autoComplete="email"
        />
        <Field
          id={`${id}-company`}
          label={form.fields.company.label}
          placeholder={form.fields.company.placeholder}
          value={values.company}
          onChange={(v) => set('company', v)}
          error={errors.company}
          required
          autoComplete="organization"
        />
        <Field
          id={`${id}-role`}
          label={form.fields.role.label}
          placeholder={form.fields.role.placeholder}
          value={values.role}
          onChange={(v) => set('role', v)}
          autoComplete="organization-title"
        />
        <Field
          id={`${id}-molecules`}
          label={form.fields.molecules.label}
          placeholder={form.fields.molecules.placeholder}
          value={values.molecules}
          onChange={(v) => set('molecules', v)}
          inputMode="numeric"
        />

        <div className="flex flex-col justify-end gap-2">
          <label
            htmlFor={`${id}-interest`}
            className="flex flex-wrap items-center gap-2 text-[14px] font-medium text-secondary"
          >
            {form.fields.interest.label}
            <span className="font-mono text-[10.5px] tracking-[0.08em] text-meta">
              {form.optional.toUpperCase()}
            </span>
          </label>
          <select
            id={`${id}-interest`}
            value={interest ?? ''}
            onChange={(event) =>
              setInterest((event.target.value || undefined) as BenchmarkRequest['interest'])
            }
            className="min-h-[46px] rounded-button border border-button bg-surface px-3.5 text-[15px] text-primary"
          >
            <option value="">—</option>
            {form.interestOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor={`${id}-message`}
          className="flex flex-wrap items-center gap-2 text-[14px] font-medium text-secondary"
        >
          {form.fields.message.label}
          <span className="font-mono text-[10.5px] tracking-[0.08em] text-meta">
            {form.optional.toUpperCase()}
          </span>
        </label>
        <textarea
          id={`${id}-message`}
          rows={4}
          value={values.message}
          placeholder={form.fields.message.placeholder}
          onChange={(event) => set('message', event.target.value)}
          className="resize-y rounded-button border border-button bg-surface px-3.5 py-3 text-[15px] text-primary placeholder:text-meta"
        />
      </div>

      {failure ? (
        <p role="alert" className="m-0 text-[14.5px] text-amber">
          {failure}
        </p>
      ) : null}

      <div className="flex flex-col gap-4 border-t border-line pt-5">
        <Button type="submit" size="lg" className="self-start">
          {form.submit}
          <ArrowRightIcon />
        </Button>
        <p className="m-0 max-w-[560px] text-[13.5px] leading-[1.6] text-meta">
          {form.privacyNote}
        </p>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  type = 'text',
  ...rest
}: {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly placeholder?: string;
  readonly error?: string | undefined;
  readonly required?: boolean;
  readonly type?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'id' | 'value' | 'onChange' | 'type'>) {
  return (
    <div className="flex flex-col justify-end gap-2">
      <label
        htmlFor={id}
        className="flex flex-wrap items-center gap-2 text-[14px] font-medium text-secondary"
      >
        {label}
        {!required ? (
          <span className="font-mono text-[10.5px] tracking-[0.08em] text-meta">
            {contactPage.form.optional.toUpperCase()}
          </span>
        ) : null}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          'min-h-[46px] rounded-button border bg-surface px-3.5 text-[15px] text-primary placeholder:text-meta',
          error ? 'border-amber' : 'border-button',
        )}
        {...rest}
      />
      {error ? (
        <p id={`${id}-error`} className="m-0 text-[13.5px] text-amber">
          {error}
        </p>
      ) : null}
    </div>
  );
}
