/**
 * Structural data only  copy lives in the dictionary (`immersive.act1/2/3`).
 * Act III reuses the single source of truth in `projects.ts` instead of
 * duplicating name/role/stack here. Order matches the brief's table.
 *
 * Confidentiality note: two of these (giz-observatory-phase-2 and
 * gis-geodata-infrastructure) are anonymised per Daniel's standing default
 * from Chantier A  see the open question about naming Bénin/GIZ explicitly
 * for the Act II globe, which this list doesn't resolve on its own.
 */
export const ACT3_PROJECT_SLUGS = [
  "immotic",
  "real-estate-platform-infrastructure",
  "giz-observatory-phase-2",
  "gis-geodata-infrastructure",
  "municipal-revenue-system",
  "regional-digital-observatory",
  "passage-canada",
] as const;

export const IMMERSIVE_ACT_IDS = [
  "immersive-act-1",
  "immersive-act-2",
  "immersive-act-3",
] as const;
