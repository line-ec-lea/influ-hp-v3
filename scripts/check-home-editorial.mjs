import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

const frontmatter = (await readFile(new URL('../src/pages/index.astro', import.meta.url), 'utf8'))
  .split('---')[1].replace(/^import .*;$/gm, '');
const run = new (Object.getPrototypeOf(async function () {}).constructor)(
  'getEmDashCollection', 'Astro', 'console',
  ts.transpile(frontmatter + '\nreturn { achievements, columns };', { target: ts.ScriptTarget.ES2022 }),
);
for (const failed of [null, 'company_achievements', 'useful_materials']) {
  const queries = [], cache = [], errors = [];
  const result = await run(async (collection, options) => {
    queries.push({ collection, options });
    return { entries: [], cacheHint: { tags: [collection] }, error: collection === failed ? new Error('Unavailable') : undefined };
  }, { cache: { enabled: true, set: value => cache.push(value) } }, { error: (...args) => errors.push(args) });
  assert.deepEqual(queries.map(q => [q.collection, q.options.limit]), [['company_achievements', 3], ['useful_materials', 4]]);
  assert.ok(queries.every(q => q.options.status === 'published'), 'Draft entries must never be requested');
  assert.ok(queries.every(q => q.options.orderBy.published_at === 'desc'), 'Select latest entries in the database');
  if (failed) {
    assert.equal(errors.length, 1);
    assert.equal(cache.at(-1), false, 'Do not cache a temporary CMS failure');
    assert.equal(cache.length, 2, 'The successful collection keeps its hint before caching is disabled');
    assert.equal(Boolean(result.achievements.error), failed === 'company_achievements');
    assert.equal(Boolean(result.columns.error), failed === 'useful_materials');
  } else {
    assert.deepEqual(cache, [{ tags: ['company_achievements'] }, { tags: ['useful_materials'] }], 'Both collection hints must be retained, including when empty');
    assert.equal(errors.length, 0, 'An empty collection is not a query failure');
  }
}
console.log('PASS homepage editorial queries: published-only, limits, order, cache hints and isolated failures');
