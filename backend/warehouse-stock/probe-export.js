// Read-only diagnostic. Credentials/URL and the whole catalog are never printed.
import { readFile, stat } from 'node:fs/promises';
import { parseStockCsv, createExportReader, DEFAULT_EXPORT_COLUMNS } from './export-provider.js';

async function main() {
  const input = process.argv[2];
  const encoding = process.env.SHOPTET_EXPORT_ENCODING || 'utf-8';
  if (!input || !['utf-8', 'windows-1250'].includes(encoding)) throw new Error('input-required');
  let csv;
  if (input === '--remote') {
    const data = await createExportReader({ url: process.env.SHOPTET_EXPORT_URL, encoding })();
    csv = data.csv;
  } else {
    if (/^https?:/i.test(input) || (await stat(input)).size > 32 * 1024 * 1024)
      throw new Error('input-invalid');
    csv = new TextDecoder(encoding, { fatal: true }).decode(await readFile(input));
  }
  const index = parseStockCsv(csv, {
    delimiter: process.env.SHOPTET_EXPORT_DELIMITER || ';',
    columns: {
      hricov: process.env.SHOPTET_EXPORT_HRICOV_COLUMN || DEFAULT_EXPORT_COLUMNS.hricov,
      csnk: process.env.SHOPTET_EXPORT_CSNK_COLUMN || DEFAULT_EXPORT_COLUMNS.csnk,
    },
  });
  const codes = process.argv.length > 3 ? process.argv.slice(3) : ['404394', '232861', '289124'];
  const report = {
    expectedProjectId: 765909,
    state: 'source-read-semantics-not-yet-verified',
    acceptedPublicSkus: index.size,
    selected: codes.map((code) => ({ code, ...(index.get(code) || { state: 'unknown' }) })),
  };
  if (process.env.SHOPTET_EXPORT_REFERENCE_FILE) {
    const expected = JSON.parse(await readFile(process.env.SHOPTET_EXPORT_REFERENCE_FILE, 'utf-8'));
    const actual = index.get(expected.code);
    report.referenceMatches =
      !!actual &&
      actual.unit === expected.unit &&
      actual.amounts.hricov === expected.warehouses?.hricov &&
      actual.amounts.csnk === expected.warehouses?.csnk;
    if (!report.referenceMatches) process.exitCode = 2;
  }
  console.log(JSON.stringify(report, null, 2));
}
main().catch(() => {
  console.error(
    'Source validation failed. Check private configuration, CSV columns, encoding and unambiguous SKUs.',
  );
  process.exitCode = 1;
});
