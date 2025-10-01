// client/src/App.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProtectedRoute from './components/ProtectedRoute';

// Placeholder components for the marketing site pages
const SimplePage = ({ title }) => 
  <div style={{ padding: '80px 20px', textAlign: 'center' }}>
    <h1 style={{ color: '#0b1721' }}>{title}</h1>
    <p>This is a placeholder for the {title} content.</p>
  </div>;

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      {/* Public Marketing Routes */}
      <Route path="/features" element={<SimplePage title="Features" />} />
      <Route path="/pricing" element={<SimplePage title="Pricing" />} />
      <Route path="/about" element={<SimplePage title="About Us" />} />
      <Route path="/news" element={<SimplePage title="News" />} />
      <Route path="/contact" element={<SimplePage title="Contact Us" />} />
      <Route path="/terms" element={<SimplePage title="Terms of Service" />} />
      <Route path="/privacy" element={<SimplePage title="Privacy Policy" />} />

      {/* Authentication Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      {/* Protected Application Routes */}
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      {/* Fallback route for 404s */}
      <Route path="*" element={<SimplePage title="404 - Page Not Found" />} />
    </Routes>
  );
}