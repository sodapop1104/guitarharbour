export const dynamic = "force-static";

export default function AccessibilityPage() {
  return (
    <main className="legal bp-wrap" style={{ maxWidth: 900 }}>
      <h1 className="bp-title">Accessibility Statement</h1>

      <p>
        <b>Guitar Harbour</b> is committed to ensuring digital accessibility for people with disabilities.
        We are continually improving the user experience for everyone and applying relevant accessibility standards.
      </p>

      <h2 className="bp-sectionTitle">Measures to Support Accessibility</h2>
      <ul>
        <li>Regularly reviewing website content for accessibility compliance.</li>
        <li>Providing text alternatives for non-text content where possible.</li>
        <li>Ensuring sufficient color contrast and keyboard accessibility.</li>
      </ul>

      <h2 className="bp-sectionTitle">Standards</h2>
      <p>
        We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.2 Level AA where feasible.
      </p>

      <h2 className="bp-sectionTitle">Feedback</h2>
      <p>
        We welcome your feedback on the accessibility of this website. Please let us know if you encounter
        accessibility barriers by emailing <a href="mailto:contact@guitarharbour.com">contact@guitarharbour.com</a>.
      </p>

      <h2 className="bp-sectionTitle">Compatibility</h2>
      <p>
        This website is designed to be compatible with most modern browsers and assistive technologies.
      </p>
    </main>
  );
}
