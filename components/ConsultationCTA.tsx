import Link from "next/link";

export default function ConsultationCTA() {
  return (
    <section id="book">
      <div className="container">
        <div className="reveal" data-anim="up" style={{ maxWidth: 680 }}>
          <h2 style={{ marginBottom: 12 }}>Book an Online Consultation</h2>
          <p className="muted" style={{ marginBottom: 14 }}>
            Quick chat about your guitar’s setup, fretwork, or electronics. We’ll confirm scope, parts, and timelines.
          </p>
          <Link
            className="btn block"
            href="/book"
            prefetch={false}
            aria-label="Schedule an online consultation"
          >
            Schedule an online consultation
          </Link>
        </div>
      </div>
    </section>
  );
}