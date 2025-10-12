// app/api/gallery/[kind]/route.ts
import { NextRequest } from "next/server";

// If you want to validate allowed values, list them here:
const ALLOWED_KINDS = new Set(["drive", "local"]); // add more if needed

export async function GET(
  _req: NextRequest,
  ctx: { params: { kind: string } } // <- important: string, not a custom type
) {
  const { kind } = ctx.params;

  // Optional: guard/normalize
  const k = String(kind).toLowerCase();

  if (!ALLOWED_KINDS.has(k)) {
    return Response.json(
      { error: `Invalid kind "${kind}". Allowed: ${Array.from(ALLOWED_KINDS).join(", ")}` },
      { status: 400 }
    );
  }

  try {
    if (k === "drive") {
      // TODO: replace with your real Drive-backed implementation
      // Example shape:
      // const images = await listDriveImages(process.env.DRIVE_FOLDER_ID!);
      // return Response.json({ kind: k, images });
      return Response.json({ kind: k, images: [] });
    }

    if (k === "local") {
      // TODO: replace with your local fallback implementation
      // const images = await listLocalImages();
      // return Response.json({ kind: k, images });
      return Response.json({ kind: k, images: [] });
    }

    // Fallback (should not hit if guarded above)
    return Response.json({ kind: k, images: [] });
  } catch (err) {
    console.error("[gallery route] error", err);
    return Response.json({ error: "Failed to load gallery" }, { status: 500 });
  }
}
