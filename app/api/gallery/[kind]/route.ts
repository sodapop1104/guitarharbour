// app/api/gallery/[kind]/route.ts
import { NextResponse } from "next/server";
import { listDriveImages, whoAmI } from "@/app/lib/drive";

export const runtime = "nodejs";
export const revalidate = 600;

type Kind = "finished" | "repairs";

export async function GET(
  _req: Request,
  { params }: { params: { kind: Kind } }
) {
  const { kind } = params;

  const folderId =
    kind === "finished"
      ? process.env.DRIVE_GALLERY_FINISHED_ID
      : process.env.DRIVE_GALLERY_REPAIRS_ID;

  if (!folderId) {
    return NextResponse.json(
      { images: [], error: `Missing env for ${kind} folder` },
      { status: 500 }
    );
  }

  try {
    // Expect each item from listDriveImages to include at least { id, name }
    const items = await listDriveImages(folderId);

    const images = (items || [])
      .map((i: any) => {
        const id: string | undefined = i.id || i.fileId || undefined;
        const name: string | undefined =
          i.name || i.filename || i.title || undefined;

        // Prefer a stable, direct "view" URL for images:
        // Works for publicly shared Drive images.
        const url: string | undefined = id
          ? `https://drive.google.com/uc?export=view&id=${id}`
          : i.url || i.webContentLink || i.webViewLink || undefined;

        if (!url) return null;

        return { id, name, url };
      })
      .filter(Boolean);

    return NextResponse.json({ images });
  } catch (err: any) {
    let authenticatedAs: string | null = null;
    try {
      const me = await whoAmI();
      authenticatedAs = me?.email ?? null;
    } catch {}
    return NextResponse.json(
      {
        images: [],
        error: "Drive list failed",
        diag: {
          message: String(err?.message || err),
          authenticatedAs,
          folderId,
        },
      },
      { status: 200 }
    );
  }
}
