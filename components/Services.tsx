export default function Services() {
  return (
    <section id="services">
      <div className="container">
        <h2 className="reveal" data-anim="up">Services</h2>
        <div className="grid stagger reveal in" data-anim="up">
          <article className="card"><h3>Full Setup</h3><p>Neck relief, action, intonation, nut slots, &amp; fresh strings.</p></article>
          <article className="card"><h3>Fretwork</h3><p>Level, crown, and polish—buzz-free playability.</p></article>
          <article className="card"><h3>Electronics</h3><p>Pickup swaps, wiring, shielding, and diagnostics.</p></article>
          <article className="card"><h3>Nut &amp; Saddle</h3><p>Bone, Tusq, and custom cuts for precise action.</p></article>
          <article className="card"><h3>Hardware</h3><p>Tuners, bridges, trem setup, and parts installs.</p></article>
          <article className="card"><h3>Custom Builds</h3><p>Clean, modern aesthetics with pro components.</p></article>
        </div>
      </div>
    </section>
  );
}