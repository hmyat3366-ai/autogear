import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';

export default function Checkout() {
  const { items, cartTotal, deliveryMethod, setDeliveryMethod, clearCart } = useCart();
  const { addOrder } = useOrders();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [form, setForm] = useState({
    fullName: '', phone: '', email: '',
    address: '', city: '', zipCode: '',
    cardNumber: '', expiry: '', cvv: '',
    notes: '',
  });
  const [errors, setErrors] = useState({});

  const shippingCost = deliveryMethod === 'delivery' ? 15 : 0;
  const total = cartTotal + shippingCost;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = 'Required';
    if (!form.phone.trim()) errs.phone = 'Required';
    if (!form.email.trim()) errs.email = 'Required';
    if (deliveryMethod === 'delivery') {
      if (!form.address.trim()) errs.address = 'Required';
      if (!form.city.trim()) errs.city = 'Required';
    }
    if (paymentMethod === 'card') {
      if (!form.cardNumber.trim()) errs.cardNumber = 'Required';
      if (!form.expiry.trim()) errs.expiry = 'Required';
      if (!form.cvv.trim()) errs.cvv = 'Required';
    }
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const order = {
      items: [...items],
      totalAmount: total,
      deliveryMethod,
      paymentMethod,
      shippingAddress: form,
      status: 'Processing',
      createdAt: new Date().toISOString(),
      estimatedDelivery: deliveryMethod === 'delivery'
        ? new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()
        : 'Ready in 2 hours',
      trackingSteps: [
        { step: 'Order Confirmed', done: true, time: new Date().toLocaleString() },
        { step: 'Processing', done: false, time: '' },
        { step: deliveryMethod === 'delivery' ? 'Shipped' : 'Ready for Pickup', done: false, time: '' },
        { step: deliveryMethod === 'delivery' ? 'Delivered' : 'Picked Up', done: false, time: '' },
      ],
    };

    addOrder(order);
    clearCart();
    navigate('/orders');
  };

  if (items.length === 0) {
    return (
      <div className="checkout-page">
        <div className="cart-empty">
          <span className="cart-empty-icon">🛒</span>
          <p>Your cart is empty</p>
          <Link to="/shop" className="btn-primary">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="shop-header">
        <h1>Checkout</h1>
        <p>Complete your order</p>
      </div>

      <form className="checkout-grid" onSubmit={handleSubmit}>
        <div className="checkout-form-section">
          {/* Delivery Method */}
          <div className="checkout-card">
            <h3>📦 Delivery Method</h3>
            <div className="delivery-options">
              <label className={`delivery-option ${deliveryMethod === 'delivery' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="delivery"
                  checked={deliveryMethod === 'delivery'}
                  onChange={() => setDeliveryMethod('delivery')}
                />
                <div>
                  <strong>🚚 Home Delivery</strong>
                  <p>Delivered to your doorstep in 3-5 business days</p>
                  <span className="delivery-price">$15.00</span>
                </div>
              </label>
              <label className={`delivery-option ${deliveryMethod === 'takeaway' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="delivery"
                  checked={deliveryMethod === 'takeaway'}
                  onChange={() => setDeliveryMethod('takeaway')}
                />
                <div>
                  <strong>🏪 Store Pickup (Take Away)</strong>
                  <p>Pick up at our store — ready in 2 hours</p>
                  <span className="delivery-price free">FREE</span>
                </div>
              </label>
            </div>
          </div>

          {/* Customer Info */}
          <div className="checkout-card">
            <h3>👤 Customer Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Full Name</label>
                <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="John Doe" className={errors.fullName ? 'error' : ''} />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input name="phone" value={form.phone} onChange={handleChange} placeholder="+1 555 123 4567" className={errors.phone ? 'error' : ''} />
              </div>
            </div>
            <div className="form-group">
              <label>Email</label>
              <input name="email" value={form.email} onChange={handleChange} placeholder="john@example.com" className={errors.email ? 'error' : ''} />
            </div>
          </div>

          {/* Address - only for delivery */}
          {deliveryMethod === 'delivery' && (
            <div className="checkout-card">
              <h3>📍 Delivery Address</h3>
              <div className="form-group">
                <label>Street Address</label>
                <input name="address" value={form.address} onChange={handleChange} placeholder="123 Main Street" className={errors.address ? 'error' : ''} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input name="city" value={form.city} onChange={handleChange} placeholder="Motor City" className={errors.city ? 'error' : ''} />
                </div>
                <div className="form-group">
                  <label>ZIP Code</label>
                  <input name="zipCode" value={form.zipCode} onChange={handleChange} placeholder="12345" />
                </div>
              </div>
            </div>
          )}

          {/* Take Away Info */}
          {deliveryMethod === 'takeaway' && (
            <div className="checkout-card">
              <h3>🏪 Pickup Location</h3>
              <div className="pickup-info">
                <p><strong>AutoGear Store</strong></p>
                <p>📍 123 Speed Street, Motor City</p>
                <p>🕐 Mon-Sat: 9AM - 9PM</p>
                <p>📞 +1 (555) 123-4567</p>
                <div className="pickup-note">
                  ⚡ Your order will be ready for pickup within 2 hours of confirmation.
                </div>
              </div>
            </div>
          )}

          {/* Payment */}
          <div className="checkout-card">
            <h3>💳 Payment</h3>
            <div className="delivery-options" style={{ marginBottom: '1rem' }}>
              <label className={`delivery-option ${paymentMethod === 'card' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'card'}
                  onChange={() => setPaymentMethod('card')}
                />
                <div>
                  <strong>Credit / Debit Card</strong>
                </div>
              </label>
              <label className={`delivery-option ${paymentMethod === 'cod' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                />
                <div>
                  <strong>Cash on Delivery (COD)</strong>
                </div>
              </label>
            </div>

            {paymentMethod === 'card' && (
              <>
                <div className="form-group">
                  <label>Card Number</label>
                  <input name="cardNumber" value={form.cardNumber} onChange={handleChange} placeholder="4242 4242 4242 4242" className={errors.cardNumber ? 'error' : ''} />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Expiry</label>
                    <input name="expiry" value={form.expiry} onChange={handleChange} placeholder="MM/YY" className={errors.expiry ? 'error' : ''} />
                  </div>
                  <div className="form-group">
                    <label>CVV</label>
                    <input name="cvv" value={form.cvv} onChange={handleChange} placeholder="123" className={errors.cvv ? 'error' : ''} />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Notes */}
          <div className="checkout-card">
            <h3>📝 Order Notes (Optional)</h3>
            <div className="form-group">
              <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Any special instructions..." rows="4" style={{ resize: 'vertical' }} />
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="order-summary">
          <div className="checkout-card sticky">
            <h3>🧾 Order Summary</h3>
            <div className="summary-items">
              {items.map(item => (
                <div key={item.id} className="summary-item">
                  <span>{item.img} {item.name} × {item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="summary-divider" />
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>{shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <button type="submit" className="btn-primary full-width">
              Place Order — ${total.toFixed(2)}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
