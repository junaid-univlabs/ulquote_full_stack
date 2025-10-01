import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api, setAuthToken } from '../api/api';
import '../styles/new-auth.css';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErr('');
    try {
      const res = await api.post('/auth/signup', { name, email, password });
      const { token, user } = res.data;
      if (!token) throw new Error('No token returned');
      localStorage.setItem('token', token);
      setAuthToken(token);
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      setErr(error?.response?.data?.error || 'Signup failed');
    }
  }

  return (
    <div className="auth-shell">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Create account</h2>
        {err && <div className="err">{err}</div>}

        <label htmlFor="name">Name</label>
        <input
          id="name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />

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
          minLength={6}
        />

        <button className="btn-primary" type="submit">Sign up</button>

        <div className="muted" style={{ marginTop: 12 }}>
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </form>
    </div>
  );
}
