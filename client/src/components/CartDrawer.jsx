// src/components/CartDrawer.jsx
import React from 'react';

/**
 * CartDrawer
 * props:
 *  - open (bool)
 *  - onClose () => void
 *  - items: [{ sku, name, price, qty, meta }]
 *  - onUpdateQty(sku, qty)
 *  - onRemove(sku)
 *  - totals: { subtotal, tax, total }
 *  - onClear()
 *  - onSave(meta) => Promise
 */
export default function CartDrawer({
  open = false,
  onClose = () => {},
  items = [],
  onUpdateQty = () => {},
  onRemove = () => {},
  totals = { subtotal: 0, tax: 0, total: 0 },
  onClear = () => {},
  onSave = async () => {}
}) {
  const handleSave = async () => {
    try {
      await onSave({ note: 'Saved from CartDrawer' });
      alert('Quote saved');
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to save quote');
    }
  };

  return (
    <div
      aria-hidden={!open}
      style={{
        position: 'fixed',
        right: open ? 0 : '-420px',
        top: 0,
        height: '100vh',
        width: 420,
        background: '#fff',
        boxShadow: '-8px 0 24px rgba(2,6,23,0.12)',
        transition: 'right 240ms ease',
        zIndex: 60,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div style={{ padding: 16, borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontWeight: 700 }}>Quotation Cart</div>
          <div style={{ fontSize: 12, color: '#666' }}>{items.length} item(s)</div>
        </div>
        <div>
          <button onClick={onClose} aria-label="Close cart" style={{ background: 'transparent', border: 'none', fontSize: 18, cursor: 'pointer' }}>✕</button>
        </div>
      </div>

      <div style={{ padding: 12, overflowY: 'auto', flex: 1 }}>
        {items.length === 0 ? (
          <div className="p-4 text-gray-600">Cart is empty</div>
        ) : (
          items.map(it => (
            <div key={it.sku} style={{ display: 'flex', gap: 12, padding: 8, borderBottom: '1px solid #f1f5f9', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>{it.name}</div>
                <div style={{ fontSize: 13, color: '#666' }}>₹{Number(it.price).toLocaleString()} each</div>
                <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input
                    type="number"
                    min={1}
                    value={it.qty}
                    onChange={e => onUpdateQty(it.sku, Math.max(1, Number(e.target.value)))}
                    style={{ width: 72, padding: 6, border: '1px solid #e6e9ee', borderRadius: 6 }}
                  />
                  <button onClick={() => onRemove(it.sku)} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #e6e9ee', background: 'transparent' }}>
                    Remove
                  </button>
                </div>
              </div>

              <div style={{ textAlign: 'right', minWidth: 90 }}>
                <div style={{ fontWeight: 700 }}>₹{(it.price * it.qty).toLocaleString()}</div>
                <div style={{ fontSize: 12, color: '#888' }}>SKU: {it.sku}</div>
              </div>
            </div>
          ))
        )}
      </div>

      <div style={{ padding: 12, borderTop: '1px solid #eee' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <div className="text-sm text-gray-600">Subtotal</div>
          <div className="font-semibold">₹{Number(totals.subtotal || 0).toLocaleString()}</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <div className="text-sm text-gray-600">Tax</div>
          <div className="font-semibold">₹{Number(totals.tax || 0).toLocaleString()}</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <div className="text-sm text-gray-600">Total</div>
          <div className="font-bold">₹{Number(totals.total || totals.subtotal || 0).toLocaleString()}</div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={handleSave} className="px-3 py-2 bg-sky-600 text-white rounded" style={{ flex: 1 }}>
            Save Quote
          </button>
          <button onClick={onClear} className="px-3 py-2 border rounded" style={{ width: 110 }}>
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
