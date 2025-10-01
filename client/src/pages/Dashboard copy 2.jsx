// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import '../styles/landing.css';
import ProductList from '../components/ProductList';

function DashboardHome() {
  return (
    <div className="dash-section">
      <h2>Welcome back 👋</h2>
      <p className="muted">Here’s your sales overview and quick actions.</p>
    </div>
  );
}

function Products() {
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [cart, setCart] = useState([]);

  // Fetch from Google Sheets (your gsx2json endpoint)
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(
          'https://gsx2json.com/api?id=1HD-zjZ8w8lfi1X8pdWJwASpCbwDV3jaCsVcv-D9n4o0&sheet=quote_data'
        );
        const data = await res.json();
        if (data && data.rows) {
          setProducts(data.rows);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    }
    fetchData();
  }, []);

  const categories = [...new Set(products.map(p => p.Category))];
  const filteredProducts = activeCategory
    ? products.filter(p => p.Category === activeCategory)
    : [];

  // Add to cart handler
  const handleAdd = (product, qty) => {
    setCart(prev => {
      const existing = prev.find(item => item.SKU === (product.SKU || product.sku));
      if (existing) {
        return prev.map(item =>
          item.SKU === (product.SKU || product.sku)
            ? { ...item, qty: item.qty + qty }
            : item
        );
      }
      return [...prev, { ...product, qty }];
    });
  };

  // Calculate total
  const total = cart.reduce((sum, item) => {
    const price = parseFloat(item.Price || item.price || 0);
    return sum + price * item.qty;
  }, 0);

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

      {/* Horizontal product list */}
      <div className="product-list mt-4">
        {activeCategory ? (
          <ProductList products={filteredProducts} onAdd={handleAdd} />
        ) : (
          <div className="p-4 text-gray-600">
            Select a category to view products.
          </div>
        )}
      </div>

      {/* Quote Cart Panel */}
      {cart.length > 0 && (
        <div className="quote-cart mt-6 p-4 border rounded bg-white shadow">
          <h3 className="font-semibold mb-2">Quote Cart</h3>
          <ul>
            {cart.map(item => (
              <li key={item.SKU || item.sku} className="flex justify-between py-1 border-b">
                <span>
                  {item.Name || item.name} (x{item.qty})
                </span>
                <span className="font-medium">
                  ₹{(parseFloat(item.Price || item.price || 0) * item.qty).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-2 text-right font-bold">
            Total: ₹{total.toLocaleString()}
          </div>
        </div>
      )}
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
