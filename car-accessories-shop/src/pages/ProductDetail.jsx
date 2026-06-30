import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products } = useProducts();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const product = products.find(p => p.id === parseInt(id));

  if (!product) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 2rem' }}>
        <h2>Product Not Found</h2>
        <p>The product you are looking for does not exist.</p>
        <Link to="/shop" className="btn-primary" style={{ marginTop: '1rem' }}>Back to Shop</Link>
      </div>
    );
  }

  const isWished = isInWishlist(product.id);

  return (
    <div className="product-detail-page" style={{ padding: '3rem 5%', maxWidth: '1200px', margin: '0 auto', minHeight: '80vh' }}>
      <button onClick={() => navigate(-1)} className="btn-secondary" style={{ marginBottom: '2rem', padding: '0.5rem 1rem' }}>
        ← Back
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
        
        {/* Left Side: Image */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '400px', position: 'relative', overflow: 'hidden' }}>
          {product.badge && (
            <span className="product-badge" style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 10 }}>
              {product.badge}
            </span>
          )}
          {product.img.startsWith('http') ? (
            <img src={product.img} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span style={{ fontSize: '8rem' }}>{product.img}</span>
          )}
        </div>

        {/* Right Side: Details */}
        <div>
          <div style={{ fontSize: '0.9rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            {product.category}
          </div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', lineHeight: '1.2' }}>{product.name}</h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fff' }}>${product.price}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ color: '#fdd835' }}>{'★'.repeat(Math.floor(product.rating))}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>({product.reviews} reviews)</span>
            </div>
          </div>

          <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: '1.6', marginBottom: '2rem', fontSize: '1.1rem' }}>
            {product.description}
          </p>

          <div style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '1.5rem 0', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Availability:</span>
              <span style={{ color: product.inStock ? '#4caf50' : '#f44336', fontWeight: 'bold' }}>
                {product.inStock ? 'In Stock - Ready to Ship' : 'Out of Stock'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>SKU:</span>
              <span>AG-{product.id.toString().padStart(4, '0')}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              className="btn-primary" 
              style={{ flex: 1, padding: '1rem', fontSize: '1.1rem' }}
              disabled={!product.inStock}
              onClick={() => addToCart(product)}
            >
              {product.inStock ? 'Add to Cart 🛒' : 'Sold Out 🚫'}
            </button>
            <button 
              className={`btn-secondary ${isWished ? 'active-wish' : ''}`}
              style={{ width: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', borderColor: isWished ? 'var(--primary)' : 'var(--border)', background: isWished ? 'rgba(229,57,53,0.1)' : 'transparent' }}
              onClick={() => toggleWishlist(product)}
              title="Toggle Wishlist"
            >
              {isWished ? '❤️' : '🤍'}
            </button>
          </div>

          <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
            <h3 style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>🛡️ AutoGear Guarantee</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>100% Secure payment. 30-day return policy on all items. Free shipping on orders over $150.</p>
          </div>

        </div>
      </div>
    </div>
  );
}
