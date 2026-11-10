import assert from 'node:assert/strict';
import test from 'node:test';
import { siteUrl } from '../src/lib/site-url.ts';

test('site URL order: explicit origin, production host, deployment host, local fallback', () => {
  const env = { NEXT_PUBLIC_SITE_URL: 'https://example.org', VERCEL_PROJECT_PRODUCTION_URL: 'production.vercel.app', VERCEL_URL: 'deployment.vercel.app' };
  assert.equal(siteUrl(env).href, 'https://example.org/');
  delete env.NEXT_PUBLIC_SITE_URL;
  assert.equal(siteUrl(env).href, 'https://production.vercel.app/');
  delete env.VERCEL_PROJECT_PRODUCTION_URL;
  assert.equal(siteUrl(env).href, 'https://deployment.vercel.app/');
  assert.equal(siteUrl({}).href, 'http://localhost:3000/');
  assert.equal(siteUrl({ NEXT_PUBLIC_SITE_URL: 'http://localhost:3180' }).href, 'http://localhost:3180/');
});

test('Vercel never emits loopback metadata, even with a stale explicit override', () => {
  for (const host of ['localhost', 'localhost.', 'preview.localhost', '127.0.0.1', '127.1', '[::1]', '[::]', '0.0.0.0']) {
    const env = { VERCEL: '1', NEXT_PUBLIC_SITE_URL: `http://${host}:3000`, VERCEL_PROJECT_PRODUCTION_URL: 'production.vercel.app', VERCEL_URL: 'deployment.vercel.app' };
    assert.equal(siteUrl(env).origin, 'https://production.vercel.app');
    delete env.VERCEL_PROJECT_PRODUCTION_URL;
    assert.equal(siteUrl(env).origin, 'https://deployment.vercel.app');
    delete env.VERCEL_URL;
    assert.throws(() => siteUrl(env), /localhost is not allowed/);
  }
  assert.throws(() => siteUrl({ VERCEL_ENV: 'production' }), /public site URL/);
  assert.throws(() => siteUrl({ VERCEL: '1', VERCEL_URL: 'localhost' }), /localhost is not allowed/);
});

test('site URL rejects non-origin configuration', () => {
  for (const value of ['ftp://example.org', 'https://user:pass@example.org', 'https://example.org/path', 'https://example.org?q=1', 'https://example.org/#hash', 'invalid']) {
    assert.throws(() => siteUrl({ NEXT_PUBLIC_SITE_URL: value }));
  }
});
