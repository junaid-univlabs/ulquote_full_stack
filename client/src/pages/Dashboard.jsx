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

  // Fetch from Google Sheets
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

  // Add to cart with normalized object
  const handleAdd = (product, qty) => {
    setCart(prev => {
      const existing = prev.find(item => item.sku === product.sku);
      if (existing) {
        return prev.map(item =>
          item.sku === product.sku ? { ...item, qty: item.qty + qty } : item
        );
      }
      return [...prev, { ...product, qty }];
    });
  };

  // Totals
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const gstRate = 0.05; // 5% GST
  const gstAmount = subtotal * gstRate;
  const grandTotal = subtotal + gstAmount;

  return (
    <div className="dash-section flex gap-6">
      {/* LEFT: Products */}
      <div className="flex-1">
        <h2>Products</h2>
        <p className="muted">Browse products by category.</p>

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

        <div className="product-list mt-4">
          {activeCategory ? (
            <ProductList products={filteredProducts} onAdd={handleAdd} />
          ) : (
            <div className="p-4 text-gray-600">
              Select a category to view products.
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: Sticky Quote Cart */}
      <aside className="quote-cart w-80 p-4 border rounded bg-white shadow">
        <h3 className="font-semibold mb-2">Quote Cart</h3>
        {cart.length === 0 ? (
          <p className="text-gray-500">No items yet.</p>
        ) : (
          <>
            <ul>
              {cart.map(item => (
                <li
                  key={item.sku}
                  className="flex justify-between py-1 border-b text-sm"
                >
                  <span>{item.name} (x{item.qty})</span>
                  <span>₹{(item.price * item.qty).toLocaleString()}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 text-right text-sm">
              <div>Subtotal: ₹{subtotal.toLocaleString()}</div>
              <div>GST (5%): ₹{gstAmount.toLocaleString()}</div>
              <div className="font-bold text-base mt-1">
                Total: ₹{grandTotal.toLocaleString()}
              </div>
            </div>
          </>
        )}
      </aside>
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
      <aside className="dash-sidebar">
        <div className="dash-brand">ULQuote</div>
        <nav className="dash-nav">
          <Link to="">Home</Link>
          <Link to="products">Products</Link>
          <Link to="quotes">Quotes</Link>
        </nav>
      </aside>

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
