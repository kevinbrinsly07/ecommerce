import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch cart ONCE + only when token changes
  const fetchCart = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setCart({ items: [] });
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get('http://localhost:5000/api/cart', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(res.data);
    } catch (err) {
      console.error('Cart error:', err.response?.data);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // Run ONCE on mount + re-run if token changes
  useEffect(() => {
    fetchCart();
  }, [fetchCart]); // Stable callback → no loop!

  const removeItem = async (productId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:5000/api/cart/remove', { productId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Optimistic update
      setCart(prev => ({
        ...prev,
        items: prev.items.filter(i => i.product._id !== productId)
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const checkout = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:5000/api/orders/checkout', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('✅ Order placed! Cart cleared.');
      setCart({ items: [] });
    } catch (err) {
      alert('❌ ' + (err.response?.data?.message || 'Checkout failed'));
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>🛒 Loading cart...</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1>🛒 Shopping Cart</h1>
      
      {cart.items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <p>Your cart is empty 😢</p>
          <Link to="/products" style={{ color: '#007bff', fontSize: '18px' }}>
            👉 Start Shopping
          </Link>
        </div>
      ) : (
        <>
          {cart.items.map((item) => (
            <div
              key={item.product._id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                border: '1px solid #ddd',
                padding: '20px',
                borderRadius: '10px',
                marginBottom: '15px',
                background: '#f9f9f9'
              }}
            >
              <img
                src={item.product.image || 'https://picsum.photos/100'}
                alt={item.product.name}
                style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
              />
              <div style={{ flex: 1 }}>
                <h3>{item.product.name}</h3>
                <p style={{ color: '#666' }}>{item.product.description}</p>
                <p><strong>${item.product.price} × {item.quantity} = ${(item.product.price * item.quantity).toFixed(2)}</strong></p>
              </div>
              <button
                onClick={() => removeItem(item.product._id)}
                style={{
                  background: '#ff4757',
                  color: 'white',
                  border: 'none',
                  padding: '10px 15px',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                ❌ Remove
              </button>
            </div>
          ))}
          
          <div style={{ textAlign: 'right', marginTop: '20px' }}>
            <h2>Total: ${cart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0).toFixed(2)}</h2>
            <button
              onClick={checkout}
              disabled={cart.items.length === 0}
              style={{
                background: '#28a745',
                color: 'white',
                border: 'none',
                padding: '15px 30px',
                fontSize: '18px',
                borderRadius: '10px',
                cursor: 'pointer'
              }}
            >
              🚀 Checkout Now
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;