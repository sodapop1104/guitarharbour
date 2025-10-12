// app/api/google/callback/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getOAuth2Client } from "../../../lib/google";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const wantJson = url.searchParams.get("format") === "json";
  const errorParam = url.searchParams.get("error");

  if (errorParam) {
    const payload = { error: errorParam, note: "User denied consent or OAuth error." };
    if (wantJson) return NextResponse.json(payload, { status: 400 });
    return html(`Google OAuth Callback`, `
      <p style="color:#c00">Error: <b>${esc(errorParam)}</b></p>
      <p>Close this tab and re-run the init flow.</p>
    `);
  }

  if (!code) {
    if (wantJson) return NextResponse.json({ error: "Missing code" }, { status: 400 });
    return html(`Google OAuth Callback`, `
      <p>No <code>code</code> param found. Start from <code>/api/google/init</code> again.</p>
    `);
  }

  try {
    const oauth2 = getOAuth2Client();
    const { tokens } = await oauth2.getToken(code);

    if (wantJson) return NextResponse.json(tokens);

    return html(`Google OAuth Tokens`, `
      <h2>Success</h2>
      ${
        tokens.refresh_token
          ? `<p>Paste this into <code>.env.local</code>:</p>
             <pre style="padding:12px;background:#111;color:#fff;white-space:pre-wrap;border-radius:8px">GOOGLE_REFRESH_TOKEN=${esc(tokens.refresh_token!)}</pre>`
          : `<p style="color:#c00"><b>No <code>refresh_token</code> returned.</b></p>
             <ul>
               <li>Revoke the app at <a href="https://myaccount.google.com/permissions" target="_blank" rel="noreferrer">Google Account &gt; Security</a>.</li>
               <li>Then visit <code>/api/google/init</code> again (we use <code>prompt=consent</code>).</li>
             </ul>`
      }
      <details style="margin-top:16px">
        <summary>Show full token payload</summary>
        <pre style="padding:12px;background:#111;color:#fff;white-space:pre-wrap;border-radius:8px">${esc(JSON.stringify(tokens, null, 2))}</pre>
      </details>
      <p style="margin-top:16px">After updating env, restart dev/redeploy and test <code>/api/gallery/finished</code> &amp; <code>/api/gallery/repairs</code>.</p>
    `);
  } catch (err: any) {
    const payload = {
      error: "Token exchange failed",
      message: err?.message || String(err),
      details: err?.response?.data ?? null,
    };
    if (wantJson) return NextResponse.json(payload, { status: 500 });
    return html(`Google OAuth Error`, `
      <p style="color:#c00"><b>Token exchange failed.</b></p>
      <pre style="padding:12px;background:#111;color:#fff;white-space:pre-wrap;border-radius:8px">${esc(JSON.stringify(payload, null, 2))}</pre>
      <p>Check redirect URI, enabled APIs, and scopes.</p>
    `, 500);
  }
}

function html(title: string, body: string, status = 200) {
  const page = `<!doctype html><html><head>
  <meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>${esc(title)}</title>
  <style>body{font-family:ui-sans-serif,system-ui;-webkit-font-smoothing:antialiased;padding:24px;line-height:1.5}
  code{background:#222;color:#fff;padding:2px 4px;border-radius:4px}a{color:#38bdf8;text-decoration:none}a:hover{text-decoration:underline}</style>
  </head><body><h1 style="margin-top:0">${esc(title)}</h1>${body}</body></html>`;
  return new NextResponse(page, { headers: { "content-type": "text/html" }, status });
}
function esc(s: string) {
  return s.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;");
}
