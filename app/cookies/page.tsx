export default function CookiePolicyPage() {
  return (
    <main className="bp-wrap">
      <header className="bp-header">
        <h1 className="bp-title">Cookie Policy</h1>
      </header>

      <section className="bp-panel">
        <p>
          At <strong>Guitar Harbour</strong>, we respect your privacy. This site does not use cookies for analytics
          or advertising. We use <a href="https://vercel.com/docs/analytics" target="_blank" rel="noopener noreferrer">Vercel Analytics</a>,
          which is a cookie-less, privacy-friendly analytics tool.
        </p>

        <h2 className="bp-sectionTitle">Essential Cookies</h2>
        <p>
          We may use strictly necessary cookies for site functionality (for example, saving your session
          during a booking). These cookies do not track you across other websites and are only used to
          provide the services you request.
        </p>

        <h2 className="bp-sectionTitle">Third-Party Cookies</h2>
        <p>
          We do not use advertising or tracking cookies.
        </p>

        <h2 className="bp-sectionTitle">Managing Cookies</h2>
        <p>
          You can control or delete cookies through your browser settings. If you disable all cookies,
          some parts of the site (like booking flow) may not function properly.
        </p>

        <h2 className="bp-sectionTitle">Questions?</h2>
        <p>
          For more details, please review our <a href="/privacy">Privacy Policy</a> or contact us at{' '}
          <a href="mailto:contact@guitarharbour.com">contact@guitarharbour.com</a>.
        </p>
      </section>
    </main>
  );
}