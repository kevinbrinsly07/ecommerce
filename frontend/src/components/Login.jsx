import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await login(formData.username, formData.password);
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid username or password';
      setErrors({ submit: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        width: '100%',
        maxWidth: '420px',
        position: 'relative'
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{
            fontSize: '2.2rem',
            fontWeight: 'bold',
            background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: '0 0 8px 0'
          }}>
            ShopHub
          </h1>
          <p style={{ color: '#666', margin: 0 }}>Welcome back! Please login</p>
        </div>

        {/* Error Alert */}
        {errors.submit && (
          <div style={{
            background: '#fee',
            color: '#c53030',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '0.9rem',
            border: '1px solid #feb2b2',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ fontSize: '1.2rem' }}>Warning</span> {errors.submit}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Username */}
          <div>
            <label style={labelStyle}>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              style={inputStyle}
              disabled={loading}
            />
            {errors.username && <p style={errorStyle}>{errors.username}</p>}
          </div>

          {/* Password */}
          <div>
            <label style={labelStyle}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                style={inputStyle}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1.1rem',
                  color: '#666'
                }}
                tabIndex="-1"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.password && <p style={errorStyle}>{errors.password}</p>}
          </div>

          {/* Remember Me & Forgot Password */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.9rem'
          }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
              <input type="checkbox" style={{ width: '16px', height: '16px' }} />
              <span>Remember me</span>
            </label>
            <Link
              to="/forgot-password"
              style={{
                color: '#667eea',
                textDecoration: 'none',
                fontWeight: '500'
              }}
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              ...buttonStyle,
              background: loading ? '#a0aec0' : 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              marginTop: '10px'
            }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Spinner />
                Signing In...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Divider */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          margin: '25px 0',
          color: '#aaa'
        }}>
          <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }}></div>
          <span style={{ padding: '0 15px', fontSize: '0.9rem' }}>OR</span>
          <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }}></div>
        </div>

        {/* Social Login */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={{
            ...socialButtonStyle,
            background: '#4285f4',
            color: 'white'
          }}>
            <span style={{ fontSize: '1.2rem', marginRight: '8px' }}>G</span> Google
          </button>
          <button style={{
            ...socialButtonStyle,
            background: '#1877f2',
            color: 'white'
          }}>
            <span style={{ fontSize: '1.2rem', marginRight: '8px' }}>f</span> Facebook
          </button>
        </div>

        {/* Register Link */}
        <p style={{
          textAlign: 'center',
          marginTop: '24px',
          color: '#666',
          fontSize: '0.95rem'
        }}>
          Don't have an account?{' '}
          <Link
            to="/register"
            style={{
              color: '#667eea',
              fontWeight: '500',
              textDecoration: 'none'
            }}
          >
            Sign up
          </Link>
        </p>

        {/* Decorative Elements */}
        <div style={{
          position: 'absolute',
          top: '-20px',
          right: '-20px',
          width: '80px',
          height: '80px',
          background: 'rgba(102, 126, 234, 0.1)',
          borderRadius: '50%',
          zIndex: -1
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '-30px',
          left: '-30px',
          width: '100px',
          height: '100px',
          background: 'rgba(118, 75, 162, 0.1)',
          borderRadius: '50%',
          zIndex: -1
        }}></div>
      </div>
    </div>
  );
};

// Reusable Styles
const labelStyle = {
  display: 'block',
  marginBottom: '6px',
  fontWeight: '500',
  color: '#333',
  fontSize: '0.95rem'
};

const inputStyle = {
  width: '100%',
  padding: '12px 16px',
  border: '2px solid #e2e8f0',
  borderRadius: '12px',
  fontSize: '1rem',
  transition: 'all 0.2s',
  outline: 'none',
  boxSizing: 'border-box'
};

const buttonStyle = {
  padding: '14px',
  border: 'none',
  borderRadius: '12px',
  color: 'white',
  fontSize: '1.1rem',
  fontWeight: '600',
  transition: 'all 0.3s',
  marginTop: '8px'
};

const socialButtonStyle = {
  flex: 1,
  padding: '12px',
  border: 'none',
  borderRadius: '12px',
  fontSize: '0.95rem',
  fontWeight: '500',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px'
};

const errorStyle = {
  color: '#e53e3e',
  fontSize: '0.85rem',
  margin: '6px 0 0 0',
  fontWeight: '500'
};

// Spinner Component
const Spinner = () => (
  <svg
    style={{ width: '20px', height: '20px' }}
    viewBox="0 0 38 38"
    xmlns="http://www.w3.org/2000/svg"
    stroke="white"
  >
    <g fill="none" fillRule="evenodd">
      <g transform="translate(1 1)" strokeWidth="3">
        <circle strokeOpacity=".5" cx="18" cy="18" r="18" />
        <path d="M36 18c0-9.94-8.06-18-18-18">
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 18 18"
            to="360 18 18"
            dur="1s"
            repeatCount="indefinite"
          />
        </path>
      </g>
    </g>
  </svg>
);

export default Login;