import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../context/ProductContext';

export default function Home() {
  const { products } = useProducts();
  const featured = products.filter(p => p.badge === 'Best Seller' || p.badge === 'Premium').slice(0, 4);
  const popular = products.filter(p => p.rating >= 4.7).slice(0, 4);

  const [currentSlide, setCurrentSlide] = useState(0);
  const promos = [
    {
      id: 1,
      image: import.meta.env.BASE_URL + 'images/promo1.png',
      badge: '⚡ FLASH SALE ACTIVE',
      title: 'Mega Sale!',
      subtitle: 'Up to 50% OFF on Premium Interiors',
      desc: 'Grab the best deals on premium car accessories. Upgrade your ride today with our exclusive discounts. Limited time offer!',
    },
    {
      id: 2,
      image: import.meta.env.BASE_URL + 'images/promo2.png',
      badge: '🔥 HOT DEALS',
      title: 'Performance',
      subtitle: 'Wheels & Brakes - 30% OFF',
      desc: 'Enhance your driving dynamics with top-tier wheels and braking systems. Shop now and save big!',
    },
    {
      id: 3,
      image: import.meta.env.BASE_URL + 'images/promo3.png',
      badge: '💡 NEW ARRIVALS',
      title: 'Light Up',
      subtitle: 'Aggressive LED Kits',
      desc: 'Transform the look of your vehicle with our new aggressive LED lighting kits. Stand out in the dark.',
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % promos.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [promos.length]);

  return (
    <>
      {/* Hero Carousel */}
      <header className="hero-carousel">
        {promos.map((promo, index) => (
          <div 
            key={promo.id} 
            className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
            style={{ backgroundImage: `url(${promo.image})` }}
          >
            <div className="carousel-overlay"></div>
            <div className="hero-content">
              <div className="hero-badge" style={{ backgroundColor: 'var(--primary)', color: '#fff' }}>{promo.badge}</div>
              <h1 className="hero-title">
                {promo.title}<br />
                <span className="text-gradient">{promo.subtitle}</span>
              </h1>
              <p className="hero-subtitle">
                {promo.desc}
              </p>
              <div className="hero-actions">
                <Link to="/shop" className="btn-primary">Shop The Sale →</Link>
                <Link to="/categories" className="btn-secondary">View All Deals</Link>
              </div>
            </div>
          </div>
        ))}
        
        <div className="carousel-indicators">
          {promos.map((_, index) => (
            <button 
              key={index} 
              className={`indicator ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </header>

      {/* Categories Preview */}
      <section className="categories-preview">
        <h2 className="section-title">Shop by Category</h2>
        <div className="category-cards">
          {[
            { name: 'Interior', icon: '💺', count: 3 },
            { name: 'Exterior', icon: '🚗', count: 4 },
            { name: 'Lighting', icon: '💡', count: 3 },
            { name: 'Performance', icon: '🔧', count: 3 },
            { name: 'Electronics', icon: '📱', count: 3 },
          ].map(cat => (
            <Link to={`/shop?category=${cat.name}`} key={cat.name} className="category-card">
              <span className="category-icon">{cat.icon}</span>
              <h3>{cat.name}</h3>
              <p>{cat.count} Products</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="products-section">
        <div className="section-header">
          <h2 className="section-title">Featured Products</h2>
          <Link to="/shop" className="view-all">View All →</Link>
        </div>
        <div className="product-grid">
          {featured.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Banner */}
      <section className="promo-banner">
        <div className="promo-content">
          <h2>🔥 Summer Sale — Up to 30% Off</h2>
          <p>Limited time offer on all exterior accessories. Don't miss out!</p>
          <Link to="/shop?category=Exterior" className="btn-primary">Shop Now</Link>
        </div>
      </section>

      {/* Popular Products */}
      <section className="products-section">
        <div className="section-header">
          <h2 className="section-title">Top Rated</h2>
          <Link to="/shop" className="view-all">View All →</Link>
        </div>
        <div className="product-grid">
          {popular.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </>
  );
}
