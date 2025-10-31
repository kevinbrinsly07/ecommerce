import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await register(formData.username, formData.password);
      alert('Account created successfully!');
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Try again.';
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
          <p style={{ color: '#666', margin: 0 }}>Create your account</p>
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
            border: '1px solid #feb2b2'
          }}>
            {errors.submit}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Username */}
          <div>
            <label style={{
              display: 'block',
              marginBottom: '6px',
              fontWeight: '500',
              color: '#333',
              fontSize: '0.95rem'
            }}>
              Username
            </label>
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
            <label style={{
              display: 'block',
              marginBottom: '6px',
              fontWeight: '500',
              color: '#333',
              fontSize: '0.95rem'
            }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a strong password"
              style={inputStyle}
              disabled={loading}
            />
            {errors.password && <p style={errorStyle}>{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label style={{
              display: 'block',
              marginBottom: '6px',
              fontWeight: '500',
              color: '#333',
              fontSize: '0.95rem'
            }}>
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Repeat your password"
              style={inputStyle}
              disabled={loading}
            />
            {errors.confirmPassword && <p style={errorStyle}>{errors.confirmPassword}</p>}
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
                Creating Account...
              </span>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Login Link */}
        <p style={{
          textAlign: 'center',
          marginTop: '24px',
          color: '#666',
          fontSize: '0.95rem'
        }}>
          Already have an account?{' '}
          <Link
            to="/login"
            style={{
              color: '#667eea',
              fontWeight: '500',
              textDecoration: 'none'
            }}
          >
            Sign in
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
const inputStyle = {
  width: '100%',
  padding: '12px 16px',
  border: '2px solid #e2e8f0',
  borderRadius: '12px',
  fontSize: '1rem',
  transition: 'all 0.2s',
  outline: 'none'
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

export default Register;