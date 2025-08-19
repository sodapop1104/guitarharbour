export default function sitemap() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://guitarharbour.vercel.app";
  const now = new Date();
  return [
    { url: `${base}/`, lastModified: now },
    { url: `${base}/book`, lastModified: now },
    { url: `${base}/privacy`, lastModified: now },
    { url: `${base}/do-not-sell`, lastModified: now },
  ];
}