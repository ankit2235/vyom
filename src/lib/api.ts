/**
 * Typed boundary to the future backend.
 *
 * Today every call resolves locally — submitBenchmarkRequest() builds a
 * pre-filled mailto: link. When the backend lands it will POST to
 * NEXT_PUBLIC_API_URL instead. **This should be the only file that changes.**
 */

import { siteConfig } from '~/site.config';

export type BenchmarkRequest = {
  readonly name: string;
  readonly email: string;
  readonly company: string;
  readonly role?: string;
  /** Which workflow they want benchmarked. */
  readonly interest?: 'cases' | 'literature' | 'audit' | 'other';
  readonly message?: string;
};

export type SubmitResult =
  | { readonly ok: true; readonly via: 'mailto' | 'api'; readonly mailto?: string }
  | { readonly ok: false; readonly error: string };

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

function buildMailto(request: BenchmarkRequest): string {
  const subject = `Benchmark request — ${request.company}`;
  const body = [
    `Name: ${request.name}`,
    `Email: ${request.email}`,
    `Company: ${request.company}`,
    request.role ? `Role: ${request.role}` : null,
    request.interest ? `Interested in: ${request.interest}` : null,
    '',
    request.message ?? '',
  ]
    .filter((line) => line !== null)
    .join('\n');

  return `mailto:${siteConfig.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/**
 * Submits a benchmark request.
 *
 * Without NEXT_PUBLIC_API_URL this returns a mailto: link for the caller to
 * open — no third-party form service, no network call, no tracking.
 */
export async function submitBenchmarkRequest(request: BenchmarkRequest): Promise<SubmitResult> {
  if (!apiUrl) {
    return { ok: true, via: 'mailto', mailto: buildMailto(request) };
  }

  try {
    const response = await fetch(`${apiUrl}/benchmark-requests`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      return { ok: false, error: `Request failed with status ${response.status}` };
    }

    return { ok: true, via: 'api' };
  } catch {
    return { ok: false, error: 'Could not reach the server. Please email us instead.' };
  }
}

/** A plain mailto: link for the places that just need one. */
export function contactMailto(subject?: string): string {
  const base = `mailto:${siteConfig.email}`;
  return subject ? `${base}?subject=${encodeURIComponent(subject)}` : base;
}
