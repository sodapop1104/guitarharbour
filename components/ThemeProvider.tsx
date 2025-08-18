// components/ThemeProvider.tsx
"use client";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Minimal wrapper kept for future expansion; all theme work relies on data-theme on <html>
  return <>{children}</>;
}