import Link from "next/link";

export default function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="container">
        <h1 className="reveal" data-anim="up">Shop. Repair. Dialed Tone.</h1>
        <p className="reveal" data-anim="up">
          Setups, fretwork, electronics, and clean builds done right.
          All in a minimalist black &amp; white look—because your sound should do the talking.
        </p>
        <div className="hero-cta reveal" data-anim="up">
          <Link className="btn block" href="/book" prefetch={false} aria-label="Schedule an online consultation">
            Schedule an online consultation
          </Link>
        </div>
      </div>
    </section>
  );
}