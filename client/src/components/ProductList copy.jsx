// src/components/ProductList.jsx
import React from 'react';

/**
 * ProductList
 * props:
 *  - products: array of normalized product objects
 *  - onAdd: function(product, qty) => void
 */
export default function ProductList({ products = [], onAdd = () => {} }) {
  if (!products || products.length === 0) {
    return <div className="p-4 text-gray-600">No products in this category.</div>;
  }

  return (

    
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((p, i) => {
        // --- Normalize fields (handles Google Sheet variations) ---
        const title = p.name || p.Name || 'Untitled';
        const desc = p.description || p.Description || '';
        const priceRaw = p.price || p.Price || '0';
        const price = (() => {
          const n = parseFloat(String(priceRaw).replace(/[^0-9.-]+/g, ''));
          return Number.isFinite(n) ? n : 0;
        })();
        const sku = p.sku || p.SKU || `${i}-${title}`;
        const avail = p.availability || p.Availability || 'Unknown';
        const img =
          p.imageUrl || p['image url'] || p['Image URL'] || p.Image || '';

        return (
          <div
            key={sku}
            className="border rounded-lg overflow-hidden shadow-sm bg-white hover:shadow-md transition"
          >
            {/* Image */}
            <div className="h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
              {img ? (
                <img
                  src={img}
                  alt={title}
                  className="object-contain h-full w-full"
                />
              ) : (
                <div className="text-gray-400">No image</div>
              )}
            </div>

            {/* Details */}
            <div className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-lg leading-tight">
                    {title}
                  </h3>
                  {desc && (
                    <p className="text-sm text-gray-600 mt-1">{desc}</p>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">SKU: {sku}</div>
                  <div className="text-lg font-bold mt-2">
                    ₹{price.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Availability + Add to cart */}
              <div className="mt-3 flex items-center justify-between">
                <div
                  className={
                    'px-2 py-1 rounded text-xs font-medium ' +
                    (String(avail).toLowerCase().includes('in')
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800')
                  }
                >
                  {avail}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    aria-label={`Quantity for ${title}`}
                    defaultValue={1}
                    type="number"
                    min={1}
                    className="w-16 px-2 py-1 border rounded"
                    id={`qty-${sku}`}
                  />
                  <button
                    onClick={() => {
                      const el = document.getElementById(`qty-${sku}`);
                      const qty = Math.max(1, Number(el?.value || 1));
                      onAdd({ ...p, sku, price }, qty);
                    }}
                    className="px-3 py-2 bg-sky-600 text-white rounded hover:bg-sky-700"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
