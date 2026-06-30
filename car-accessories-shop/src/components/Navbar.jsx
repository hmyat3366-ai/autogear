import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

export default function Navbar({ onCartOpen }) {
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const { wishlist } = useWishlist();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <Link to="/" className="brand">Auto<span>Gear</span></Link>

      <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
        {mobileOpen ? '✕' : '☰'}
      </button>

      <div className={`nav-links ${mobileOpen ? 'open' : ''}`}>
        {user?.role === 'admin' ? (
          <>
            <Link to="/admin" className={isActive('/admin') ? 'active' : ''} onClick={() => setMobileOpen(false)}>Dashboard</Link>
          </>
        ) : (
          <>
            <Link to="/" className={isActive('/') ? 'active' : ''} onClick={() => setMobileOpen(false)}>Home</Link>
            <Link to="/shop" className={isActive('/shop') ? 'active' : ''} onClick={() => setMobileOpen(false)}>Shop</Link>
            <Link to="/categories" className={isActive('/categories') ? 'active' : ''} onClick={() => setMobileOpen(false)}>Categories</Link>
            <Link to="/contact" className={isActive('/contact') ? 'active' : ''} onClick={() => setMobileOpen(false)}>Contact</Link>
            {user && <Link to="/orders" className={isActive('/orders') ? 'active' : ''} onClick={() => setMobileOpen(false)}>My Orders</Link>}
            <Link to="/wishlist" className={isActive('/wishlist') ? 'active' : ''} onClick={() => setMobileOpen(false)}>
              Wishlist {wishlist.length > 0 && `(${wishlist.length})`}
            </Link>
          </>
        )}
      </div>

      <div className="nav-actions">
        {user ? (
          <button className="role-toggle-btn" onClick={logout} title="Logout">
            Logout ({user.name})
          </button>
        ) : (
          <Link to="/login" className="role-toggle-btn" style={{ textDecoration: 'none' }}>
            Login
          </Link>
        )}

        {user?.role !== 'admin' && (
          <button className="cart-btn" onClick={onCartOpen}>
            🛒 Cart {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
        )}
      </div>
    </nav>
  );
}
