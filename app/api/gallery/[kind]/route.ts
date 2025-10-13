// app/api/gallery/[kind]/route.ts

// Allowed values you support
const ALLOWED_KINDS = new Set(["drive", "local"]); // add more if needed

export async function GET(
  _req: Request,
  ctx: { params: Record<string, string | string[]> } // <-- generic context type
) {
  const raw = ctx.params.kind;
  const kind = Array.isArray(raw) ? raw[0] : raw; // normalize to string
  const k = String(kind || "").toLowerCase();

  if (!ALLOWED_KINDS.has(k)) {
    return Response.json(
      { error: `Invalid kind "${kind}". Allowed: ${[...ALLOWED_KINDS].join(", ")}` },
      { status: 400 }
    );
  }

  try {
    if (k === "drive") {
      // TODO: your real Drive-backed listing here
      // const images = await listDriveImages(process.env.DRIVE_FOLDER_ID!);
      return Response.json({ kind: k, images: [] });
    }

    if (k === "local") {
      // TODO: your real local listing here
      return Response.json({ kind: k, images: [] });
    }

    // Shouldn't reach here due to the guard
    return Response.json({ kind: k, images: [] });
  } catch (err) {
    console.error("[gallery route] error", err);
    return Response.json({ error: "Failed to load gallery" }, { status: 500 });
  }
}
