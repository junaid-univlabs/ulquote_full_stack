import React, { useState, useEffect } from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import '../styles/landing.css';

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
  const [showCart, setShowCart] = useState(false);

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

  // Remove from cart
  const handleRemove = (sku) => {
    setCart(prev => prev.filter(item => item.sku !== sku));
  };

  // Totals
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const gstRate = 0.05; // 5% GST
  const gstAmount = subtotal * gstRate;
  const grandTotal = subtotal + gstAmount;

  // Generate PDF Quote
  const generatePDF = () => {
    const printContent = `
      <html>
        <head>
          <title>Quote - UnivLabs</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; }
            h1 { color: #2b6ef6; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
            th { background-color: #2b6ef6; color: white; }
            .total { font-weight: bold; text-align: right; }
          </style>
        </head>
        <body>
          <h1>UnivLabs Quotation</h1>
          <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${cart.map(item => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.sku}</td>
                  <td>${item.qty}</td>
                  <td>₹${item.price.toLocaleString()}</td>
                  <td>₹${(item.price * item.qty).toLocaleString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="total">
            <p>Subtotal: ₹${subtotal.toLocaleString()}</p>
            <p>GST (5%): ₹${gstAmount.toLocaleString()}</p>
            <p><strong>Grand Total: ₹${grandTotal.toLocaleString()}</strong></p>
          </div>
        </body>
      </html>
    `;
    
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 64px)', position: 'relative' }}>
      {/* LEFT: Vertical Category Navbar */}
      <aside style={{
        width: '220px',
        background: '#fff',
        borderRight: '1px solid #eef2f5',
        padding: '20px',
        overflowY: 'auto'
      }}>
        <h3 style={{ marginTop: 0, marginBottom: '16px', fontSize: '18px' }}>Categories</h3>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {categories.map(cat => (
            <div
              key={cat}
              onMouseEnter={() => setActiveCategory(cat)}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '12px 16px',
                background: activeCategory === cat ? '#2b6ef6' : '#f5f7fa',
                color: activeCategory === cat ? '#fff' : '#0b1721',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontWeight: activeCategory === cat ? '600' : '500'
              }}
            >
              {cat}
            </div>
          ))}
        </nav>
      </aside>

      {/* CENTER: Products Display */}
      <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
        {activeCategory ? (
          <>
            <h2 style={{ marginTop: 0, marginBottom: '20px' }}>{activeCategory}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
              {filteredProducts.map((product, idx) => {
                const name = product.name || product.Name || 'Untitled';
                const desc = product.description || product.Description || '';
                const priceRaw = product.price || product.Price || '0';
                const price = (() => {
                  const n = parseFloat(String(priceRaw).replace(/[^0-9.-]+/g, ''));
                  return Number.isFinite(n) ? n : 0;
                })();
                const sku = product.sku || product.SKU || `${idx}-${name}`;
                const avail = product.availability || product.Availability || 'Unknown';

                return (
                  <div key={sku} style={{
                    background: '#fff',
                    border: '1px solid #eef2f5',
                    borderRadius: '12px',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    transition: 'box-shadow 0.2s'
                  }}>
                    <div>
                      <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600' }}>{name}</h3>
                      {desc && <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#666' }}>{desc}</p>}
                      <div style={{ fontSize: '12px', color: '#999' }}>SKU: {sku}</div>
                      <div style={{ 
                        fontSize: '20px', 
                        fontWeight: '700', 
                        color: '#2b6ef6',
                        margin: '8px 0' 
                      }}>
                        ₹{price.toLocaleString()}
                      </div>
                      <div style={{
                        display: 'inline-block',
                        padding: '4px 8px',
                        background: String(avail).toLowerCase().includes('in') ? '#e6f7ed' : '#fff3e0',
                        color: String(avail).toLowerCase().includes('in') ? '#27ae60' : '#f39c12',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>
                        {avail}
                      </div>
                    </div>
                    <button
                      onClick={() => handleAdd({ sku, name, description: desc, price, availability: avail }, 1)}
                      style={{
                        background: '#2b6ef6',
                        color: '#fff',
                        border: 'none',
                        padding: '10px 16px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '14px',
                        transition: 'background 0.2s'
                      }}
                      onMouseOver={(e) => e.target.style.background = '#235bd6'}
                      onMouseOut={(e) => e.target.style.background = '#2b6ef6'}
                    >
                      Add to Quote
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '100%',
            color: '#999',
            fontSize: '16px'
          }}>
            Select a category from the left to view products
          </div>
        )}
      </div>

      {/* FLOATING CART - Upper Right */}
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 1000
      }}>
        <button
          onClick={() => setShowCart(!showCart)}
          style={{
            background: '#2b6ef6',
            color: '#fff',
            border: 'none',
            padding: '12px 20px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '14px',
            boxShadow: '0 4px 12px rgba(43,110,246,0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          🛒 Cart ({cart.length})
        </button>

        {showCart && (
          <div style={{
            position: 'absolute',
            top: '60px',
            right: '0',
            width: '360px',
            maxHeight: '500px',
            background: '#fff',
            border: '1px solid #eef2f5',
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            padding: '20px',
            overflowY: 'auto'
          }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px' }}>Quote Cart</h3>
            {cart.length === 0 ? (
              <p style={{ color: '#999', textAlign: 'center', padding: '20px 0' }}>No items yet</p>
            ) : (
              <>
                <div style={{ marginBottom: '16px' }}>
                  {cart.map(item => (
                    <div key={item.sku} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px 0',
                      borderBottom: '1px solid #eef2f5'
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '600', fontSize: '14px' }}>{item.name}</div>
                        <div style={{ fontSize: '12px', color: '#999' }}>Qty: {item.qty}</div>
                      </div>
                      <div style={{ fontWeight: '600', marginRight: '12px' }}>
                        ₹{(item.price * item.qty).toLocaleString()}
                      </div>
                      <button
                        onClick={() => handleRemove(item.sku)}
                        style={{
                          background: '#ff4757',
                          color: '#fff',
                          border: 'none',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
                <div style={{ 
                  borderTop: '2px solid #eef2f5', 
                  paddingTop: '16px',
                  fontSize: '14px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span>Subtotal:</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span>GST (5%):</span>
                    <span>₹{gstAmount.toLocaleString()}</span>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    fontWeight: '700',
                    fontSize: '16px',
                    marginTop: '12px'
                  }}>
                    <span>Total:</span>
                    <span style={{ color: '#2b6ef6' }}>₹{grandTotal.toLocaleString()}</span>
                  </div>
                </div>
                <button
                  onClick={generatePDF}
                  style={{
                    width: '100%',
                    background: '#27ae60',
                    color: '#fff',
                    border: 'none',
                    padding: '12px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '14px',
                    marginTop: '16px'
                  }}
                >
                  Generate PDF Quote
                </button>
              </>
            )}
          </div>
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
