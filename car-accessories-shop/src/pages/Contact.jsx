import React, { useState } from 'react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email format';
    if (!form.subject.trim()) errs.subject = 'Subject is required';
    if (!form.message.trim()) errs.message = 'Message is required';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setSent(true);
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  return (
    <div className="contact-page">
      <div className="shop-header">
        <h1>Contact Us</h1>
        <p>We'd love to hear from you. Get in touch with our team.</p>
      </div>

      <div className="contact-grid">
        <div className="contact-info">
          <div className="contact-card">
            <span className="contact-card-icon">📍</span>
            <h3>Visit Us</h3>
            <p>123 Speed Street, Motor City<br />Automotive District, AC 12345</p>
          </div>
          <div className="contact-card">
            <span className="contact-card-icon">📞</span>
            <h3>Call Us</h3>
            <p>+1 (555) 123-4567<br />Mon-Sat: 9AM - 9PM</p>
          </div>
          <div className="contact-card">
            <span className="contact-card-icon">📧</span>
            <h3>Email Us</h3>
            <p>support@autogear.com<br />sales@autogear.com</p>
          </div>
          <div 
            className="contact-card" 
            style={{ cursor: 'pointer', transition: 'transform 0.2s', border: '1px solid rgba(255,255,255,0.1)' }}
            onClick={() => window.dispatchEvent(new Event('open-chat'))}
            onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
            onMouseOut={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
          >
            <span className="contact-card-icon">💬</span>
            <h3>Live Chat</h3>
            <p>Click here to open the chat<br />widget for instant help!</p>
          </div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          {sent && (
            <div className="form-success">
              ✅ Message sent successfully! We'll get back to you within 24 hours.
            </div>
          )}
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="John Doe"
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="form-error">{errors.name}</span>}
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>
          <div className="form-group">
            <label>Subject</label>
            <input
              type="text"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="What's this about?"
              className={errors.subject ? 'error' : ''}
            />
            {errors.subject && <span className="form-error">{errors.subject}</span>}
          </div>
          <div className="form-group">
            <label>Message</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Tell us more..."
              rows="5"
              className={errors.message ? 'error' : ''}
            />
            {errors.message && <span className="form-error">{errors.message}</span>}
          </div>
          <button type="submit" className="btn-primary">Send Message</button>
        </form>
      </div>
    </div>
  );
}
