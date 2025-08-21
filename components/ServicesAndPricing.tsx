export default function ServicesAndPricing() {
  return (
    <section id="services">
      <div className="container">
        <h2 className="reveal" data-anim="up">Services &amp; Pricing</h2>

        <div className="grid stagger reveal" data-anim="up">
          {/* Deep Cleaning */}
          <article className="card service-card">
            <h3>Deep Cleaning – $35</h3>
            <ul className="pick-list">
              <li>A complete hardware refresh for your guitar.</li>
              <li>Disassembly, cleaning, and reassembly of bridges (Floyd Rose, Strat, 2-point tremolo)</li>
              <li>Full hardware deep clean (including tuning pegs)</li>
              <li>Fretboard reconditioning</li>
              <li>All cleaning done with MusicNomad professional tools and solutions</li>
              <li>Scratchy potentiometer, cleaning included.</li>
              <li>Available when you avail one of our setup packages.</li>
            </ul>
          </article>

          {/* Basic Setup */}
          <article className="card service-card">
            <h3>Basic Setup – $150</h3>
            <ul className="pick-list">
              <li>Designed to improve your guitar’s comfort and playability.</li>
              <li>Fretboard cleaning &amp; conditioning (rosewoods get mineral oil treatment)</li>
              <li>Fretwire polish for smoother bends</li>
              <li>Nut height adjustment using MusicNomad height gauges and nut files or our trusted custom measurements</li>
              <li>Intonation with the Turbo Tuner ST-300 (±0.02 cent accuracy—the most precise tool available)</li>
              <li>Action adjustment (low, medium, high—tailored to client preference &amp; instrument&apos;s fret and fretboard condition)</li>
              <li>Pickup height adjustment using MusicNomad measurement tools (customizable to client preference)</li>
              <li>Basic body cleaning with MusicNomad supplies (removes sweat, dirt, and grime). Note: deep cleaning with hardware disassembly carries an additional fee.</li>
              <li>String lubrication with MusicNomad lubricators for smoother sliding and extended string life</li>
              <li>Nut lubrication with MusicNomad Nut Sauce to reduce string friction, improve tuning stability, and give a smoother feel while bending or using the tremolo.</li>
            </ul>
          </article>

          {/* Fret Level */}
          <article className="card service-card">
            <h3>Fret Level – $250 (Setup Included)</h3>
            <ul className="pick-list">
              <li>Precision fretwork using specialized tools + experience. higher chance of achieving lower action with basic setup.</li>
              <li>Fret leveling with Baroque and MusicNomad tools</li>
              <li>Fret crowning using the MusicNomad S-file for more accurate note while fretting</li>
              <li>Fret end dressing for a smooth, comfortable neck feel</li>
              <li>Optional services (+$50): fret pressing (hammer method), fret sprout treatment, fret end gluing (depends on instrument condition, client’s discretion needed)</li>
            </ul>
          </article>

          {/* Wiring & Electronics */}
          <article className="card service-card">
            <h3>Wiring &amp; Electronics</h3>
            <ul className="pick-list">
              <li>Pickup replacement – $40 each</li>
              <li>Potentiometer change – $35 each</li>
              <li>Switch replacement – $40–$50</li>
              <li>Loose wire &amp; input jack fix – $25</li>
              <li>Full overhaul rewire (Gavitt wires included) – $100–$150</li>
              <li>Scratchy potentiometer cleaning included with all wiring jobs</li>
            </ul>
          </article>

          {/* Custom Nut Fabrication */}
          <article className="card service-card">
            <h3>Custom Nut Fabrication – $60–100</h3>
            <ul className="pick-list">
              <li>Crafted with precise spacing ruler tools</li>
              <li>Material options: GraphTech, bone, slotted or blank</li>
              <li>Height always tailored to your playing style and preference or with our custom height measurement.</li>
            </ul>
          </article>

          {/* Future Services */}
          <article className="card service-card">
            <h3>Future Services (Coming Soon)</h3>
            <ul className="pick-list">
              <li>Refret (rosewood fretboards only)</li>
              <li>Preamp installations (acoustic guitars – soundhole or mounted)</li>
              <li>Woodwork (pickup cavity routing, custom cavity jobs)</li>
              <li>Headstock reglues (no paint included)</li>
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}