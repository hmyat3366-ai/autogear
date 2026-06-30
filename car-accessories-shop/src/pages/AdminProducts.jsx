import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';
import { Link } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
export default function AdminProducts() {
  const { user } = useAuth();
  const { products, addProduct, deleteProduct, updateProduct } = useProducts();
  const [isAdding, setIsAdding] = useState(false);
  const [newProd, setNewProd] = useState({ name: '', price: '', category: 'Interior', stock: true });

  if (!user || user.role !== 'admin') {
    return <div style={{ textAlign: 'center', padding: '4rem' }}><h2>Access Denied</h2></div>;
  }

  const handleAdd = (e) => {
    e.preventDefault();
    addProduct({
      name: newProd.name,
      price: parseFloat(newProd.price),
      category: newProd.category,
      inStock: newProd.stock,
      img: 'https://via.placeholder.com/300?text=New+Product',
      description: 'Newly added product.'
    });
    setIsAdding(false);
    setNewProd({ name: '', price: '', category: 'Interior', stock: true });
  };

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 80px)', background: '#0a0b0e' }}>
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2>Manage Products</h2>
          <button className="btn-primary" onClick={() => setIsAdding(!isAdding)}>+ Add Product</button>
        </div>

        {isAdding && (
          <form onSubmit={handleAdd} style={{ background: '#12141a', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h3 style={{ marginTop: 0 }}>Add New Product</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <input required placeholder="Product Name" value={newProd.name} onChange={e => setNewProd({...newProd, name: e.target.value})} style={{ padding: '0.8rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px' }} />
              <input required type="number" placeholder="Price ($)" value={newProd.price} onChange={e => setNewProd({...newProd, price: e.target.value})} style={{ padding: '0.8rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px' }} />
              <select value={newProd.category} onChange={e => setNewProd({...newProd, category: e.target.value})} style={{ padding: '0.8rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px' }}>
                <option>Interior</option>
                <option>Exterior</option>
                <option>Lighting</option>
                <option>Performance</option>
              </select>
              <select value={newProd.stock} onChange={e => setNewProd({...newProd, stock: e.target.value === 'true'})} style={{ padding: '0.8rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px' }}>
                <option value="true">In Stock</option>
                <option value="false">Out of Stock</option>
              </select>
            </div>
            <button type="submit" className="btn-primary">Save Product</button>
          </form>
        )}

        <div style={{ background: '#12141a', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                <th style={{ padding: '1rem' }}>Product</th>
                <th style={{ padding: '1rem' }}>Category</th>
                <th style={{ padding: '1rem' }}>Price</th>
                <th style={{ padding: '1rem' }}>Stock</th>
                <th style={{ padding: '1rem' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '1rem' }}>{p.name}</td>
                  <td style={{ padding: '1rem' }}><span style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.1)', borderRadius: '20px', fontSize: '0.8rem' }}>{p.category}</span></td>
                  <td style={{ padding: '1rem' }}>${p.price}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ color: p.inStock ? '#4caf50' : '#f44336' }}>{p.inStock ? 'In Stock' : 'Out of Stock'}</span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <button onClick={() => updateProduct(p.id, { inStock: !p.inStock })} style={{ background: 'transparent', border: '1px solid var(--border)', color: '#fff', padding: '0.3rem 0.6rem', borderRadius: '6px', cursor: 'pointer', marginRight: '5px' }}>
                      Toggle Stock
                    </button>
                    <button onClick={() => deleteProduct(p.id)} style={{ background: '#f44336', border: 'none', color: '#fff', padding: '0.3rem 0.6rem', borderRadius: '6px', cursor: 'pointer' }}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
