/**
 * D3: the public origin for metadataBase, canonical, sitemap and robots.
 * Order: NEXT_PUBLIC_SITE_URL (set when the real domain exists)
 * → VERCEL_PROJECT_PRODUCTION_URL → VERCEL_URL
 * → localhost for local builds.
 */
export function siteUrl(env: NodeJS.ProcessEnv = process.env): URL {
  const onVercel = !!(env.VERCEL === '1' || env.VERCEL_ENV || env.VERCEL_PROJECT_PRODUCTION_URL || env.VERCEL_URL);
  const candidates = [
    env.NEXT_PUBLIC_SITE_URL,
    ...[env.VERCEL_PROJECT_PRODUCTION_URL, env.VERCEL_URL].map(host => host ? `https://${host}` : undefined),
  ];
  for (const candidate of candidates) {
    if (!candidate) continue;
    const url = new URL(candidate);
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.pathname !== '/' || url.search || url.hash) {
      throw new Error('Site URL must be an HTTP(S) origin without a path, credentials, query or fragment');
    }
    // A stale local override must not leak into deployed metadata.
    const hostname = url.hostname.replace(/\.$/, '');
    const local = hostname === 'localhost' || hostname.endsWith('.localhost') || ['[::1]', '[::]', '0.0.0.0'].includes(hostname) || /^127\./.test(hostname);
    if (onVercel && local) continue;
    return url;
  }
  if (onVercel) throw new Error('Vercel requires a public site URL; localhost is not allowed');
  return new URL('http://localhost:3000');
}
