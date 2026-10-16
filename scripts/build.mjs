// Build: bundles src/ into dist/ and enforces the performance budget (CONTRIBUTING.md 3.4).
import { build, transform } from 'esbuild';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { gzipSync } from 'node:zlib';

const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
// The approved v0.6.5 build retains its 16 kB CSS allowance; other versions
// use the standard 15 kB budget until a separate change is approved.
// v0.6.9 retains its approved 19.75 kB allowance on release (2026-10-14).
// v0.6.11-rc.0 mobile shipping: 20 kB CSS preview allowance (2026-10-15).
// v0.6.11-rc.1 shipping follow-up: same 20 kB preview allowance.
// v0.6.11-rc.2 local mobile contacts + Emerald: 20.25 kB CSS allowance.
// v0.6.11-rc.3 contacts and CTA correction: retains 20.25 kB CSS.
// v0.6.11-rc.4 mobile cart scrolling + shipping state: 21 kB CSS allowance.
// v0.6.11 stable promotion retains the approved rc.4 allowance (2026-10-16).
// Preview allowances: v0.6.6 17 kB, v0.6.7 18.25 kB, v0.6.8 18.75 kB.
const cssBudgetKiB = ['0.6.11-rc.4', '0.6.11'].includes(pkg.version)
  ? 21
  : ['0.6.11-rc.2', '0.6.11-rc.3'].includes(pkg.version)
    ? 20.25
    : ['0.6.11-rc.0', '0.6.11-rc.1'].includes(pkg.version)
      ? 20
      : pkg.version === '0.6.9'
        ? 19.75
        : pkg.version === '0.6.8'
          ? 18.75
          : pkg.version === '0.6.7'
            ? 18.25
            : pkg.version === '0.6.6'
              ? 17
              : pkg.version === '0.6.5'
                ? 16
                : 15;
const BUDGET = { 'dist/timber.min.js': 30 * 1024, 'dist/timber.min.css': cssBudgetKiB * 1024 };

const common = {
  bundle: true,
  minify: true,
  sourcemap: true,
  target: ['es2020', 'safari14'],
  legalComments: 'none',
  logLevel: 'warning',
};

await build({
  ...common,
  entryPoints: ['src/main.js'],
  outfile: 'dist/timber.min.js',
  format: 'iife',
  define: { __VERSION__: JSON.stringify(`v${pkg.version}`) },
  // Shoptet My Order uses an open shadow root. Bundle its local CSS as a
  // minified string; normal page CSS cannot style across that boundary.
  plugins: [
    {
      name: 'shadow-css',
      setup(plugin) {
        plugin.onResolve({ filter: /\.css\?shadow$/ }, (args) => ({
          path: resolve(args.resolveDir, args.path.replace(/\?shadow$/, '')),
          namespace: 'shadow-css',
        }));
        plugin.onLoad({ filter: /.*/, namespace: 'shadow-css' }, async (args) => {
          const result = await transform(readFileSync(args.path, 'utf8'), {
            loader: 'css',
            minify: true,
            target: common.target,
          });
          return { contents: `export default ${JSON.stringify(result.code)}`, loader: 'js' };
        });
      },
    },
  ],
});

await build({
  ...common,
  entryPoints: ['src/main.css'],
  outfile: 'dist/timber.min.css',
});

let failed = false;
for (const [file, limit] of Object.entries(BUDGET)) {
  const size = gzipSync(readFileSync(file)).length;
  const ok = size <= limit;
  failed ||= !ok;
  console.log(
    `${ok ? 'OK  ' : 'FAIL'} ${file}  ${(size / 1024).toFixed(2)} kB gzip / limit ${limit / 1024} kB`,
  );
}
if (failed) {
  console.error('Performance budget exceeded — see CONTRIBUTING.md 3.4');
  process.exit(1);
}
