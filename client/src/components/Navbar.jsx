import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/navbar.css';

export default function Navbar() {
  const [isAuthed, setIsAuthed] = useState(!!localStorage.getItem('token'));
  const navigate = useNavigate();

  useEffect(() => {
    const onStorage = () => setIsAuthed(!!localStorage.getItem('token'));
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  function signOut() {
    localStorage.removeItem('token');
    setIsAuthed(false);
    navigate('/');
  }

  return (
    <header className="ul-nav">
      <div className="ul-container ul-nav-row">
        <div className="ul-brand">
          <a href="/" className="ul-brand-link">
            <img src="/images/univlabs-logo.png" alt="UnivLabs" className="ul-brand-logo" />
            <div className="ul-brand-text">
              <strong className="ul-logo-accent">UnivLabs</strong>
              <span className="ul-logo-sub">Quatation System</span>
            </div>
          </a>
        </div>

        <nav className="ul-links" aria-label="Primary">
          <Link to="/">Home</Link>
          <Link to="/features">Features</Link>
          {/* <Link to="/pricing">Pricing</Link> */}
          <Link to="/about">About</Link>
          <Link to="/news">News</Link>
          <Link to="/contact">Contact</Link>
        </nav>

        <div className="ul-actions">
          {!isAuthed ? (
            <>
              <Link className="ul-primary ul-login" to="/login">Login</Link>
              <Link className="ul-primary ul-signup" to="/signup">Sign Up</Link>
            </>
          ) : (
            <>
              <Link className="ul-ghost" to="/dashboard">Dashboard</Link>
              <button className="ul-primary" onClick={signOut}>Sign out</button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
