// app/api/assets/route.ts
import { NextResponse } from "next/server";
import { findDriveFileByName } from "@/app/lib/drive";

export const dynamic = "force-dynamic";

// Build public URLs inline to avoid export mismatches
const fullUrl = (id: string) => `https://drive.google.com/uc?export=view&id=${id}`;
const thumbUrl = (id: string, w = 64) => `https://lh3.googleusercontent.com/d/${id}=w${w}`;

export async function GET() {
  try {
    const folderId = process.env.DRIVE_ASSETS_FOLDER_ID || "";
    if (!folderId) {
      return NextResponse.json(
        { error: "Missing DRIVE_ASSETS_FOLDER_ID in environment" },
        { status: 400 }
      );
    }

    const DARK = process.env.ASSET_NAME_DARK || "dark_logo";
    const LIGHT = process.env.ASSET_NAME_LIGHT || "light_logo";
    const FAVI = process.env.ASSET_NAME_FAVICON || "favicon";

    const [dark, light, fav] = await Promise.all([
      findDriveFileByName(DARK, folderId),
      findDriveFileByName(LIGHT, folderId),
      findDriveFileByName(FAVI, folderId)
    ]);

    const payload = {
      dark: dark ? { id: dark.id, name: dark.name, url: fullUrl(dark.id) } : null,
      light: light ? { id: light.id, name: light.name, url: fullUrl(light.id) } : null,
      favicon: fav
        ? { id: fav.id, name: fav.name, url: thumbUrl(fav.id, 64), full: fullUrl(fav.id) }
        : null
    };

    return NextResponse.json(payload);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Unknown error" }, { status: 500 });
  }
}
