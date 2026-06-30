import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-col">
          <h3 className="footer-brand">Auto<span>Gear</span></h3>
          <p className="footer-desc">Premium car accessories and performance parts. Elevate your driving experience.</p>
        </div>
        <div className="footer-col">
          <h4>Quick Links</h4>
          <Link to="/shop">Shop All</Link>
          <Link to="/categories">Categories</Link>
          <Link to="/orders">Track Order</Link>
          <Link to="/contact">Contact Us</Link>
        </div>
        <div className="footer-col">
          <h4>Categories</h4>
          <Link to="/shop?category=Interior">Interior</Link>
          <Link to="/shop?category=Exterior">Exterior</Link>
          <Link to="/shop?category=Lighting">Lighting</Link>
          <Link to="/shop?category=Performance">Performance</Link>
        </div>
        <div className="footer-col">
          <h4>Contact</h4>
          <p>📍 123 Speed Street, Motor City</p>
          <p>📞 +1 (555) 123-4567</p>
          <p>📧 support@autogear.com</p>
          <p>🕐 Mon-Sat: 9AM - 9PM</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2026 AutoGear. All rights reserved.</p>
      </div>
    </footer>
  );
}
