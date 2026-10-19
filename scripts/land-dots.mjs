// Writes src/wic/landing/land-dots.json: [lat, lon, lat, lon, …] for an
// evenly spaced grid of points that fall on land, for the WIC2025 globe.
// Run with `node scripts/land-dots.mjs` after changing STEP.
import { readFileSync, writeFileSync } from "node:fs";
import { geoContains } from "d3-geo";
import { feature } from "topojson-client";

const STEP = 1.5; // degrees between rows (and between dots along the equator)

const topo = JSON.parse(readFileSync(new URL("../node_modules/world-atlas/land-110m.json", import.meta.url)));
const land = feature(topo, topo.objects.land);

const out = [];
for (let lat = -56; lat <= 80; lat += STEP) {
  const n = Math.max(1, Math.round((360 / STEP) * Math.cos((lat * Math.PI) / 180)));
  for (let i = 0; i < n; i++) {
    const lon = -180 + (i + 0.5) * (360 / n);
    if (geoContains(land, [lon, lat])) out.push(+lat.toFixed(1), +lon.toFixed(1));
  }
}
writeFileSync(new URL("../src/wic/landing/land-dots.json", import.meta.url), JSON.stringify(out));
console.log(`${out.length / 2} dots`);
