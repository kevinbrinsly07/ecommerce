import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import axios from 'axios';

const Navbar = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const [cartCount, setCartCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Fetch cart count on mount & when token changes
  useEffect(() => {
    const fetchCartCount = async () => {
      if (!token) {
        setCartCount(0);
        return;
      }
      try {
        const res = await axios.get('http://localhost:5000/api/cart', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const count = res.data.items.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(count);
      } catch (err) {
        console.error('Failed to load cart count', err);
      }
    };
    fetchCartCount();
  }, [token]);

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    navigate('/');
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      backdropFilter: 'blur(12px)',
      background: 'rgba(255, 255, 255, 0.85)',
      borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <nav style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '70px'
      }}>
        {/* Logo */}
        <Link
          to="/"
          style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textDecoration: 'none'
          }}
        >
          ShopHub
        </Link>

        {/* Desktop Links */}
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }} className="hidden md:flex">
          <Link to="/" style={navLinkStyle}>Home</Link>
          <Link to="/products" style={navLinkStyle}>Products</Link>
          <Link to="/cart" style={{ ...navLinkStyle, position: 'relative' }}>
            Cart
            {cartCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-8px',
                right: '-12px',
                background: '#ff4757',
                color: 'white',
                fontSize: '0.75rem',
                fontWeight: 'bold',
                minWidth: '20px',
                height: '20px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 6px'
              }}>
                {cartCount}
              </span>
            )}
          </Link>

          {token ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.background = 'rgba(0,0,0,0.05)'}
                onMouseLeave={(e) => e.target.style.background = 'transparent'}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#ddd',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  color: '#555'
                }}>
                  U
                </div>
                <span style={{ fontSize: '14px' }}>Account</span>
              </button>

              {isProfileOpen && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  width: '200px',
                  background: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                  marginTop: '8px',
                  overflow: 'hidden',
                  animation: 'fadeIn 0.2s ease'
                }}>
                  <Link
                    to="/orders"
                    style={dropdownItemStyle}
                    onClick={() => setIsProfileOpen(false)}
                  >
                    My Orders
                  </Link>
                  <button
                    onClick={handleLogout}
                    style={{
                      ...dropdownItemStyle,
                      width: '100%',
                      textAlign: 'left',
                      color: '#e74c3c',
                      fontWeight: '500'
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" style={navLinkStyle}>Login</Link>
              <Link
                to="/register"
                style={{
                  ...navLinkStyle,
                  background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontWeight: '500'
                }}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          style={{
            display: 'none',
            background: 'transparent',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer'
          }}
          className="md:hidden"
        >
          {isMobileMenuOpen ? 'Close' : 'Menu'}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div style={{
          background: 'white',
          borderTop: '1px solid #eee',
          padding: '1rem',
          animation: 'slideDown 0.3s ease'
        }} className="md:hidden">
          <Link to="/" style={mobileLinkStyle} onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
          <Link to="/products" style={mobileLinkStyle} onClick={() => setIsMobileMenuOpen(false)}>Products</Link>
          <Link to="/cart" style={mobileLinkStyle} onClick={() => setIsMobileMenuOpen(false)}>
            Cart {cartCount > 0 && <span style={{ color: '#ff4757' }}>({cartCount})</span>}
          </Link>
          {token ? (
            <>
              <Link to="/orders" style={mobileLinkStyle} onClick={() => setIsMobileMenuOpen(false)}>My Orders</Link>
              <button onClick={handleLogout} style={mobileLinkStyle}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={mobileLinkStyle} onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
              <Link to="/register" style={mobileLinkStyle} onClick={() => setIsMobileMenuOpen(false)}>Sign Up</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

// Reusable styles
const navLinkStyle = {
  textDecoration: 'none',
  color: '#333',
  fontWeight: '500',
  fontSize: '1rem',
  padding: '8px 0',
  position: 'relative',
  transition: 'color 0.2s'
};

const dropdownItemStyle = {
  display: 'block',
  padding: '12px 16px',
  background: 'transparent',
  border: 'none',
  width: '100%',
  textAlign: 'left',
  cursor: 'pointer',
  fontSize: '14px',
  color: '#333',
  transition: 'background 0.2s'
};

const mobileLinkStyle = {
  display: 'block',
  padding: '12px 0',
  color: '#333',
  textDecoration: 'none',
  fontSize: '1.1rem',
  borderBottom: '1px solid #eee'
};

// Add animations
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes slideDown {
    from { opacity: 0; height: 0; }
    to { opacity: 1; height: auto; }
  }
`;
document.head.appendChild(style);

export default Navbar;