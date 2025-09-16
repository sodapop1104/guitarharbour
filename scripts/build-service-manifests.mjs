import { readdir, writeFile, stat } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = join(__dirname, "..");
const BASE = join(ROOT, "public", "assets", "services-pricing");

const IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"]);
const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });
const naturalSort = (a, b) => collator.compare(a, b);

function isImageFile(name) {
  const dot = name.lastIndexOf(".");
  if (dot < 0) return false;
  return IMAGE_EXTS.has(name.slice(dot).toLowerCase());
}

async function buildManifestForFolder(dir, folderName) {
  const entries = await readdir(dir, { withFileTypes: true });
  const images = entries
    .filter((e) => e.isFile() && isImageFile(e.name) && e.name !== "placeholder.jpg")
    .map((e) => e.name)
    .sort(naturalSort);

  const out = join(dir, "manifest.json");
  await writeFile(out, JSON.stringify({ images }, null, 2), "utf8");
  console.log(`✓ wrote ${folderName}/manifest.json (${images.length} images) -> ${out}`);
}

async function main() {
  console.log("🔎 ROOT:", ROOT);
  console.log("📁 BASE:", BASE);

  try {
    const baseStat = await stat(BASE);
    if (!baseStat.isDirectory()) {
      console.error(`✗ Not a directory: ${BASE}`);
      process.exit(1);
    }
  } catch (err) {
    console.error(`✗ Could not read ${BASE}. Make sure it exists.`);
    console.error(err.message);
    process.exit(1);
  }

  const entries = await readdir(BASE, { withFileTypes: true });
  const folders = entries.filter((e) => e.isDirectory()).map((e) => e.name);

  if (folders.length === 0) {
    console.warn("… No subfolders under services-pricing.");
    return;
  }

  for (const folder of folders) {
    try {
      await buildManifestForFolder(join(BASE, folder), folder);
    } catch (err) {
      console.warn(`… Skipped ${folder}: ${err.message}`);
    }
  }
  console.log("✅ Done.");
}

main();