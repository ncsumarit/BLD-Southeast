#!/usr/bin/env node
/**
 * Compresses/resizes CMS-managed images in place under public/images/.
 *
 * Why not Astro's <Image> component: these files are managed through
 * TinaCMS's media picker (tina/config.ts media.tina.mediaRoot: 'images',
 * publicFolder: 'public'), so they must stay in public/ for editors to
 * see/replace them through the CMS. Astro's build-time image pipeline only
 * processes images imported from src/ as ES modules — anything in public/
 * ships byte-for-byte as-is. This script is the tradeoff: keep the CMS
 * media-library workflow intact, but still cap dimensions/recompress so
 * oversized uploads (a 4000px-wide export for a 300px grid tile) don't
 * ship as multi-hundred-KB files.
 *
 * Run manually after adding/replacing images via Tina, or wire into a
 * pre-build step later if that becomes worth automating.
 */
import sharp from 'sharp';
import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images');

// [glob-ish prefix, max width, jpeg/png quality]
const RULES = [
  { match: (p) => p === 'hero-dc-background.jpg', maxWidth: 2400, quality: 80 },
  { match: (p) => p === 'sixth-year-intro-image.jpg', maxWidth: 1200, quality: 80 },
  { match: (p) => p.startsWith('sponsors/') || p.startsWith('beneficiaries/'), maxWidth: 800, quality: 82 },
];

// Left untouched: bld-southeast-logo-white.png, b-corp-icon-favicon.png —
// already small brand assets, no rule matches them, skip by default below.

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

async function main() {
  let totalBefore = 0;
  let totalAfter = 0;
  let touched = 0;

  for await (const file of walk(IMAGES_DIR)) {
    const ext = path.extname(file).toLowerCase();
    if (!['.jpg', '.jpeg', '.png'].includes(ext)) continue;

    const relPath = path.relative(IMAGES_DIR, file).split(path.sep).join('/');
    const rule = RULES.find((r) => r.match(relPath));
    if (!rule) continue;

    const before = (await stat(file)).size;
    const img = sharp(file);
    const meta = await img.metadata();

    let pipeline = img;
    if (meta.width && meta.width > rule.maxWidth) {
      pipeline = pipeline.resize({ width: rule.maxWidth, withoutEnlargement: true });
    }

    let outBuffer;
    if (ext === '.png') {
      outBuffer = await pipeline.png({ compressionLevel: 9, quality: rule.quality, palette: true }).toBuffer();
    } else {
      outBuffer = await pipeline.jpeg({ quality: rule.quality, mozjpeg: true }).toBuffer();
    }

    // Only overwrite if it's actually smaller — never regress a file.
    if (outBuffer.length < before) {
      await sharp(outBuffer).toFile(file);
      totalBefore += before;
      totalAfter += outBuffer.length;
      touched++;
      console.log(`${relPath}: ${(before / 1024).toFixed(0)}KB -> ${(outBuffer.length / 1024).toFixed(0)}KB`);
    } else {
      console.log(`${relPath}: skipped (already optimal, ${(before / 1024).toFixed(0)}KB)`);
    }
  }

  console.log(
    `\n${touched} files optimized. Total: ${(totalBefore / 1024).toFixed(0)}KB -> ${(totalAfter / 1024).toFixed(0)}KB (saved ${((totalBefore - totalAfter) / 1024).toFixed(0)}KB)`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
