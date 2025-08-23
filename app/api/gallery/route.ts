// app/api/gallery/route.ts
import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const GALLERY_DIR = path.join(process.cwd(), "public", "assets", "gallery");
const ALLOWED = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"]);

export async function GET() {
  try {
    const items = await fs.readdir(GALLERY_DIR, { withFileTypes: true });
    const files = items
      .filter((d) => d.isFile())
      .map((d) => d.name)
      .filter((name) => ALLOWED.has(path.extname(name).toLowerCase()))
      // natural sort (e.g., "2.jpg" before "10.jpg")
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }))
      .map((name) => `/assets/gallery/${name}`);

    return NextResponse.json({ images: files });
  } catch (err) {
    console.error("Gallery read error:", err);
    // Return empty list (200) so UI still renders gracefully
    return NextResponse.json({ images: [] }, { status: 200 });
  }
}