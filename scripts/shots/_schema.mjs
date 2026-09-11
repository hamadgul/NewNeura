/**
 * Shot configs are data, not scripts. `defineShots` exists so that both the capture
 * runner and check-assets.mjs read the same shape, and so a typo in a config file is a
 * throw at import time rather than an undefined at capture time.
 */
export function defineShots(slug, shots) {
  if (!slug || typeof slug !== "string") throw new Error("defineShots: slug required");
  if (!Array.isArray(shots) || shots.length === 0) {
    throw new Error(`defineShots(${slug}): at least one shot required`);
  }
  for (const s of shots) {
    for (const key of ["route", "viewport", "out"]) {
      if (!(key in s)) throw new Error(`defineShots(${slug}): shot missing "${key}"`);
    }
    if (!s.out.startsWith(`${slug}-`) && !s.out.startsWith("cover:")) {
      throw new Error(
        `defineShots(${slug}): out "${s.out}" must start with "${slug}-" ` +
          `or "cover:" (frozen cover filenames are addressed as cover:<filename>)`
      );
    }
    // `out` (after stripping the "cover:" prefix) must be a bare filename, not
    // a path. Ten different subagents author these configs by hand, so a
    // mistaken relative path — "cover:../../.env" — is a plausible accident,
    // not an attacker input, but the effect is the same: the runner would
    // join() it onto public/site/images and write outside that directory.
    // Failing here, at config-authoring/import time, catches it before any
    // browser ever launches.
    const name = s.out.startsWith("cover:") ? s.out.slice(6) : s.out;
    if (name.includes("/") || name.includes("\\") || name.includes("..")) {
      throw new Error(
        `defineShots(${slug}): out "${s.out}" must be a bare filename ` +
          `(no "/", "\\", or ".." — it is joined onto public/site/images directly)`
      );
    }
    // Optional. A Playwright storageState file (cookies + localStorage) the
    // runner loads into the shot's browser context, so an authenticated route
    // (`/admin/*` behind a login) or a page that needs client state (a cart in
    // localStorage) can be captured without the runner knowing how to log in.
    // The file is produced by a scratch script outside the repo and is never
    // committed; it must be an absolute path so a config never points into
    // the repo by accident. Shots without the key behave exactly as before.
    if ("storageState" in s) {
      if (typeof s.storageState !== "string" || !s.storageState.startsWith("/")) {
        throw new Error(
          `defineShots(${slug}): storageState for "${s.out}" must be an absolute path ` +
            `to a Playwright storageState JSON file`
        );
      }
    }
  }
  return { slug, shots };
}
