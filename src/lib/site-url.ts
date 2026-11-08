/**
 * D3: the public origin for metadataBase, canonical, sitemap and robots.
 * Order: NEXT_PUBLIC_SITE_URL (set when the real domain exists)
 * → Vercel's production host (the *.vercel.app domain now, the custom domain once attached)
 * → localhost for local builds.
 */
export function siteUrl(): URL {
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  const url = new URL(process.env.NEXT_PUBLIC_SITE_URL || (vercel ? `https://${vercel}` : "http://localhost:3000"));
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.pathname !== '/' || url.search || url.hash) {
    throw new Error('NEXT_PUBLIC_SITE_URL must be an HTTP(S) origin without a path, credentials, query or fragment');
  }
  return url;
}
