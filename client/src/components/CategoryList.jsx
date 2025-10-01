// src/components/CategoryList.jsx
import React from 'react';

export default function CategoryList({ categories = [], active = '', onSelect = () => {} }) {
  if (!Array.isArray(categories) || categories.length === 0) {
    return <div className="p-3 text-sm text-gray-600">No categories</div>;
  }

  return (
    <div className="space-y-2" role="navigation" aria-label="Categories">
      {categories.map(cat => {
        const isActive = (cat || '').trim() === (active || '').trim();
        return (
          <button
            key={cat}
            type="button"
            onClick={() => onSelect(cat)}
            className={
              'w-full text-left px-3 py-2 rounded focus:outline-none transition ' +
              (isActive
                ? 'bg-sky-600 text-white'
                : 'bg-white hover:bg-sky-50 text-gray-800 border border-transparent hover:border-gray-100')
            }
            aria-current={isActive ? 'true' : 'false'}
            aria-label={`Show ${cat}`}
          >
            <div className="font-medium">{cat}</div>
          </button>
        );
      })}
    </div>
  );
}
