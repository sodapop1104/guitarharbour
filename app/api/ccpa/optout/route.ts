import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const { email, reason } = await req.json().catch(() => ({}));

  // Set an opt-out cookie for 1 year
  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: 'gh_optout',
    value: '1',
    httpOnly: false,
    sameSite: 'lax',
    secure: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // 1 year
  });

  // Optional: notify the site owner
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, APPROVER_EMAIL } = process.env;
  if (SMTP_HOST && SMTP_USER && SMTP_PASS && APPROVER_EMAIL) {
    try {
      const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT || 587),
        secure: false,
        auth: { user: SMTP_USER, pass: SMTP_PASS },
      });
      await transporter.sendMail({
        from: SMTP_USER,
        to: APPROVER_EMAIL,
        subject: 'CCPA/CPRA opt-out request',
        html: `<p>Opt-out received.</p>
               <ul>
                 <li>Email (optional): ${email || '(not provided)'}</li>
                 <li>Reason: ${reason || 'user_opt_out'}</li>
                 <li>User-Agent: ${req.headers.get('user-agent') || '(unknown)'}</li>
               </ul>`,
      });
    } catch (e) {
      console.error('Opt-out email failed:', (e as Error).message);
    }
  }

  return res;
}