// app/api/gallery/[kind]/route.ts
import { listDriveImages } from "@/app/lib/drive"; // your existing helper

export const dynamic = "force-dynamic";

// Accept multiple aliases from the URL
type IncomingKind = "setup" | "setups" | "finished" | "repair" | "repairs";

// Canonical buckets we actually store
type Bucket = "finished" | "repairs";

const ALIAS_TO_BUCKET: Record<IncomingKind, Bucket> = {
  setup: "finished",
  setups: "finished",
  finished: "finished",
  repair: "repairs",
  repairs: "repairs",
};

const FOLDER_ENV: Record<Bucket, string | undefined> = {
  finished: process.env.DRIVE_GALLERY_FINISHED_FOLDER_ID,
  repairs: process.env.DRIVE_GALLERY_REPAIRS_FOLDER_ID,
};

export async function GET(req: Request) {
  // Extract `[kind]` manually to avoid strict ctx typing issues
  const { pathname } = new URL(req.url);
  const m = pathname.match(/\/api\/gallery\/([^/]+)/);
  const inc = (m?.[1]?.toLowerCase() || "") as IncomingKind;

  if (!(inc in ALIAS_TO_BUCKET)) {
    return Response.json(
      { error: `Invalid kind "${inc}". Allowed: setup, repair, finished, repairs` },
      { status: 400 }
    );
  }

  const bucket = ALIAS_TO_BUCKET[inc];
  const folderId = FOLDER_ENV[bucket];

  if (!folderId) {
    return Response.json(
      { error: `Missing Drive folder ID for "${bucket}". Set DRIVE_GALLERY_${bucket.toUpperCase()}_FOLDER_ID in Vercel.` },
      { status: 500 }
    );
  }

  try {
    // Expect listDriveImages to return an array of objects with at least `id` or `url`, and optionally `name`
    const images = await listDriveImages(folderId);
    return Response.json({ kind: bucket, images });
  } catch (err) {
    console.error("[gallery route]", err);
    return Response.json({ error: "Failed to load gallery" }, { status: 500 });
  }
}
