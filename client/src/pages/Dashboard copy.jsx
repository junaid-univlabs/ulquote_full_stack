// src/pages/Dashboard.jsx
import React, { useState } from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import '../styles/landing.css'; // reuse your existing styles
import ProductList from '../components/ProductList';

// --- Product data (later can be fetched from Google Sheets/DB) ---
const products = [
  { category: 'Imaging Solutions', name: '4K ICG System', description: 'UnivLabs 4K ICG System', price: 2500000, sku: 'UL4K-ICG', availability: 'In Stock' },
  { category: 'Imaging Solutions', name: 'CMOS Platina Systems', description: 'UnivLabs CMOS', price: 2500000, sku: 'ULCMOS', availability: 'In Stock' },
  { category: 'Imaging Solutions', name: '3CHIP', description: 'UL 3chhip camer', price: 2500000, sku: 'UL3C', availability: 'In Stock' },
  { category: 'Medical Pumps', name: 'Arthroscopy Pump', description: 'UL PUMP 1', price: 2500000, sku: 'ULART', availability: 'In Stock' },
  { category: 'Medical Pumps', name: 'Hysteroscope Pump', description: 'UL PUMP 2', price: 2500000, sku: 'ULHST', availability: 'In Stock' },
  { category: 'Medical Pumps', name: 'Lapro Pump', description: 'UL PUMP 3', price: 2500000, sku: 'UL LP', availability: 'In Stock' },
  { category: 'Medical Pumps', name: 'Universal Pump', description: 'UL PUMP 4', price: 2500000, sku: 'ULUMP', availability: 'In Stock' },
  { category: 'Smoke Management', name: 'UL-SE16 Smoke Evacuator', description: 'UL SMK', price: 500000, sku: 'ULSSK', availability: 'In Stock' },
];

// --- Child pages ---
function DashboardHome() {
  return (
    <div className="dash-section">
      <h2>Welcome back 👋</h2>
      <p className="muted">Here’s your sales overview and quick actions.</p>
    </div>
  );
}

function Products() {
  const [activeCategory, setActiveCategory] = useState(null);

  // STEP 2: group by category
  const categories = [...new Set(products.map(p => p.category))];
  const filteredProducts = activeCategory
    ? products.filter(p => p.category === activeCategory)
    : [];

  return (
    <div className="dash-section">
      <h2>Products</h2>
      <p className="muted">Browse products by category.</p>

      {/* Category chips */}
      <div className="category-list">
        {categories.map(cat => (
          <div
            key={cat}
            className={`category-item ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </div>
        ))}
      </div>

      {/* Product cards */}
      <div className="product-list mt-4">
        {activeCategory ? (
          <ProductList
            products={filteredProducts}
            onAdd={(product, qty) => {
              console.log('Add to quote/cart:', product, 'Qty:', qty);
            }}
          />
        ) : (
          <div className="p-4 text-gray-600">Select a category to view products.</div>
        )}
      </div>
    </div>
  );
}

function Quotes() {
  return (
    <div className="dash-section">
      <h2>Quotes</h2>
      <p className="muted">Create, edit, and track your quotations.</p>
    </div>
  );
}

// --- Main Dashboard Shell ---
export default function Dashboard() {
  return (
    <div className="dashboard-shell">
      {/* Sidebar */}
      <aside className="dash-sidebar">
        <div className="dash-brand">ULQuote</div>
        <nav className="dash-nav">
          <Link to="">Home</Link>
          <Link to="products">Products</Link>
          <Link to="quotes">Quotes</Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="dash-main">
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="products" element={<Products />} />
          <Route path="quotes" element={<Quotes />} />
        </Routes>
      </main>
    </div>
  );
}
