export const dynamic = "force-static";

export default function AccessibilityPage() {
  return (
    <main className="bp-wrap" style={{ maxWidth: 900 }}>
      <h1 className="bp-title">Accessibility Statement</h1>

      <p>
        <b>Guitar Harbour</b> is committed to ensuring digital accessibility for people with disabilities.
        We are continually improving the user experience for everyone and applying relevant accessibility standards.
      </p>

      <h2 className="bp-sectionTitle">Measures to Support Accessibility</h2>
      <ul>
        <li>Regularly reviewing website content for accessibility compliance.</li>
        <li>Providing text alternatives for non-text content where possible.</li>
        <li>Ensuring keyboard navigation works throughout the website.</li>
        <li>Using clear, readable fonts and high-contrast colors.</li>
      </ul>

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