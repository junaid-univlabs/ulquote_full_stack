import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProtectedRoute from './components/ProtectedRoute';


export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
                path="/contact"
                element={
                <Navigate to="https://univlabs.in/contact-us/" replace />
            }
/>


        {/* Example without role restriction */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Example with role restriction */}
        {/* <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowRoles={['admin']}>
              <Admin />
            </ProtectedRoute>
          }
        /> */}
      </Routes>
    </>
  );
}
