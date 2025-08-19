export default function Footer() {
  // keep static to avoid edge-case hydration differences at midnight
  return (
    <footer>
      <div className="container">
        <div className="divider" style={{ marginBottom: 18 }} />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <span>© 2025 Guitar Harbour</span>
            <span className="muted">guitarharbour.com</span>
          </div>

          <ul
            style={{
              display: "flex",
              gap: 12,
              listStyle: "none",
              padding: 0,
              margin: 0,
              flexWrap: "wrap",
            }}
          >
            <li>
              <a href="/privacy">Privacy Policy</a>
            </li>
            <li>
              <a href="/do-not-sell">Do Not Sell or Share My Personal Information</a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}