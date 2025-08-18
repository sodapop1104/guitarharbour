export default function Footer() {
  // keep static to avoid edge-case hydration differences at midnight
  return (
    <footer>
      <div className="container">
        <div className="divider" style={{ marginBottom: 18 }} />
        <div style={{ display:'flex', justifyContent:'space-between', gap:16, flexWrap:'wrap' }}>
          <span>© 2025 Guitar Harbour</span>
          <span className="muted">guitarharbour.com</span>
        </div>
      </div>
    </footer>
  );
}