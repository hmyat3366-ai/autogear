import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import { ProductProvider } from './context/ProductContext';
import { OrderProvider } from './context/OrderContext';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import CartSidebar from './components/CartSidebar';
import ChatWidget from './components/ChatWidget';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Categories from './pages/Categories';
import Contact from './pages/Contact';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminChat from './pages/AdminChat';
import AdminProducts from './pages/AdminProducts';
import AdminOrders from './pages/AdminOrders';
import AdminCustomers from './pages/AdminCustomers';
import Wishlist from './pages/Wishlist';
import ProductDetail from './pages/ProductDetail';
import './index.css';

function AppContent() {
  const [cartOpen, setCartOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Enforce login for all pages except login pages
  if (!user && location.pathname !== '/login' && location.pathname !== '/admin-login') {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Toaster position="top-center" />
      
      {!isAdminRoute && (
        <>
          <Navbar onCartOpen={() => setCartOpen(true)} />
          <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />
        </>
      )}

      <main style={{ padding: isAdminRoute ? '0' : undefined }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/chat" element={<AdminChat />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/customers" element={<AdminCustomers />} />
        </Routes>
      </main>

      {!isAdminRoute && (
        <>
          <Footer />
          <ChatWidget />
        </>
      )}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <OrderProvider>
          <WishlistProvider>
            <CartProvider>
              <BrowserRouter basename={import.meta.env.BASE_URL}>
                <AppContent />
              </BrowserRouter>
            </CartProvider>
          </WishlistProvider>
        </OrderProvider>
      </ProductProvider>
    </AuthProvider>
  );
}

export default App;
