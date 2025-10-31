import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import axios from 'axios';

const Navbar = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    const fetchCart = async () => {
      if (!token) { setCartCount(0); return; }
      try {
        const res = await axios.get('http://localhost:5000/api/cart', { headers: { Authorization: `Bearer ${token}` } });
        const count = res.data.items.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(count);
      } catch (err) {
        console.error('Failed to load cart count', err);
      }
    };
    fetchCart();
  }, [token]);

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-slate-200">
      <nav className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-2xl font-bold bg-linear-to-r from-blue-800 to-sky-500 bg-clip-text text-transparent">Ebucket</Link>
            <div className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-slate-700 hover:text-slate-900 text-sm font-medium">Home</Link>
              <Link to="/products" className="text-slate-700 hover:text-slate-900 text-sm font-medium">Products</Link>
              <Link to="/cart" className="relative text-slate-700 hover:text-slate-900 text-sm font-medium">
                Cart
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-3 bg-rose-500 text-white text-xs font-semibold min-w-5 h-5 rounded-full flex items-center justify-center px-1">{cartCount}</span>
                )}
              </Link>
            </div>
          </div>

          {/* Right section */}
          <div className="hidden md:flex items-center gap-4">
            {token ? (
              <div className="relative">
                <button onClick={() => setIsProfileOpen((prev) => !prev)} className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-slate-100 transition">
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-semibold text-sm">U</div>
                  <span className="text-sm">Account</span>
                  <svg className="w-4 h-4 text-slate-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.086l3.71-3.855a.75.75 0 111.08 1.04l-4.25 4.417a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" /></svg>
                </button>
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-44 rounded-xl bg-white shadow-lg ring-1 ring-black/5 py-1">
                    <Link to="/orders" onClick={() => setIsProfileOpen(false)} className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">My Orders</Link>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-rose-500 hover:bg-slate-50">Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm font-medium text-slate-700 hover:text-slate-900">Login</Link>
                <Link to="/register" className="inline-flex items-center rounded-lg bg-linear-to-r from-blue-800 to-sky-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:opacity-90">Sign Up</Link>
              </div>
            )}
          </div>

          {/* Mobile button */}
          <button onClick={() => setIsMobileOpen((prev) => !prev)} className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            <span className="sr-only">Open main menu</span>
            {isMobileOpen ? (
              <svg className="h-6 w-6" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg className="h-6 w-6" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {isMobileOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur border-b border-slate-200">
          <div className="space-y-1 px-4 pt-2 pb-3">
            <Link to="/" onClick={() => setIsMobileOpen(false)} className="block rounded-md px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-100">Home</Link>
            <Link to="/products" onClick={() => setIsMobileOpen(false)} className="block rounded-md px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-100">Products</Link>
            <Link to="/cart" onClick={() => setIsMobileOpen(false)} className="relative block rounded-md px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-100">Cart {cartCount > 0 && <span className="ml-1 text-rose-500 font-semibold">({cartCount})</span>}</Link>
            {token ? (
              <>
                <Link to="/orders" onClick={() => setIsMobileOpen(false)} className="block rounded-md px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-100">My Orders</Link>
                <button onClick={handleLogout} className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-rose-500 hover:bg-slate-100">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsMobileOpen(false)} className="block rounded-md px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-100">Login</Link>
                <Link to="/register" onClick={() => setIsMobileOpen(false)} className="block rounded-md px-3 py-2 text-base font-medium text-white bg-linear-to-r from-blue-800 to-sky-500 hover:opacity-90">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;