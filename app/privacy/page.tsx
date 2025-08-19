export const dynamic = "force-static";

export default function PrivacyPage() {
  const updated = "August 18, 2025"; // Hardcode instead of auto date

  return (
    <main className="bp-wrap" style={{ maxWidth: 900 }}>
      <h1 className="bp-title">Privacy Policy</h1>
      <p className="bp-subtitle" style={{ marginBottom: 16 }}>
        Last updated: {updated}
      </p>

      <p>
        <b>Guitar Harbour</b> (“we”, “us”) operates this website. This notice
        describes what we collect, why, how long we keep it, who we share it
        with, and your rights under the California Consumer Privacy Act (as
        amended by CPRA).
      </p>

      <h2 className="bp-sectionTitle">Categories of Personal Information We Collect</h2>
      <ul>
        <li><b>Identifiers</b>: name, email address.</li>
        <li><b>Customer communications</b>: booking notes you submit.</li>
        <li>
          <b>Internet/usage data</b>: pages viewed and device info if you consent
          to analytics.
        </li>
      </ul>

      <h2 className="bp-sectionTitle">Sources</h2>
      <p>
        Directly from you (forms) and, if enabled, analytics tools on our site.
      </p>

      <h2 className="bp-sectionTitle">Purposes</h2>
      <ul>
        <li>Process and manage consultation bookings.</li>
        <li>Communicate with you about your request.</li>
        <li>
          Improve the website and services (analytics only if you consent).
        </li>
      </ul>

      <h2 className="bp-sectionTitle">Retention</h2>
      <p>
        We retain booking details only as long as needed to provide the service
        and meet legal requirements, typically up to 2 years, then delete or
        de-identify them.
      </p>

      <h2 className="bp-sectionTitle">Selling/Sharing</h2>
      <p>
        We do <b>not</b> sell personal information. We do <b>not</b> share
        personal information for cross-context behavioral advertising. If we
        enable analytics or ads features in the future, you can opt out at{" "}
        <a href="/do-not-sell">Do Not Sell or Share My Personal Information</a>,
        and we honor Global Privacy Control (GPC) signals as valid opt-out
        requests.
      </p>

      <h2 className="bp-sectionTitle">Disclosures to Service Providers</h2>
      <p>
        We use processors such as hosting (Vercel), email (SMTP), and calendar
        (Google Calendar) under contracts that limit their use of your data to
        providing services to us.
      </p>

      <h2 className="bp-sectionTitle">Your Rights (California)</h2>
      <ul>
        <li>
          <b>Know/Access</b> the categories and specific pieces of personal
          information we collected.
        </li>
        <li>
          <b>Delete</b> personal information, with certain exceptions.
        </li>
        <li>
          <b>Correct</b> inaccurate personal information.
        </li>
        <li>
          <b>Opt out</b> of sale or sharing (if applicable) and limit use of
          sensitive information (not collected here).
        </li>
        <li>
          <b>Non-discrimination</b> for exercising your rights.
        </li>
      </ul>

      <p>
        Submit requests by emailing{" "}
        <a href="mailto:contact@guitarharbour.com">
          contact@guitarharbour.com
        </a>{" "}
        or via the form at{" "}
        <a href="/do-not-sell">Do Not Sell/Share</a>. We’ll verify your request
        and respond within the time required by law.
      </p>

      <h2 className="bp-sectionTitle">Minors</h2>
      <p>
        We do not knowingly collect personal information from children under 13.
        We do not sell or share personal information of consumers under 16.
      </p>

      <h2 className="bp-sectionTitle">Contact</h2>
      <p>
        Email:{" "}
        <a href="mailto:contact@guitarharbour.com">
          contact@guitarharbour.com
        </a>
      </p>
    </main>
  );
}