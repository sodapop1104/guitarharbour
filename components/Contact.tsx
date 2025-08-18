"use client";
import type { FormEvent } from "react";

export default function Contact() {
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement & {
      name: { value: string };
      email: { value: string };
      message: { value: string };
    };

    const name = encodeURIComponent(form.name.value.trim());
    const email = encodeURIComponent(form.email.value.trim());
    const message = encodeURIComponent(form.message.value.trim());
    const subject = encodeURIComponent("Guitar Harbour Repair Inquiry");
    const body = `From: ${name} <${email}>%0D%0A%0D%0A${message}`;

    window.location.href = `mailto:contact@guitarharbour.com?subject=${subject}&body=${body}`;
  };

  return (
    <section id="contact">
      <div className="container">
        <h2 className="reveal" data-anim="up">Contact</h2>

        <div className="two">
          <form className="reveal form-grid" data-anim="left" onSubmit={submit} noValidate>
            <div className="field">
              <label htmlFor="name">Name</label>
              <input id="name" name="name" type="text" placeholder="Your name" required />
            </div>

            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" placeholder="you@email.com" required />
            </div>

            <div className="field field-full">
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" rows={6} placeholder="Tell us what you need repaired…" required />
            </div>

            <div className="field field-full">
              <button className="btn" type="submit">Send</button>
            </div>

            <p className="muted" style={{ margin: "6px 0 0" }}>
              Prefer phone? <a href="tel:+10000000000" aria-label="Call +1 000 000 0000">+1 (000) 000-0000</a>
            </p>
          </form>

          <div className="reveal" data-anim="right" aria-label="Shop details">
            <p><strong>Location</strong><br />[Update street]<br />[City], [State] [ZIP]</p>
            <p><strong>Hours</strong><br />Mon–Fri 10–6 • Sat by appt.</p>
            <p><strong>Email</strong><br /><a href="mailto:contact@guitarharbour.com">contact@guitarharbour.com</a></p>
            <p><strong>Social</strong><br /><a href="#" aria-label="Instagram">Instagram</a> · <a href="#" aria-label="YouTube">YouTube</a></p>
          </div>
        </div>
      </div>
    </section>
  );
}