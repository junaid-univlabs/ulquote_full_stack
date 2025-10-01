import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/landing.css';

const HERO_IMG = '/images/hero-banner.jpg';
const TEAM_IMG = '/images/team.jpg';

export default function LandingPage() {
  return (
    <main>
      {/* HERO */}
      <section className="ul-hero">
        <div className="ul-hero-inner">
          <div className="ul-hero-text">
            <div className="kicker">WELCOME TO UNIVLABS</div>
            <h1>Surgical Solutions from brilliant minds of World</h1>
            <p className="muted">
              Build branded, accurate quotations from our product catalogue, export PDFs, and track approvals.
            </p>
            <div className="ul-cta">
              <Link className="ul-cta-primary" to="/signup">Get started — it's free</Link>
              <Link className="ul-cta-secondary" to="/features">See features</Link>
            </div>
          </div>

          <div className="ul-hero-media" aria-hidden>
            <div className="ul-hero-banner" style={{ backgroundImage: `url(${HERO_IMG})` }}>
              <div className="ul-hero-overlay">
                <div className="ul-hero-button">Read Stories</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WELCOME */}
      <section className="ul-welcome">
        <div className="ul-container">
          <div className="ul-welcome-inner">
            <div className="ul-welcome-text">
              <h2>Welcome to UnivLabs Quote Bot</h2>
              <p className="muted">
                Create fast quotes quickly, track history, and export to PDFs.
              </p>
              <p className="muted">
                Add products, get prices, and approvals from one intuitive dashboard.
              </p>
            </div>
            <div className="ul-welcome-media" aria-hidden>
              <div className="ul-profile-card">
                <img src={TEAM_IMG} alt="UnivLabs Team" />
                <div className="profile-meta">
                  <div className="profile-name">UnivLabs Team</div>
                  <div className="profile-role muted">Quotation System</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="ul-features">
        <div className="ul-container">
          <h2>Why ULQuote</h2>
          <p className="muted">Everything your sales team needs to create accurate, brand‑consistent quotes.</p>
          <div className="ul-features-grid">
            <div className="feature">
              <h3>Product catalogue</h3>
              <p>Organize SKUs, categories and price rules.</p>
            </div>
            <div className="feature">
              <h3>Quote builder</h3>
              <p>Add line items, discounts, tax and terms.</p>
            </div>
            <div className="feature">
              <h3>PDF export</h3>
              <p>Generate branded PDFs ready to email.</p>
            </div>
            <div className="feature">
              <h3>Drafts & history</h3>
              <p>Save drafts, track status and approvals.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA BAND */}
      <section className="ul-cta-band">
        <div className="ul-container">
          <h3>Ready to stop juggling spreadsheets?</h3>
          <Link className="ul-cta-primary" to="/signup">Start your free trial</Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="ul-footer">
        <div className="ul-container">
          <div>© {new Date().getFullYear()} UnivLabs</div>
          <nav>
            <Link to="/terms">Terms</Link>
            <Link to="/privacy">Privacy</Link>
          </nav>
        </div>
      </footer>
    </main>
  );
}
