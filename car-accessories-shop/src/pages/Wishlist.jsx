import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';

export default function Wishlist() {
  const { wishlist } = useWishlist();

  return (
    <div className="wishlist-page" style={{ padding: '4rem 5%', minHeight: '80vh' }}>
      <div className="shop-header">
        <h1>My Wishlist</h1>
        <p>Your favorite items saved for later.</p>
      </div>

      {wishlist.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>💔</div>
          <p style={{ color: 'var(--text-muted)' }}>Your wishlist is empty.</p>
          <Link to="/shop" className="btn-primary" style={{ marginTop: '1rem' }}>Explore Products</Link>
        </div>
      ) : (
        <div className="product-grid">
          {wishlist.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
