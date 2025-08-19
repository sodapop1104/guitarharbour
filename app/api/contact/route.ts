import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";

export const runtime = "nodejs";

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z
    .string()
    .trim()
    .regex(/^(?!\.)(?!.*\.\.)[A-Za-z0-9_'+\-\.]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+$/, "Invalid email"),
  message: z.string().trim().min(1, "Message is required").max(5000),
});

export async function POST(req: NextRequest) {
  // 1) Validate input WITHOUT throwing
  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, message: "Validation failed", errors: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const { name, email, message } = parsed.data;

  // 2) Check email transport config
  const host = process.env.SMTP_HOST || "";
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER || "";
  const pass = process.env.SMTP_PASS || "";
  const to = process.env.APPROVER_EMAIL || "contact@guitarharbour.com";

  if (!host || !user || !pass) {
    return NextResponse.json({ ok: false, message: "Email is not configured." }, { status: 500 });
  }

  // 3) Send email (errors here are not validation errors)
  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    const text = [
      `New contact form message`,
      `-----------------------`,
      `Name: ${name}`,
      `Email: ${email}`,
      ``,
      message,
      ``,
      `— Sent from guitarharbour.com`,
    ].join("\n");

    await transporter.sendMail({
      from: { name: "Guitar Harbour Website", address: user },
      to,
      replyTo: email,
      subject: `Contact form: ${name}`,
      text,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unable to send email";
    return NextResponse.json({ ok: false, message: msg }, { status: 500 });
  }
}