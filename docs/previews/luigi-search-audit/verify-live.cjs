const fs = require('fs'),
  crypto = require('crypto'),
  assert = require('assert/strict');
const dir = __dirname;
const r = JSON.parse(fs.readFileSync(dir + '/live/verification.json'));
assert.equal(r.states.length, 8);
assert.equal(r.errors.length, 0);
let pairs = [];
for (const width of [1440, 375])
  for (const state of ['results', 'autocomplete']) {
    const before = r.states.find((s) => s.width === width && s.state === state && !s.after);
    const after = r.states.find((s) => s.width === width && s.state === state && s.after);
    assert(before && after);
    assert(after.names.length > 0);
    assert.equal(after.horizontalOverflow, false);
    assert(after.names.every((n) => !n.clipped));
    assert.deepEqual(before.links, after.links);
    assert.deepEqual(
      before.names.map((n) => n.text),
      after.names.map((n) => n.text),
    );
    assert.deepEqual(before.colors, after.colors);
    pairs.push({
      width,
      state,
      products: after.names.length,
      clippedBefore: before.names.filter((n) => n.clipped).length,
      clippedAfter: 0,
      linksUnchanged: true,
      availabilityColorsUnchanged: true,
      horizontalOverflow: false,
    });
  }
const q = JSON.parse(fs.readFileSync(dir + '/live/search-responses.json'));
assert.equal(q.queries.length, 15);
assert(q.queries.every((q) => q.status === '200' && q.top.length > 0));
const files = fs.readdirSync(dir + '/live').filter((f) => f.endsWith('.png'));
assert.equal(files.length, 12);
fs.writeFileSync(
  dir + '/live/qa.json',
  JSON.stringify(
    {
      checkedAt: new Date().toISOString(),
      pairs,
      searchQueries: 15,
      allSearchResponses200: true,
      screenshots: files,
      cssSha256: crypto
        .createHash('sha256')
        .update(fs.readFileSync(dir + '/luigi-scoped.css'))
        .digest('hex'),
      scope: 'Docs preview only; no production integration',
      cart: 'NOT TESTED',
      safari: 'NOT TESTED',
    },
    null,
    2,
  ) + '\n',
);
console.log(
  'PASS: 4 matched pairs, 12 screenshots, 15 Luigi responses, no title clipping/overflow after CSS.',
);
