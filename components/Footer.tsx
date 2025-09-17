export default function Footer() {
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
            fontSize: "0.9rem",
          }}
        >
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <span>© 2025 Guitar Harbour</span>
            <span className="muted">Temple City, CA, USA | Manila, Philippines</span>
          </div>

          <div className="footer-links" style={{ display: "flex", gap: 8 }}>
            <a href="/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a> | 
            <a href="/terms" target="_blank" rel="noopener noreferrer">Terms of Service</a> | 
            <a href="/do-not-sell" target="_blank" rel="noopener noreferrer">Do Not Sell</a> | 
            <a href="/accessibility" target="_blank" rel="noopener noreferrer">Accessibility</a> |
            <a href="/cookies" target="_blank" rel="noopener noreferrer">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}