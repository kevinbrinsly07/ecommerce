import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import placeholder from '../assets/placeholder.jpg';
import { FiTrash2, FiShoppingCart } from 'react-icons/fi';

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

  const getImageSrc = (img) => {
    if (!img) return placeholder;
    if (typeof img !== 'string') return placeholder;
    if (img.includes('via.placeholder.com')) return placeholder;
    if (img.includes('picsum.photos')) return placeholder;
    if (img.startsWith('http') || img.startsWith('/')) return img;
    return placeholder;
  };

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

  if (loading) return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
      <p className="text-slate-400 text-sm flex items-center gap-2"><FiShoppingCart /> Loading cart...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-white mb-6 flex items-center gap-2">
          <FiShoppingCart className="opacity-90" /> Shopping Cart
        </h1>
        {cart.items.length === 0 ? (
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl shadow-sm p-10 text-center backdrop-blur">
            <p className="text-slate-400 mb-4">Your cart is empty</p>
            <Link to="/products" className="inline-flex items-center gap-1 text-cyan-400 font-medium hover:text-cyan-300">
              Start Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {cart.items.map((item) => (
                <div key={item.product._id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-slate-900/40 border border-slate-800 rounded-xl p-4 shadow-sm backdrop-blur">
                  <img src={getImageSrc(item.product.image)} alt={item.product.name} className="w-20 h-20 rounded-lg object-cover bg-slate-800" />
                  <div className="flex-1 space-y-1">
                    <h3 className="text-base font-semibold text-slate-50">{item.product.name}</h3>
                    <p className="text-sm text-slate-400 line-clamp-2">{item.product.description}</p>
                    <p className="text-sm text-slate-300 font-medium">
                      ${item.product.price} × {item.quantity} = <span className="text-slate-50 font-semibold">${(item.product.price * item.quantity).toFixed(2)}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.product._id)}
                    className="inline-flex items-center gap-1 bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium px-3 py-2 rounded-lg transition"
                  >
                    <FiTrash2 /> Remove
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/40 border border-slate-800 rounded-2xl shadow-sm p-5 backdrop-blur">
              <div>
                <h2 className="text-xl font-semibold text-slate-200">Total:</h2>
                <p className="text-2xl font-bold text-slate-50 mt-1">
                  ${cart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0).toFixed(2)}
                </p>
              </div>
              <button
                onClick={checkout}
                disabled={cart.items.length === 0}
                className="inline-flex items-center gap-2 bg-linear-to-r from-cyan-400 to-sky-500 text-slate-950 hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed font-semibold px-6 py-3 rounded-xl shadow-md shadow-cyan-500/20 transition"
              >
                🚀 Checkout Now
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;