// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import ThemeProvider from "@/components/ThemeProvider";
import RevealManager from "@/components/RevealManager";
import { Analytics, type BeforeSendEvent } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: "Guitar Harbour",
  description: "Black & white guitar workshop — repairs, setups, and clean builds.",
  icons: { icon: "/assets/favicon.svg" },
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" }
  ],
};

const THEME_BOOTSTRAP = `
(function () {
  try {
    var stored = localStorage.getItem('gh-theme');
    var systemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    var theme = stored || (systemDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
  } catch(e) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP }} />
      </head>
      <body>
        <ThemeProvider>
          <RevealManager />
          {children}
        </ThemeProvider>

        {/* Vercel Speed Insights (performance metrics) */}
        <SpeedInsights />

        {/* Vercel Web Analytics (traffic) – drop events if user opted out */}
        <Analytics
          // debug messages show in dev by default; uncomment to silence:
          // debug={false}
          beforeSend={(event: BeforeSendEvent) => {
            if (typeof document !== "undefined" && document.cookie.includes("gh_optout=1")) {
              return null; // don't send analytics if opted out
            }
            return event;
          }}
        />
      </body>
    </html>
  );
}