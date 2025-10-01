// src/components/ProductList.jsx
import React, { useState } from 'react';

/**
 * ProductList
 * props:
 *  - products: array of product objects
 *  - onAdd: function(product, qty) => void
 */
export default function ProductList({ products = [], onAdd = () => {} }) {
  if (!Array.isArray(products) || products.length === 0) {
    return <div className="p-4 text-gray-600">No products in this category.</div>;
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {products.map((raw, i) => {
        // --- Normalize fields (handles Google Sheet variations) ---
        const title = raw.name || raw.Name || 'Untitled';
        const desc = raw.description || raw.Description || '';
        const priceRaw = raw.price || raw.Price || '0';
        const price = (() => {
          const n = parseFloat(String(priceRaw).replace(/[^0-9.-]+/g, ''));
          return Number.isFinite(n) ? n : 0;
        })();
        const sku = raw.sku || raw.SKU || `${i}-${title}`;
        const avail = raw.availability || raw.Availability || 'Unknown';
        const img =
          raw.imageUrl || raw['image url'] || raw['Image URL'] || raw.Image || '';

        // Local state for quantity (per product card)
        const [qty, setQty] = useState(1);

        // Normalized object for cart
        const normalized = {
          sku,
          name: title,
          description: desc,
          price,
          availability: avail,
          imageUrl: img,
        };

        return (
          <div
            key={sku}
            className="w-72 flex-shrink-0 border rounded-lg overflow-hidden shadow-sm bg-white hover:shadow-md transition"
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
                    value={qty}
                    onChange={(e) =>
                      setQty(Math.max(1, Number(e.target.value || 1)))
                    }
                    type="number"
                    min={1}
                    className="w-16 px-2 py-1 border rounded"
                  />
                  <button
                    onClick={() => {
                      if (qty > 0) {
                        onAdd(normalized, qty);
                        setQty(1); // reset after adding
                      }
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
