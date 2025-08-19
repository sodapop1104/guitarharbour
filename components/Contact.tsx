"use client";
import { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { FaFacebook, FaInstagram, FaYoutube, FaTiktok } from "react-icons/fa";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({ name: "", email: "", message: "" });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormData(prev => ({ ...prev, [name]: value }));

    // Real-time validation
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

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Final check before submit
    if (errors.name || errors.email || errors.message || !formData.name || !formData.email || !formData.message) return;

    const subject = encodeURIComponent("Guitar Harbour Repair Inquiry");
    const body = `From: ${formData.name} <${formData.email}>%0D%0A%0D%0A${formData.message}`;
    window.location.href = `mailto:contact@guitarharbour.com?subject=${subject}&body=${body}`;
  };

  return (
    <section id="contact">
      <div className="container">
        <h2 className="reveal" data-anim="up">Contact</h2>

        <div className="two">
          {/* Contact Form */}
          <form className="reveal form-grid" data-anim="left" onSubmit={submit} noValidate>
            <div className="field">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && <p className="error">{errors.name}</p>}
            </div>

            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@email.com"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <p className="error">{errors.email}</p>}
            </div>

            <div className="field field-full">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                rows={6}
                placeholder="Please tell us what you need..."
                value={formData.message}
                onChange={handleChange}
              />
              {errors.message && <p className="error">{errors.message}</p>}
            </div>

            <div className="field field-full">
              <button className="btn" type="submit">Send</button>
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
            <p><strong>Location</strong><br />123 Street Blvd<br />Temple City, CA 91007</p>
            <p><strong>Hours</strong><br />Mon–Fri 9AM–6PM • Sat by appt. only</p>
            <p><strong>Email</strong><br /><a href="mailto:contact@guitarharbour.com">contact@guitarharbour.com</a></p>

            {/* Social Buttons */}
            <p><strong>Social</strong></p>
            <div className="social-buttons">
              <a
                href="https://www.facebook.com/GuitarHarbourPH"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="social-btn facebook"
              >
                <FaFacebook /> Facebook
              </a>
              <a
                href="https://www.instagram.com/guitarharbourmanila/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="social-btn instagram"
              >
                <FaInstagram /> Instagram
              </a>
              <a
                href="https://www.youtube.com/@bimbocanayon2308"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="social-btn youtube"
              >
                <FaYoutube /> YouTube
              </a>
              <a
                href="https://www.tiktok.com/@guitarharbourcustomshop"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="social-btn tiktok"
              >
                <FaTiktok /> TikTok
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}