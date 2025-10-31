import { useState } from 'react';
import { Link } from 'react-router-dom';
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
      window.location.href = '/';
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid username or password';
      setErrors({ submit: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl p-8 sm:p-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-linear-to-r from-blue-800 to-sky-500 bg-clip-text text-transparent">EBucket</h1>
          <p className="text-slate-500 mt-1 text-sm">Welcome back! Please login</p>
        </div>

        {/* Error message */}
        {errors.submit && (
          <div className="mb-5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-600 flex items-center gap-2">
            <span className="text-lg">⚠️</span> {errors.submit}
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
              className={`w-full rounded-xl border px-3 py-2.5 text-sm shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 ${errors.username ? 'border-rose-300' : 'border-slate-200'} ${loading ? 'bg-slate-50 cursor-not-allowed' : 'bg-white'}`}
            />
            {errors.username && <p className="mt-1 text-xs text-rose-500 font-medium">{errors.username}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                disabled={loading}
                className={`w-full rounded-xl border px-3 py-2.5 text-sm shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 ${errors.password ? 'border-rose-300' : 'border-slate-200'} ${loading ? 'bg-slate-50 cursor-not-allowed' : 'bg-white'}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm hover:text-slate-700"
                tabIndex="-1"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-xs text-rose-500 font-medium">{errors.password}</p>}
          </div>

          {/* Remember me / Forgot */}
          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 text-indigo-600 rounded" />
              <span>Remember me</span>
            </label>
            <Link to="/forgot-password" className="text-blue-400 hover:text-blue-600 font-medium">
              Forgot password?
            </Link>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-800 to-sky-500 py-2.5 text-sm font-semibold text-white shadow-md transition hover:opacity-95 ${loading ? 'opacity-80 cursor-not-allowed' : ''}`}
          >
            {loading ? (<><Spinner /> Signing In...</>) : 'Sign In'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6 text-slate-400 text-sm">
          <div className="flex-1 h-px bg-slate-200"></div>
          <span className="px-3">OR</span>
          <div className="flex-1 h-px bg-slate-200"></div>
        </div>

        {/* Social buttons */}
        <div className="flex gap-3">
          <button className="flex-1 flex items-center justify-center gap-2 bg-[#4285f4] text-white py-2.5 rounded-xl text-sm font-medium shadow hover:opacity-90 transition"><span className="text-lg">G</span> Google</button>
          <button className="flex-1 flex items-center justify-center gap-2 bg-[#1877f2] text-white py-2.5 rounded-xl text-sm font-medium shadow hover:opacity-90 transition"><span className="text-lg">f</span> Facebook</button>
        </div>

        <p className="text-center text-sm text-slate-500 mt-6">
          Don’t have an account?{' '}
          <Link to="/register" className="text-blue-400 font-medium hover:text-blue-600">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

// Spinner Component
const Spinner = () => (
  <svg className="w-5 h-5" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg" stroke="white">
    <g fill="none" fillRule="evenodd">
      <g transform="translate(1 1)" strokeWidth="3">
        <circle strokeOpacity=".5" cx="18" cy="18" r="18" />
        <path d="M36 18c0-9.94-8.06-18-18-18">
          <animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="1s" repeatCount="indefinite" />
        </path>
      </g>
    </g>
  </svg>
);

export default Login;