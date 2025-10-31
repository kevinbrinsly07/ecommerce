import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import useAuth from '../hooks/useAuth';
import { dispatchCartUpdate } from '../utils/cartEvents';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [adding, setAdding] = useState(false);
  const { token, config } = useAuth();

  // -----------------------------------------------------------------
  // 1. Fetch product
  // -----------------------------------------------------------------
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');

    axios
      .get(`http://localhost:5000/api/products/${id}`, { signal: controller.signal })
      .then(res => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch(err => {
        if (err.name !== 'CanceledError') {
          setError('Product not found');
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [id]);

  // -----------------------------------------------------------------
  // 2. Add to cart
  // -----------------------------------------------------------------
  const addToCart = async () => {
    if (!token) {
      alert('Please login first');
      return;
    }

    setAdding(true);
    try {
      await axios.post(
        'http://localhost:5000/api/cart/add',
        { productId: id, quantity: 1 },
        config
      );
      // ---- fire global event → navbar updates instantly ----
      dispatchCartUpdate();
      alert('Added to cart!');
      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add to cart');
    } finally {
      setAdding(false);
    }
  };

  // -----------------------------------------------------------------
  // 3. Render
  // -----------------------------------------------------------------
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="h-10 w-10 rounded-full border-2 border-slate-200 border-t-indigo-500 animate-spin" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-3 px-4">
        <p className="text-rose-500 font-medium">{error || 'Product not found'}</p>
        <Link to="/products" className="text-indigo-500 font-medium">Back to products</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-5">
          <Link to="/products" className="text-indigo-500 hover:text-indigo-600 font-medium">Products</Link>
          <span>/</span>
          <span className="text-slate-900 font-medium">{product.name}</span>
        </div>
        <div className="grid lg:grid-cols-[1.15fr,0.85fr] gap-8 items-start">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <img src={product.image || 'https://picsum.photos/900/700'} alt={product.name} className="w-full h-full max-h-[520px] object-cover" />
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-6 lg:sticky lg:top-6">
            {product.category && (
              <span className="inline-flex items-center rounded-full bg-indigo-50 text-indigo-600 px-3 py-1 text-[0.65rem] font-semibold tracking-wide uppercase mb-4">{product.category}</span>
            )}
            <h1 className="text-3xl font-bold text-slate-900 mb-3 leading-tight">{product.name}</h1>
            <p className="text-slate-600 mb-5 leading-relaxed">{product.description || 'No description available.'}</p>
            <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
              <span className="text-3xl font-bold text-indigo-600">${product.price.toFixed(2)}</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-600 px-3 py-1 text-xs font-semibold">Free shipping</span>
            </div>
            <button onClick={addToCart} disabled={adding} className={`w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 font-semibold shadow-md transition ${adding ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90'}`}>
              {adding ? (
                <>
                  <Spinner /> Adding…
                </>
              ) : (
                'Add to Cart'
              )}
            </button>
            <Link to="/products" className="inline-block mt-4 text-sm text-indigo-500 hover:text-indigo-600 font-medium">Back to products</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

/* --------------------------------------------------------------
   Tiny spinner (same as Login/Register)
   -------------------------------------------------------------- */
const Spinner = () => (
  <svg
    className="w-4 h-4"
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

export default ProductDetail;