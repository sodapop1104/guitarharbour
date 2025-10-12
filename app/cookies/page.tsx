export const dynamic = "force-static";

export default function CookiePolicyPage() {
  const updated = "October 12, 2025";

  return (
    <main className="legal" style={{ maxWidth: 900 }}>
      <h1>Cookie Policy</h1>
      <p><small>Last updated: {updated}</small></p>

      <p>
        At <strong>Guitar Harbour</strong>, we use a minimal set of cookies and similar
        technologies to make the site work and remember your preferences. This page
        explains what we use and your choices.
      </p>

      <h2 id="what-are-cookies">What are cookies?</h2>
      <p>
        Cookies are small text files that a website stores on your device. We also
        use similar storage (like localStorage) for certain preferences. You can
        control these in your browser settings.
      </p>

      <h2 id="how-we-use">How we use cookies and similar tech</h2>
      <ul>
        <li>
          <strong>Strictly necessary</strong>: Remember theme (dark/light),
          region/language, and maintain basic session flows (e.g., forms). These are
          required for core functionality and are not used for tracking you across sites.
        </li>
        <li>
          <strong>Analytics (cookie-less)</strong>: We may use privacy-friendly,
          cookie-less analytics (e.g., Vercel Analytics) to understand aggregate usage.
          No advertising cookies are set for this.
        </li>
      </ul>

      <h2 id="do-we-sell-share">Do we sell or share your data via cookies?</h2>
      <p>
        We do <strong>not</strong> sell personal information and do <strong>not</strong> share it for
        cross-context behavioral advertising. If this changes, you can opt out at{" "}
        <a href="/do-not-sell">Do Not Sell or Share My Personal Information</a>. We also
        honor Global Privacy Control (GPC) signals where applicable.
      </p>

      <h2 id="third-parties">Third-party content</h2>
      <p>
        Some embedded content (e.g., maps, videos, social embeds) may set their own
        cookies or use their own storage. Please review those providers’ policies for
        details.
      </p>

      <h2 id="manage-cookies">Managing cookies</h2>
      <p>
        Most browsers let you block, clear, or limit cookies and site data. If you
        disable all storage, parts of the site (such as preference saving or form
        steps) may not function properly.
      </p>

      <h2 id="changes">Changes to this policy</h2>
      <p>
        We may update this Cookie Policy from time to time. If we make material
        changes, we’ll update the “Last updated” date above and, when appropriate,
        provide additional notice.
      </p>

      <h2 id="contact">Contact</h2>
      <p>
        Questions? Email us at{" "}
        <a href="mailto:contact@guitarharbour.com">contact@guitarharbour.com</a>.
        You can also review our <a href="/privacy">Privacy Policy</a> for more info.
      </p>
    </main>
  );
}