// /lib/drive.ts
import { google } from "googleapis";
import { getOAuth2Client } from "../lib/google";

export type DriveImage = { id: string; name: string; url: string };

/* ---------- Public URL helpers (no auth needed to fetch) ---------- */

const DRIVE_ID_RE = /^[A-Za-z0-9_-]{20,}$/;

export function isDriveId(s: string) {
  return !!s && DRIVE_ID_RE.test(s) && !s.includes("/") && !s.includes(".");
}

/** Full quality, stable view URL for any public file ID. */
export function driveFull(idOrUrl: string) {
  if (!idOrUrl) return "";
  if (isDriveId(idOrUrl)) {
    return `https://drive.google.com/uc?export=view&id=${idOrUrl}`;
  }
  return idOrUrl; // already URL
}

/** Fast thumbnail via lh3 CDN (great for favicons or small thumbs). */
export function driveThumb(idOrUrl: string, width = 200) {
  if (!idOrUrl) return "";
  if (isDriveId(idOrUrl)) {
    return `https://lh3.googleusercontent.com/d/${idOrUrl}=w${width}`;
  }
  return idOrUrl;
}

/* ---------- Google API helpers (server-side only) ---------- */

export async function whoAmI() {
  const auth = getOAuth2Client();
  const oauth2 = google.oauth2({ version: "v2", auth });
  const me = await oauth2.userinfo.get();
  return me.data;
}

export async function listDriveImages(folderId: string): Promise<DriveImage[]> {
  const auth = getOAuth2Client();
  const drive = google.drive({ version: "v3", auth });

  const res = await drive.files.list({
    q: `'${folderId}' in parents and mimeType contains 'image/' and trashed = false`,
    fields: "files(id, name, mimeType, modifiedTime)",
    orderBy: "modifiedTime desc",
    pageSize: 200,
    includeItemsFromAllDrives: true,
    supportsAllDrives: true,
  });

  const files = res.data.files ?? [];
  return files.map((f) => ({
    id: f.id!,
    name: f.name!,
    url: driveFull(f.id!),
  }));
}

/**
 * Find a single file by exact name.
 * If folderId is provided, the search is scoped to that folder.
 */
export async function findDriveFileByName(
  name: string,
  folderId?: string
): Promise<DriveImage | null> {
  const auth = getOAuth2Client();
  const drive = google.drive({ version: "v3", auth });

  const nameEq = `name = '${name.replace(/'/g, "\\'")}'`;
  const inFolder = folderId ? ` and '${folderId}' in parents` : "";
  const q = `${nameEq}${inFolder} and trashed = false`;

  const res = await drive.files.list({
    q,
    fields: "files(id, name, mimeType, modifiedTime)",
    orderBy: "modifiedTime desc",
    pageSize: 1,
    includeItemsFromAllDrives: true,
    supportsAllDrives: true,
  });

  const f = res.data.files?.[0];
  if (!f) return null;

  return { id: f.id!, name: f.name!, url: driveFull(f.id!) };
}