// app/api/gallery/[kind]/route.ts
import { listDriveImages } from "@/app/lib/drive";

export const dynamic = "force-dynamic"; // don't cache; we want fresh listings

// Declare the "kinds" you support at /api/gallery/[kind]
type Kind = "finished" | "repairs";

// Map kinds to Google Drive folder IDs (set these in Vercel env)
const FOLDER_ENV: Record<Kind, string | undefined> = {
  finished: process.env.DRIVE_GALLERY_FINISHED_FOLDER_ID,
  repairs: process.env.DRIVE_GALLERY_REPAIRS_FOLDER_ID,
};

// Use the typed RouteContext that Next generates in `.next/types/routes.d.ts`
// NOTE: `params` is a Promise here, so we `await` it.
export async function GET(
  _req: Request,
  context: RouteContext<"/api/gallery/[kind]">
) {
  const { kind } = await context.params; // <- IMPORTANT: await
  const k = (kind as string).toLowerCase() as Kind;

  if (!(k in FOLDER_ENV)) {
    return Response.json(
      { error: `Invalid kind "${kind}". Allowed: finished, repairs` },
      { status: 400 }
    );
  }

  const folderId = FOLDER_ENV[k];
  if (!folderId) {
    return Response.json(
      {
        error: `Missing folder ID for "${k}". Set env var DRIVE_GALLERY_${k.toUpperCase()}_FOLDER_ID in Vercel.`,
      },
      { status: 500 }
    );
  }

  try {
    const images = await listDriveImages(folderId);
    // listDriveImages returns [{ id, name, url }], which your Gallery component already understands
    return Response.json({ kind: k, images });
  } catch (err) {
    console.error("[gallery route]", err);
    return Response.json({ error: "Failed to load gallery" }, { status: 500 });
  }
}
