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
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="relative w-full max-w-md">
        <div className="relative bg-white rounded-2xl shadow-xl px-7 py-8 sm:px-10 sm:py-10">
          {/* logo */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold bg-linear-to-r from-blue-800 to-sky-500 bg-clip-text text-transparent">
              EBucket
            </h1>
            <p className="text-slate-500 mt-1 text-sm">Create your account</p>
          </div>

          {/* submit error */}
          {errors.submit && (
            <div className="mb-5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-600">
              {errors.submit}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                disabled={loading}
                className={`w-full rounded-xl border px-3 py-2.5 text-sm shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 ${errors.username ? 'border-rose-300' : 'border-slate-200'} ${loading ? 'bg-slate-50 cursor-not-allowed' : 'bg-white'}`}
              />
              {errors.username && (
                <p className="mt-1 text-xs text-rose-500 font-medium">{errors.username}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                disabled={loading}
                className={`w-full rounded-xl border px-3 py-2.5 text-sm shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 ${errors.password ? 'border-rose-300' : 'border-slate-200'} ${loading ? 'bg-slate-50 cursor-not-allowed' : 'bg-white'}`}
              />
              {errors.password && (
                <p className="mt-1 text-xs text-rose-500 font-medium">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Repeat your password"
                disabled={loading}
                className={`w-full rounded-xl border px-3 py-2.5 text-sm shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 ${errors.confirmPassword ? 'border-rose-300' : 'border-slate-200'} ${loading ? 'bg-slate-50 cursor-not-allowed' : 'bg-white'}`}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-rose-500 font-medium">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-800 to-sky-500  py-2.5 text-sm font-semibold text-white shadow-md transition hover:opacity-95 ${loading ? 'opacity-80 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <>
                  <Spinner /> Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Login link */}
          <p className="text-center text-sm text-slate-500 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400 font-medium hover:text-blue-600">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

// Spinner Component
const Spinner = () => (
  <svg
    className="w-5 h-5"
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