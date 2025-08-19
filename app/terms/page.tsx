export const dynamic = "force-static";

export default function TermsPage() {
  const updated = "August 18, 2025"; // Hardcoded date

  return (
    <main className="bp-wrap">
      <h1 className="bp-title">Terms of Service</h1>
      <p className="bp-subtitle">Last updated: {updated}</p>

      <p>
        Welcome to <b>Guitar Harbour</b>. By using our website, booking a
        service, or contacting us, you agree to these Terms of Service. Please
        read them carefully.
      </p>

      <h2 className="bp-sectionTitle">Services</h2>
      <p>
        We provide guitar repair, setup, and related services. Specific details,
        pricing, and availability may vary and will be confirmed when you book a
        service.
      </p>

      <h2 className="bp-sectionTitle">User Responsibilities</h2>
      <ul>
        <li>Provide accurate contact and booking information.</li>
        <li>Pick up and drop off instruments on the agreed schedule (if applicable).</li>
        <li>Ensure that any instrument you provide is your property or that you have the right to authorize repairs.</li>
      </ul>

      <h2 className="bp-sectionTitle">Payment</h2>
      <p>
        Payment terms will be communicated at the time of booking. Unless
        otherwise agreed, payment is due upon completion of the service.
        We reserve the right to withhold release of instruments until payment is received in full.
      </p>

      <h2 className="bp-sectionTitle">Cancellations</h2>
      <p>
        If you need to cancel or reschedule, please contact us at{" "}
        <a href="mailto:contact@guitarharbour.com">contact@guitarharbour.com</a>.
      </p>

      <h2 className="bp-sectionTitle">Limitations of Liability</h2>
      <p>While we take care with every instrument, <b>Guitar Harbour</b> is not liable for:</p>
      <ul>
        <li>Pre-existing damage or defects in your instrument.</li>
        <li>Normal wear and tear or issues arising from improper storage or use after service.</li>
        <li>Indirect, incidental, or consequential damages.</li>
      </ul>

      <h2 className="bp-sectionTitle">Intellectual Property</h2>
      <p>All content on this website (including text, images, and branding) is the property of <b>Guitar Harbour</b> and may not be used without permission.</p>

      <h2 className="bp-sectionTitle">Privacy</h2>
      <p>Your use of this site is also governed by our <a href="/privacy">Privacy Policy</a>.</p>

      <h2 className="bp-sectionTitle">Changes</h2>
      <p>We may update these Terms from time to time. Continued use of our website or services after changes means you accept the updated Terms.</p>

      <h2 className="bp-sectionTitle">Contact</h2>
      <p>
        For any questions about these Terms, email us at{" "}
        <a href="mailto:contact@guitarharbour.com">contact@guitarharbour.com</a>.
      </p>
    </main>
  );
}