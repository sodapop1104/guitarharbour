// app/api/gallery/[kind]/route.ts

const ALLOWED_KINDS = new Set(["drive", "local"]);

export async function GET(
  _req: Request,
  { params }: { params: { kind: string } } // <-- must destructure + exact string type
) {
  const k = params.kind.toLowerCase();

  if (!ALLOWED_KINDS.has(k)) {
    return Response.json(
      { error: `Invalid kind "${params.kind}". Allowed: ${Array.from(ALLOWED_KINDS).join(", ")}` },
      { status: 400 }
    );
  }

  try {
    if (k === "drive") {
      // TODO: real Drive listing here
      return Response.json({ kind: k, images: [] });
    }

    if (k === "local") {
      // TODO: real local listing here
      return Response.json({ kind: k, images: [] });
    }

    return Response.json({ kind: k, images: [] });
  } catch (err) {
    console.error("[gallery route] error", err);
    return Response.json({ error: "Failed to load gallery" }, { status: 500 });
  }
}
