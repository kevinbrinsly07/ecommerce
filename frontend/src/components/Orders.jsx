import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchOrders = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setOrders([]);
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get('http://localhost:5000/api/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data);
    } catch (err) {
      console.error('Orders fetch error:', err.response?.data);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>📦 Loading orders...</div>;

  if (orders.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2>📦 Your Orders</h2>
        <p>No orders yet 😢</p>
        <button
          onClick={() => navigate('/products')}
          style={{
            background: '#007bff',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          🛍️ Shop Now
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center' }}>📦 Your Orders</h1>
      
      {orders.map((order) => (
        <div
          key={order._id} // Unique MongoDB _id
          style={{
            border: '2px solid #007bff',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '30px',
            background: '#f8f9fa',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontWeight: 'bold' }}>
            <span>Order ID: {order._id}</span>
            <span>Date: {new Date(order.createdAt).toLocaleString()}</span>
            <span style={{ color: order.status === 'pending' ? '#ffc107' : '#28a745' }}>
              Status: {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>
          
          <h3>Items:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {order.items.map((item) => (
              <li
                key={item._id} // Unique item _id (from Cart schema)
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  padding: '10px',
                  borderBottom: '1px solid #eee'
                }}
              >
                <img
                  src={item.product.image || 'https://picsum.photos/80'}
                  alt={item.product.name}
                  style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }}
                />
                <div style={{ flex: 1 }}>
                  <strong>{item.product.name}</strong>
                  <p style={{ margin: '5px 0', color: '#666' }}>
                    ${item.price} × {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          
          <div style={{ textAlign: 'right', marginTop: '15px', fontSize: '1.2em', fontWeight: 'bold' }}>
            Total: ${order.total.toFixed(2)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Orders;