// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import ThemeProvider from "@/components/ThemeProvider";
import RevealManager from "@/components/RevealManager";

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
      </body>
    </html>
  );
}