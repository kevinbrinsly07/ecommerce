import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import useAuth from '../hooks/useAuth';
import { dispatchCartUpdate } from '../utils/cartEvents';

const pageStyle = { minHeight: '100vh', background: '#f3f4f6', padding: '30px 16px', fontFamily: 'system-ui, -apple-system, sans-serif' };
const containerStyle = { maxWidth: '1200px', margin: '0 auto' };
const breadcrumb = { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px', fontSize: '0.9rem' };
const crumbLink = { color: '#6366f1', textDecoration: 'none', fontWeight: 500 };
const layoutStyle = { display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '28px' };
const imageSection = { background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(15,23,42,0.05)' };
const mainImage = { width: '100%', height: '100%', maxHeight: '520px', objectFit: 'cover', display: 'block' };
const infoSection = { background: 'white', borderRadius: '20px', padding: '24px', boxShadow: '0 10px 30px rgba(15,23,42,0.05)', alignSelf: 'flex-start', position: 'sticky', top: '24px' };
const pill = { display: 'inline-block', background: 'rgba(99, 102, 241, 0.08)', color: '#4f46e5', fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.04em', textTransform: 'uppercase', padding: '5px 12px', borderRadius: '9999px', marginBottom: '14px' };
const title = { fontSize: '2.1rem', fontWeight: 700, marginBottom: '12px', color: '#0f172a' };
const desc = { color: '#6b7280', lineHeight: 1.6, marginBottom: '18px' };
const priceWrap = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', gap: '12px' };
const price = { fontSize: '2rem', fontWeight: 700, color: '#4f46e5' };
const shipBadge = { background: 'rgba(16, 185, 129, 0.12)', color: '#059669', padding: '6px 12px', borderRadius: '9999px', fontSize: '0.65rem', fontWeight: 600 };
const addBtnStyle = { width: '100%', padding: '14px 16px', border: 'none', borderRadius: '14px', background: 'linear-gradient(90deg,#6366f1,#8b5cf6)', color: 'white', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'opacity 0.2s ease' };
const backLinkStyle = { display: 'inline-block', marginTop: '14px', color: '#4f46e5', textDecoration: 'none', fontWeight: 500 };
const center = { textAlign: 'center', padding: '80px 20px', fontSize: '1.1rem' };

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
    return <div style={pageStyle}> <div style={center}>Loading product...</div> </div>;
  }

  if (error || !product) {
    return (
      <div style={pageStyle}>
        <div style={center}>
          <p style={{ color: '#e53e3e' }}>{error || 'Product not found'}</p>
          <Link to="/products" style={backLinkStyle}>Back to products</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <div style={breadcrumb}>
          <Link to="/products" style={crumbLink}>Products</Link>
          <span style={{ color: '#9ca3af' }}>/</span>
          <span style={{ color: '#111827', fontWeight: 500 }}>{product.name}</span>
        </div>
        <div style={layoutStyle}>
          <div style={imageSection}>
            <img src={product.image || 'https://picsum.photos/900/700'} alt={product.name} style={mainImage} />
          </div>
          <div style={infoSection}>
            {product.category && (
              <span style={pill}>{product.category}</span>
            )}
            <h1 style={title}>{product.name}</h1>
            <p style={desc}>{product.description || 'No description available.'}</p>
            <div style={priceWrap}>
              <span style={price}>${product.price.toFixed(2)}</span>
              <span style={shipBadge}>Free shipping</span>
            </div>
            <button
              onClick={addToCart}
              disabled={adding}
              style={{
                ...addBtnStyle,
                opacity: adding ? 0.7 : 1,
                cursor: adding ? 'not-allowed' : 'pointer'
              }}
            >
              {adding ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Spinner /> Adding…
                </span>
              ) : (
                'Add to Cart'
              )}
            </button>
            <Link to="/products" style={backLinkStyle}>
              Back to products
            </Link>
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
    style={{ width: '18px', height: '18px' }}
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