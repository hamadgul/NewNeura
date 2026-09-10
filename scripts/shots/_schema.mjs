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
  }
  return { slug, shots };
}
