import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import placeholder from '../assets/placeholder.jpg';
import { FiPackage } from 'react-icons/fi';

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

  const getImageSrc = (img) => {
    if (!img) return placeholder;
    if (typeof img !== 'string') return placeholder;
    if (img.includes('via.placeholder.com')) return placeholder;
    if (img.includes('picsum.photos')) return placeholder;
    if (img.startsWith('http') || img.startsWith('/')) return img;
    return placeholder;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <p className="text-slate-400 text-sm flex items-center gap-2"><FiPackage /> Loading orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center gap-4 px-4">
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl shadow-sm p-10 text-center max-w-md w-full backdrop-blur">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2"><FiPackage /> Your Orders</h2>
          <p className="text-slate-400 mb-4">No orders yet 😢</p>
          <button onClick={() => navigate('/products')} className="inline-flex items-center gap-1 rounded-full bg-linear-to-r from-cyan-400 to-sky-500 text-slate-950 px-5 py-2.5 text-sm font-semibold shadow-sm shadow-cyan-500/20 hover:opacity-90 transition">
            Shop Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-white mb-6 flex items-center gap-2">
          <FiPackage className="opacity-90" /> Your Orders
        </h1>
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-slate-900/40 border border-slate-800 rounded-2xl shadow-sm p-6 backdrop-blur">
              <div className="flex flex-wrap gap-3 items-center justify-between mb-5">
                <div className="text-sm text-slate-400">Order ID: <span className="font-mono text-slate-200 text-xs">{order._id}</span></div>
                <div className="text-sm text-slate-400">Date: <span className="text-slate-200">{new Date(order.createdAt).toLocaleString()}</span></div>
                <div className={
                  order.status === 'pending'
                    ? 'inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-400/15 text-amber-300 border border-amber-500/30 text-xs font-semibold'
                    : 'inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-400/15 text-emerald-300 border border-emerald-500/30 text-xs font-semibold'
                }>
                  <span className="w-2 h-2 rounded-full bg-current"></span>
                  Status: {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-100 mb-3">Items</h3>
                <ul className="divide-y divide-slate-800/60">
                  {order.items.map((item) => (
                    <li key={item._id} className="flex items-center gap-4 py-3">
                      <img src={getImageSrc(item.product.image)} alt={item.product.name} className="w-14 h-14 rounded-lg object-cover bg-slate-800" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-100">{item.product.name}</p>
                        <p className="text-xs text-slate-400 mt-1">
                          ${item.price} × {item.quantity} = <span className="text-slate-100 font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-end">
                <p className="text-base font-semibold text-slate-100">Total: ${order.total.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;