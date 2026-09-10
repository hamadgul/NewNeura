/**
 * WORK_SERVICE_FILTERS (CollectionProjects.tsx) and PORTFOLIO_FILTERS (home/content.ts)
 * are hand-maintained `count` literals whose own comment says nothing verifies them. The
 * filter itself is client-side (`useState` + `history.pushState`), so a wrong count is
 * absent from the prerendered HTML — a grep of the built output cannot catch it. You would
 * have to click the pill and count cards by hand.
 *
 * The invariant: for each filter slug, `count` equals the number of PORTFOLIO_PROJECTS
 * entries (src/components/site/work/content.ts) whose `services` array contains that slug.
 * Both declared copies are checked against the same derived truth, and a mismatch is
 * reported with the file it lives in — two copies drifting apart is the whole risk.
 */
import { readFileSync } from "node:fs";

const failures = [];
const fail = (msg) => failures.push(msg);

const WORK_FILE = "src/components/site/work/content.ts";
const COLLECTION_FILE = "src/components/site/shared/blocks/CollectionProjects.tsx";
const HOME_FILE = "src/components/site/home/content.ts";

const work = readFileSync(WORK_FILE, "utf8");
const collection = readFileSync(COLLECTION_FILE, "utf8");
const home = readFileSync(HOME_FILE, "utf8");

// Every `services: [...]` array in PORTFOLIO_PROJECTS. Deliberately lowercase `services:`
// with no `i` flag and no `\w*` prefix: each project also carries a `topServices` array
// (a curated subset), and `topServices:` does NOT match this literal because of the
// capital S. Loosening the regex would double-count every project against both arrays.
const projectServicesMatches = [...work.matchAll(/services:\s*\[([^\]]*)\]/g)];

// `services: [` occurs exactly once per project today, with nothing else in the file
// matching it — a whole-file scan is safe only as long as that holds. Assert it rather
// than assume it, so a future project added without a `services` array (or a stray
// `services: [` added outside PORTFOLIO_PROJECTS) fails loudly instead of silently
// under-counting. This project has already shipped three "green but wrong" scans caused
// by exactly this kind of unchecked assumption.
const EXPECTED_PROJECT_COUNT = 10;
if (projectServicesMatches.length !== EXPECTED_PROJECT_COUNT) {
  console.error(
    `check-filter-counts: expected ${EXPECTED_PROJECT_COUNT} project \`services\` arrays in ` +
      `${WORK_FILE}, found ${projectServicesMatches.length} — did a project get added, removed, ` +
      `or reshaped?`
  );
  process.exit(1);
}

const projectServices = projectServicesMatches
  .map((m) => m[1].match(/"([a-z-]+)"/g) || [])
  .map((a) => a.map((s) => s.replace(/"/g, "")));

const actual = new Map();
for (const list of projectServices) {
  for (const slug of list) actual.set(slug, (actual.get(slug) || 0) + 1);
}

// {slug, count} pairs in WORK_SERVICE_FILTERS (CollectionProjects.tsx), which nests a
// `children` sub-menu (e.g. Applied AI -> AI Strategy, Custom Models, ...). Each
// sub-filter's "All" pill re-uses its parent's slug with NO `count` of its own, e.g.
// `{ label: "All", slug: "applied-ai" }` inside Applied AI's children. A loose
// "slug, then the next count within N characters" regex (the natural first attempt)
// matches THAT slug and walks forward past it to grab the *next* filter's count,
// producing a spurious `applied-ai` pair with the wrong number and silently skipping
// that next filter's own slug entirely (its {slug, count} span gets swallowed by the
// bogus match) — verified by running it against this file, not assumed. Requiring the
// slug and its count to be separated by nothing but a literal comma and whitespace fixes
// this: an "All" pill's slug is followed by `"` + whitespace + `}`, never `"` + `,`, so
// it cannot satisfy this pattern.
const collectionPairs = [
  ...collection.matchAll(/slug:\s*"([a-z-]+)"\s*,\s*count:\s*(\d+)/g),
].map(([, slug, count]) => ({ file: COLLECTION_FILE, slug, count: +count }));

if (collectionPairs.length === 0) {
  console.error(
    `check-filter-counts: found no {slug, count} pairs in ${COLLECTION_FILE} — did the shape change?`
  );
  process.exit(1);
}

// The second copy: PORTFOLIO_FILTERS in home/content.ts. Same counts, different shape —
// no `slug` field here, just `count` and an `href` carrying `?service=<slug>`.
const homePairs = [
  ...home.matchAll(/count:\s*(\d+),\s*href:\s*"[^"]*\?service=([a-z-]+)"/g),
].map(([, count, slug]) => ({ file: HOME_FILE, slug, count: +count }));

if (homePairs.length === 0) {
  console.error(
    `check-filter-counts: found no {count, href} pairs in ${HOME_FILE} — did the shape change?`
  );
  process.exit(1);
}

for (const { file, slug, count } of [...collectionPairs, ...homePairs]) {
  const real = actual.get(slug) || 0;
  if (real !== count) {
    fail(`${file}: ${slug} declares ${count}, ${real} project(s) carry it`);
  }
}

if (failures.length) {
  console.error(`check-filter-counts: ${failures.length} failure(s)\n`);
  for (const f of failures) console.error(`  ✗ ${f}`);
  process.exit(1);
}
console.log(
  `check-filter-counts: OK — ${collectionPairs.length} filter(s) in CollectionProjects.tsx, ` +
    `${homePairs.length} filter(s) in home/content.ts, all match ${WORK_FILE}`
);
