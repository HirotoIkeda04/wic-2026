// Derived images for the landing page, so the originals in public/ are not
// sent at full size: 900px WebP copies of the photo helix's pictures and a
// small favicon. Run `node scripts/images.mjs` after changing a source image.
// The poster WebPs and the 480px logos in public/images/wic/2026 are copied
// from jpsi-web (branch wic/image-weight), so both sites serve the same files.
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { basename, dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const PUBLIC = fileURLToPath(new URL("../public", import.meta.url)); // fileURLToPath: the path may contain spaces

/** Photos shown in the helix (Statement.tsx), as paths under public/. */
const HELIX = [
  "/images/wic/wic2025-closing-ceremony.jpg",
  "/images/wic/wic2025-champions-lmu.jpg",
  "/images/wic/team-dressed-up.jpg",
  "/images/hero-background.jpg",
  "/images/wic/wic2025-trader-award-tum.jpg",
  "/images/wic/wic2025-sponsor-interactive-brokers.jpg",
  "/images/wic/wic2025-sponsor-nsj.jpg",
  "/images/wic/wic2025-trader-award-comment.jpg",
];
const HELIX_WIDTH = 900;

for (const src of HELIX) {
  const out = join(dirname(src), `${basename(src, extname(src))}-${HELIX_WIDTH}.webp`);
  await mkdir(join(PUBLIC, dirname(out)), { recursive: true });
  const info = await sharp(join(PUBLIC, src))
    .resize({ width: HELIX_WIDTH, withoutEnlargement: true })
    .webp({ quality: 84 })
    .toFile(join(PUBLIC, out));
  console.log(`${out}  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} KB`);
}

// Favicon: the 1100px JPSI icon is 237 KB; browsers show it at 16–32px.
const icon = await sharp(join(PUBLIC, "/images/jpsi-icon.png"))
  .resize(64, 64)
  .png({ palette: true })
  .toFile(join(PUBLIC, "/images/jpsi-icon-64.png"));
console.log(`/images/jpsi-icon-64.png  ${icon.width}x${icon.height}  ${(icon.size / 1024).toFixed(1)} KB`);
