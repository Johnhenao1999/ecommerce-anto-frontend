// Footer.jsx
import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <h3>Anto Store</h3>
          <p>Your trusted partner in beauty and self-care.</p>
          <div className="social-icons">
            <i className="fa-brands fa-facebook"></i>
            <i className="fa-brands fa-instagram"></i>
            <i className="fa-brands fa-twitter"></i>
          </div>
        </div>

        <div>
          <h4>Shop</h4>
          <ul>
            <li>Makeup</li>
            <li>Skincare</li>
            <li>Fragrance</li>
            <li>Tools</li>
          </ul>
        </div>

        <div>
          <h4>Support</h4>
          <ul>
            <li>Contact Us</li>
            <li>Shipping Info</li>
            <li>Returns</li>
            <li>Size Guide</li>
          </ul>
        </div>

        <div>
          <h4>Company</h4>
          <ul>
            <li>About Us</li>
            <li>Careers</li>
            <li>Privacy Policy</li>
            <li>Terms of Service</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2024 BeautyBloom. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
