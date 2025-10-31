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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500 text-sm flex items-center gap-2">📦 Loading orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4 px-4">
        <div className="bg-white rounded-2xl shadow-sm p-10 text-center max-w-md w-full">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">📦 Your Orders</h2>
          <p className="text-slate-500 mb-4">No orders yet 😢</p>
          <button onClick={() => navigate('/products')} className="inline-flex items-center gap-1 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2.5 text-sm font-medium transition">
            🛍️ Shop Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <span>📦</span> Your Orders
        </h1>
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6">
              <div className="flex flex-wrap gap-3 items-center justify-between mb-5">
                <div className="text-sm text-slate-500">Order ID: <span className="font-mono text-slate-900 text-xs">{order._id}</span></div>
                <div className="text-sm text-slate-500">Date: <span className="text-slate-900">{new Date(order.createdAt).toLocaleString()}</span></div>
                <div className={order.status === 'pending' ? 'inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold' : 'inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold'}>
                  <span className="w-2 h-2 rounded-full bg-current"></span>
                  Status: {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-3">Items</h3>
                <ul className="divide-y divide-slate-100">
                  {order.items.map((item) => (
                    <li key={item._id} className="flex items-center gap-4 py-3">
                      <img src={item.product.image || 'https://picsum.photos/80'} alt={item.product.name} className="w-14 h-14 rounded-lg object-cover" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900">{item.product.name}</p>
                        <p className="text-xs text-slate-500 mt-1">
                          ${item.price} × {item.quantity} = <span className="text-slate-900 font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-end">
                <p className="text-base font-semibold text-slate-900">Total: ${order.total.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;