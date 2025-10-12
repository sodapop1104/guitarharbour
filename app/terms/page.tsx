export const dynamic = "force-static";

export default function TermsPage() {
  const updated = "August 18, 2025"; // Hardcoded date

  return (
    <main className="legal bp-wrap">
      <h1 className="bp-title">Terms of Service</h1>
      <p className="bp-subtitle">Last updated: {updated}</p>

      <p>
        Welcome to <b>Guitar Harbour</b>. By using our website, booking a
        service, or contacting us, you agree to these Terms of Service. Please
        read them carefully.
      </p>

      <h2 className="bp-sectionTitle">Use of the Site</h2>
      <ul>
        <li>Don’t misuse the site or attempt to interfere with its operation.</li>
        <li>
          You may not use our name, brand, or content without permission except
          as allowed by law.
        </li>
      </ul>

      <h2 className="bp-sectionTitle">Bookings & Services</h2>
      <ul>
        <li>Quoted prices are estimates; final costs may vary based on scope.</li>
        <li>We reserve the right to refuse service for any reason.</li>
        <li>
          You are responsible for accurate information when booking and for
          picking up/dropping off instruments on time.
        </li>
      </ul>

      <h2 className="bp-sectionTitle">Payment</h2>
      <ul>
        <li>Payment is due upon completion unless otherwise agreed.</li>
        <li>
          Deposits (if any) may be required for certain services or parts orders.
        </li>
      </ul>

      <h2 className="bp-sectionTitle">Warranty & Limitations</h2>
      <ul>
        <li>
          We stand behind our work. If you experience an issue related to our
          service within a reasonable timeframe, contact us and we’ll assess it.
        </li>
        <li>
          To the maximum extent permitted by law, we are not liable for indirect
          or consequential damages.
        </li>
      </ul>

      <h2 className="bp-sectionTitle">User Content</h2>
      <p>
        If you submit reviews, messages, or media, you grant us a non-exclusive
        license to display them on the site and our social pages, subject to our
        moderation.
      </p>

      <h2 className="bp-sectionTitle">Privacy</h2>
      <p>Your use of this site is also governed by our <a href="/privacy">Privacy Policy</a>.</p>

      <h2 className="bp-sectionTitle">Changes</h2>
      <p>We may update these Terms from time to time. Continued use of the site or our services after changes means you accept the updated Terms.</p>

      <h2 className="bp-sectionTitle">Contact</h2>
      <p>
        For any questions about these Terms, email us at{" "}
        <a href="mailto:contact@guitarharbour.com">contact@guitarharbour.com</a>.
      </p>
    </main>
  );
}
