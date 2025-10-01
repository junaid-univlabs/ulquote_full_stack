import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { api, setAuthToken } from '../api/api';
import '../styles/new-auth.css';
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  async function handleSubmit(e) {
    e.preventDefault();
    setErr('');
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, user } = res.data;
      if (!token) throw new Error('No token returned');
      localStorage.setItem('token', token);
      setAuthToken(token);
      navigate(from, { replace: true });
    } catch (error) {
      console.error(error);
      setErr(error?.response?.data?.error || 'Login failed');
    }
  }

  return (
    <div className="auth-shell">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Sign in</h2>
        {err && <div className="err">{err}</div>}

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        <button className="btn-primary" type="submit">Login</button>

        <div className="muted" style={{ marginTop: 12 }}>
          Don’t have an account? <Link to="/signup">Sign up</Link>
        </div>
      </form>
    </div>
  );
}
