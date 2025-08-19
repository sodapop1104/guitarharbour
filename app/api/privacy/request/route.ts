import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TYPES = new Set(["access", "delete", "correct"]);

export async function POST(req: NextRequest) {
  const { type, email, details } = await req.json().catch(() => ({}));
  if (!TYPES.has(type) || !email) {
    return NextResponse.json({ ok: false, message: "Invalid request" }, { status: 400 });
    }
  // email you a copy (acts as your “ticket”)
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, APPROVER_EMAIL } = process.env;
  if (SMTP_HOST && SMTP_USER && SMTP_PASS && APPROVER_EMAIL) {
    try {
      const t = nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT || 587),
        secure: false,
        auth: { user: SMTP_USER, pass: SMTP_PASS },
      });
      await t.sendMail({
        from: SMTP_USER,
        to: APPROVER_EMAIL,
        subject: `Privacy request: ${type}`,
        html: `<p>Type: ${type}</p>
               <p>Email: ${email}</p>
               <p>Details: ${details || "(none)"}</p>
               <p>UA: ${req.headers.get("user-agent") || "(unknown)"}</p>`,
      });
    } catch (e) {
      console.error("Privacy request email failed:", (e as Error).message);
    }
  }
  // basic acknowledgment to the consumer
  return NextResponse.json({ ok: true, message: "Request received. We’ll respond by email." });
}