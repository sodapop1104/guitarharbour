"use client";
import { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { FaFacebook, FaInstagram, FaYoutube, FaTiktok } from "react-icons/fa";

type SubmitState = "idle" | "sending" | "success" | "error";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<SubmitState>("idle");
  const [serverMsg, setServerMsg] = useState<string>("");

  const emailRegex = /^(?!\.)(?!.*\.\.)[A-Za-z0-9_'+\-\.]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+$/;

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === "name") {
      setErrors(prev => ({ ...prev, name: value.trim() ? "" : "Please enter your name." }));
    } else if (name === "email") {
      if (!value.trim()) setErrors(prev => ({ ...prev, email: "Please enter your email." }));
      else if (!emailRegex.test(value)) setErrors(prev => ({ ...prev, email: "Please enter a valid email address." }));
      else setErrors(prev => ({ ...prev, email: "" }));
    } else if (name === "message") {
      setErrors(prev => ({ ...prev, message: value.trim() ? "" : "Please enter a message." }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const nextErrors = {
      name: formData.name.trim() ? "" : "Please enter your name.",
      email: !formData.email.trim()
        ? "Please enter your email."
        : emailRegex.test(formData.email)
        ? ""
        : "Please enter a valid email address.",
      message: formData.message.trim() ? "" : "Please enter a message.",
    };
    setErrors(nextErrors);
    if (nextErrors.name || nextErrors.email || nextErrors.message) return;

    try {
      setStatus("sending");
      setServerMsg("");
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          message: formData.message.trim(),
        }),
      });

      const data: { ok?: boolean; message?: string } = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.message || "Something went wrong.");

      setStatus("success");
      setServerMsg("Thanks! Your message has been sent. We'll get back to you soon.");
      setFormData({ name: "", email: "", message: "" });
    } catch (err: unknown) {
      setStatus("error");
      setServerMsg(err instanceof Error ? err.message : "Unable to send right now. Please try again.");
    } finally {
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <section id="contact">
      <div className="container">
        <h2 className="reveal" data-anim="up">Contact</h2>

        <div className="two">
          {/* Contact Form */}
          <form className="reveal form-grid" data-anim="left" onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="name">Name</label>
              <input
                id="name" name="name" type="text" placeholder="Your name"
                value={formData.name} onChange={handleChange} autoComplete="name"
                aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-err" : undefined}
              />
              {errors.name && <p id="name-err" className="error">{errors.name}</p>}
            </div>

            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email" name="email" type="email" placeholder="you@email.com"
                value={formData.email} onChange={handleChange} autoComplete="email"
                aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-err" : undefined}
                pattern="^(?!\.)(?!.*\.\.)[A-Za-z0-9_'+\-\.]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+$"
                title="Enter a valid email address"
              />
              {errors.email && <p id="email-err" className="error">{errors.email}</p>}
            </div>

            <div className="field field-full">
              <label htmlFor="message">Message</label>
              <textarea
                id="message" name="message" rows={6}
                placeholder="Please tell us what you need..."
                value={formData.message} onChange={handleChange}
                aria-invalid={!!errors.message} aria-describedby={errors.message ? "msg-err" : undefined}
              />
              {errors.message && <p id="msg-err" className="error">{errors.message}</p>}
            </div>

            <div className="field field-full">
              <button className="btn" type="submit" disabled={status === "sending"}>
                {status === "sending" ? "Sending…" : "Send"}
              </button>
              {serverMsg && (
                <p className="muted" style={{ marginTop: 8, color: status === "error" ? "#ff4d4f" : "var(--muted)" }}>
                  {serverMsg}
                </p>
              )}
            </div>

            {/* Phone Numbers */}
            <div className="muted" style={{ marginTop: "6px" }}>
              <p>Prefer phone?</p>
              <p>USA: <a href="tel:+13102207048" aria-label="Call USA +1 310 220 7048">+1 310 220 7048</a></p>
              <p>Manila, PH: <a href="tel:+639604055607" aria-label="Call Manila, PH +63 960 405 5607">+63 960 405 5607</a></p>
            </div>
          </form>

          {/* Shop Details */}
          <div className="reveal" data-anim="right" aria-label="Shop details">
            <p><strong>Location</strong></p>
            <p>
              <strong>Temple City, CA</strong><br />
              We serve musicians across the San Gabriel Valley and nearby areas. Our pickup-and-delivery service handles expert guitar repairs, setups, and modifications — we collect your instrument, care for it, and return it ready to play.
            </p>
            <p>
              <strong>Manila, Philippines</strong><br />
              1929 Tomas Mapua St., Sta. Cruz, Manila 1012<br />
              Manila, Philippines
            </p>

            <p><strong>Hours</strong><br />Available by appointment • Mon–Sat, 9AM–6PM</p>
            <p><strong>Email</strong><br /><span>contact@guitarharbour.com</span></p> {/* plain text so it won't open mail app */}

            {/* Social Buttons */}
            <p><strong>Social</strong></p>
            <div className="social-buttons">
              <a href="https://www.facebook.com/GuitarHarbourPH" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="social-btn facebook"><FaFacebook /> Facebook</a>
              <a href="https://www.instagram.com/guitarharbour.la/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="social-btn instagram"><FaInstagram /> Instagram</a>
              <a href="https://www.youtube.com/@bimbocanayon2308" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="social-btn youtube"><FaYoutube /> YouTube</a>
              <a href="https://www.tiktok.com/@guitarharbourla" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="social-btn tiktok"><FaTiktok /> TikTok</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
