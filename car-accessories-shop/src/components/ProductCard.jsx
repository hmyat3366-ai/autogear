import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const isWished = isInWishlist(product.id);

  return (
    <div className={`product-card ${!product.inStock ? 'out-of-stock' : ''}`}>
      <button 
        className={`wishlist-btn ${isWished ? 'active' : ''}`}
        onClick={() => toggleWishlist(product)}
        title={isWished ? "Remove from Wishlist" : "Add to Wishlist"}
      >
        {isWished ? '❤️' : '🤍'}
      </button>
      
      {product.badge && (
        <span className={`product-badge ${product.badge === 'Sold Out' ? 'badge-soldout' : ''}`}>
          {product.badge}
        </span>
      )}
      
      <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div className="product-img-placeholder">
          <span className="product-emoji">{product.img}</span>
        </div>
        <div className="product-category">{product.category}</div>
        <h3 className="product-name" style={{ transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = 'var(--primary)'} onMouseOut={(e) => e.target.style.color = 'inherit'}>
          {product.name}
        </h3>
        <p className="product-desc">{product.description}</p>
        <div className="product-rating">
          <span className="stars">{'★'.repeat(Math.floor(product.rating))}{'☆'.repeat(5 - Math.floor(product.rating))}</span>
          <span className="rating-text">{product.rating} ({product.reviews})</span>
        </div>
      </Link>

      <div className="product-footer">
        <span className="product-price">${product.price}</span>
        <button
          className="add-to-cart"
          disabled={!product.inStock}
          onClick={() => product.inStock && addToCart(product)}
        >
          {product.inStock ? 'Add to Cart' : 'Sold Out'}
        </button>
      </div>
    </div>
  );
}
