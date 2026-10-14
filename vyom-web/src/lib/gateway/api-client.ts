/**
 * Client for vyom-os (FastAPI). Attaches the session JWT and X-Tenant-ID.
 *
 * Until NEXT_PUBLIC_VYOM_OS_URL is set, calls are not sent.
 */

const osUrl = process.env.NEXT_PUBLIC_VYOM_OS_URL?.replace(/\/$/, '');

export type GatewayResult<T> =
  | { readonly ok: true; readonly data: T }
  | { readonly ok: false; readonly error: string };

function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match?.[1] ? decodeURIComponent(match[1]) : null;
}

export async function osFetch<T>(
  path: string,
  init: RequestInit & { readonly tenantId?: string } = {},
): Promise<GatewayResult<T>> {
  if (!osUrl) {
    return { ok: false, error: 'Vyom OS URL is not configured.' };
  }

  const { tenantId, headers: initHeaders, ...rest } = init;
  const token = readCookie('vyom_token');
  const tenant = tenantId ?? readCookie('vyom_tenant');

  const headers = new Headers(initHeaders);
  headers.set('content-type', headers.get('content-type') ?? 'application/json');
  if (token) headers.set('authorization', `Bearer ${token}`);
  if (tenant) headers.set('x-tenant-id', tenant);

  try {
    const response = await fetch(`${osUrl}${path.startsWith('/') ? path : `/${path}`}`, {
      ...rest,
      headers,
    });

    if (!response.ok) {
      return { ok: false, error: `Request failed with status ${response.status}` };
    }

    return { ok: true, data: (await response.json()) as T };
  } catch {
    return { ok: false, error: 'Could not reach Vyom OS.' };
  }
}
