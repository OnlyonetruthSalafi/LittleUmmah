// Resolve the application's TS aliases/extensionless data imports for node:test.
import { registerHooks } from 'node:module';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const root = new URL('../src/', import.meta.url);
registerHooks({ resolve(specifier, context, next) {
  if (specifier.startsWith('@/') || specifier.startsWith('.')) {
    const url = specifier.startsWith('@/') ? new URL(specifier.slice(2), root) : new URL(specifier, context.parentURL);
    for (const suffix of ['', '.ts', '/index.ts']) {
      const candidate = new URL(url.href + suffix);
      if (existsSync(fileURLToPath(candidate)) && /\.ts$/.test(candidate.pathname)) return next(candidate.href, context);
    }
  }
  return next(specifier, context);
} });
