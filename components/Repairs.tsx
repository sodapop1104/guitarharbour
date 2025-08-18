export default function Repairs() {
  return (
    <section id="repairs">
      <div className="container">
        <h2 className="reveal" data-anim="up">Repairs &amp; Pricing</h2>
        <div className="pricing reveal" data-anim="up">
          <div className="table-wrap">
            <table aria-describedby="price-notes">
              <thead>
                <tr><th>Work</th><th>Typical Price</th><th>ETA</th></tr>
              </thead>
              <tbody>
                <tr><td>Standard Setup</td><td>$75–$120</td><td>2–3 days</td></tr>
                <tr><td>Fret Level/Crown</td><td>$180–$260</td><td>5–7 days</td></tr>
                <tr><td>Pickup Install (pair)</td><td>$90–$140</td><td>1–2 days</td></tr>
                <tr><td>Electronics Diagnostic</td><td>$40</td><td>Same day</td></tr>
                <tr><td>Nut Cut/Replace</td><td>$80–$120</td><td>2–3 days</td></tr>
              </tbody>
            </table>
          </div>
        </div>
        <p id="price-notes" className="muted reveal" data-anim="up" style={{ marginTop: 8 }}>
          Prices vary by instrument and parts. We’ll confirm a quote after inspection.
        </p>
      </div>
    </section>
  );
}