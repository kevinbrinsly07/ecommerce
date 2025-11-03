import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import useAuth from '../hooks/useAuth';
import { dispatchCartUpdate } from '../utils/cartEvents';
import placeholder from '../assets/placeholder.png';

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

  const getImageSrc = (img) => {
    if (!img) return placeholder;
    if (img.includes('via.placeholder.com')) return placeholder;
    if (img.includes('picsum.photos')) return placeholder;
    if (img.startsWith('http') || img.startsWith('/')) return img;
    return placeholder;
  };

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
      window.location.href = '/cart';
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
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="h-10 w-10 rounded-full border-2 border-slate-700 border-t-slate-200 animate-spin" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center gap-3 px-4">
        <p className="text-rose-400 font-medium">{error || 'Product not found'}</p>
        <Link to="/products" className="text-cyan-400 font-medium hover:text-cyan-300">Back to products</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-sm text-slate-400 mb-5">
          <Link to="/products" className="text-cyan-400 hover:text-cyan-300 font-medium">Products</Link>
          <span>/</span>
          <span className="text-slate-200 font-medium">{product.name}</span>
        </div>
        <div className="grid lg:grid-cols-[1.15fr,0.85fr] gap-8 items-start">
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl shadow-sm overflow-hidden">
            <img
              src={getImageSrc(product.image)}
              alt={product.name}
              className="w-full h-full max-h-[520px] object-cover"
              onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = placeholder; }}
            />
          </div>
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl shadow-sm p-6 lg:sticky lg:top-6 backdrop-blur">
            {product.category && (
              <span className="inline-flex items-center rounded-full bg-slate-100 text-slate-950 px-3 py-1 text-[0.65rem] font-semibold tracking-wide uppercase mb-4">{product.category}</span>
            )}
            <h1 className="text-3xl font-bold text-white mb-3 leading-tight">{product.name}</h1>
            <p className="text-slate-300 mb-5 leading-relaxed">{product.description || 'No description available.'}</p>
            <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
              <span className="text-3xl font-bold text-slate-50">${product.price.toFixed(2)}</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/15 text-emerald-300 border border-emerald-500/30 px-3 py-1 text-xs font-semibold">Free shipping</span>
            </div>
            <button onClick={addToCart} disabled={adding} className={`w-full inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-cyan-400 to-sky-500 text-slate-950 py-3 font-semibold shadow-md shadow-cyan-500/20 transition ${adding ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90'}`}>
              {adding ? (
                <>
                  <Spinner /> Adding…
                </>
              ) : (
                'Add to Cart'
              )}
            </button>
            <Link to="/products" className="inline-block mt-4 text-sm text-cyan-400 hover:text-cyan-300 font-medium">Back to products</Link>
          </div>
        </div>
        {/* Specifications */}
        <div className="mt-8 bg-slate-900/40 border border-slate-800 rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Specifications</h2>
          <div className="grid sm:grid-cols-2 gap-x-8">
            <dl className="space-y-3 text-sm">
              <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
                <dt className="text-slate-400">Category</dt>
                <dd className="text-slate-200">{product.category || 'General'}</dd>
              </div>
              <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
                <dt className="text-slate-400">Brand</dt>
                <dd className="text-slate-200">{product.brand || '—'}</dd>
              </div>
              <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
                <dt className="text-slate-400">SKU</dt>
                <dd className="text-slate-200">{product.sku || '—'}</dd>
              </div>
              <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
                <dt className="text-slate-400">Stock</dt>
                <dd className="text-slate-200">{product.stock ?? '—'}</dd>
              </div>
              <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
                <dt className="text-slate-400">Weight</dt>
                <dd className="text-slate-200">{product.weight || '—'}</dd>
              </div>
            </dl>
            <dl className="space-y-3 text-sm">
              <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
                <dt className="text-slate-400">Dimensions</dt>
                <dd className="text-slate-200">{product.dimensions || '—'}</dd>
              </div>
              <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
                <dt className="text-slate-400">Warranty</dt>
                <dd className="text-slate-200">{product.warranty || '—'}</dd>
              </div>
              <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
                <dt className="text-slate-400">Origin</dt>
                <dd className="text-slate-200">{product.origin || '—'}</dd>
              </div>
              <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
                <dt className="text-slate-400">Shipping</dt>
                <dd className="text-slate-200">{product.shipping || 'Free'}</dd>
              </div>
              <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
                <dt className="text-slate-400">Returns</dt>
                <dd className="text-slate-200">{product.returns || '30 days'}</dd>
              </div>
            </dl>
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