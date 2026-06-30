import React from 'react';
import { Link } from 'react-router-dom';
import products from '../data/products';

const categoryDetails = [
  { name: 'Interior', icon: '💺', desc: 'Seats, steering wheels, floor mats, and more to upgrade your cabin.', color: '#e53935' },
  { name: 'Exterior', icon: '🚗', desc: 'Spoilers, body kits, mirror covers, and wheels to style your ride.', color: '#1e88e5' },
  { name: 'Lighting', icon: '💡', desc: 'LED headlights, underglow kits, and ambient interior lighting.', color: '#fdd835' },
  { name: 'Performance', icon: '🔧', desc: 'Air intakes, exhaust systems, and turbo controllers for more power.', color: '#43a047' },
  { name: 'Electronics', icon: '📱', desc: 'Dash cams, speakers, phone mounts, and smart gadgets.', color: '#8e24aa' },
];

export default function Categories() {
  return (
    <div className="categories-page">
      <div className="shop-header">
        <h1>All Categories</h1>
        <p>Browse our collection by category</p>
      </div>

      <div className="categories-grid">
        {categoryDetails.map(cat => {
          const count = products.filter(p => p.category === cat.name).length;
          const catProducts = products.filter(p => p.category === cat.name).slice(0, 3);

          return (
            <div key={cat.name} className="category-detail-card">
              <div className="category-detail-header" style={{ borderColor: cat.color }}>
                <span className="category-detail-icon">{cat.icon}</span>
                <div>
                  <h2>{cat.name}</h2>
                  <p className="category-detail-count">{count} products</p>
                </div>
              </div>
              <p className="category-detail-desc">{cat.desc}</p>
              <div className="category-products-preview">
                {catProducts.map(p => (
                  <div key={p.id} className="mini-product">
                    <span>{p.img}</span>
                    <div>
                      <div className="mini-product-name">{p.name}</div>
                      <div className="mini-product-price">${p.price}</div>
                    </div>
                  </div>
                ))}
              </div>
              <Link to={`/shop?category=${cat.name}`} className="category-detail-link" style={{ color: cat.color }}>
                Shop {cat.name} →
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
