// app/api/gallery/[kind]/route.ts

const ALLOWED_KINDS = new Set(["drive", "local"]);

export async function GET(req: Request) {
  // Extract `[kind]` from the URL path instead of using the 2nd arg
  const { pathname } = new URL(req.url);
  // matches /api/gallery/<kind>(/...)?
  const m = pathname.match(/\/api\/gallery\/([^/]+)/);
  const kind = (m?.[1] ?? "").toLowerCase();

  if (!ALLOWED_KINDS.has(kind)) {
    return Response.json(
      { error: `Invalid kind "${kind}". Allowed: ${Array.from(ALLOWED_KINDS).join(", ")}` },
      { status: 400 }
    );
  }

  try {
    if (kind === "drive") {
      // TODO: your real Drive-backed listing
      // const images = await listDriveImages(process.env.DRIVE_FOLDER_ID!);
      return Response.json({ kind, images: [] });
    }

    if (kind === "local") {
      // TODO: your real local listing
      return Response.json({ kind, images: [] });
    }

    // Shouldn’t hit due to guard
    return Response.json({ kind, images: [] });
  } catch (err) {
    console.error("[gallery route] error", err);
    return Response.json({ error: "Failed to load gallery" }, { status: 500 });
  }
}
