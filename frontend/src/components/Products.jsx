import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const pageStyle = { minHeight: '100vh', background: '#f3f4f6', padding: '30px 20px', fontFamily: 'system-ui, -apple-system, sans-serif' };
const containerStyle = { maxWidth: '1100px', margin: '0 auto' };
const headerStyle = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', gap: '16px', flexWrap: 'wrap' };
const titleWrap = { display: 'flex', flexDirection: 'column', gap: '4px' };
const titleStyle = { fontSize: '2.1rem', fontWeight: 700, color: '#111827' };
const subtitleStyle = { color: '#6b7280' };
const searchBox = { background: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '10px 14px', minWidth: '230px', display: 'flex', alignItems: 'center', gap: '8px' };
const searchInput = { border: 'none', outline: 'none', flex: 1, fontSize: '0.9rem' };
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '18px' };
const cardStyle = { background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.04)', border: '1px solid rgba(148, 163, 184, 0.25)', transition: 'transform 0.2s ease, box-shadow 0.2s ease' };
const imgWrapper = { width: '100%', height: '180px', overflow: 'hidden', background: '#e5e7eb' };
const imgStyle = { width: '100%', height: '100%', objectFit: 'cover' };
const cardBody = { padding: '14px 16px 14px' };
const productName = { fontWeight: 600, color: '#111827', marginBottom: '6px', fontSize: '1rem', minHeight: '40px' };
const priceRow = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px' };
const priceText = { fontSize: '1.05rem', fontWeight: 700, color: '#4f46e5' };
const viewBtn = { textDecoration: 'none', background: 'linear-gradient(90deg, #6366f1, #8b5cf6)', color: 'white', padding: '7px 14px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 500, display: 'inline-block' };

const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <header style={headerStyle}>
          <div style={titleWrap}>
            <h1 style={titleStyle}>Explore products</h1>
            <p style={subtitleStyle}>Browse our curated selection of items.</p>
          </div>
          <div style={searchBox}>
            <input type="text" placeholder="Search products..." style={searchInput} disabled />
          </div>
        </header>
        <div style={gridStyle}>
          {products.map(product => (
            <div key={product._id} style={cardStyle}>
              <div style={imgWrapper}>
                <img
                  src={product.image || 'https://via.placeholder.com/150'}
                  alt={product.name}
                  style={imgStyle}
                />
              </div>
              <div style={cardBody}>
                <p style={productName}>{product.name}</p>
                <div style={priceRow}>
                  <span style={priceText}>${product.price}</span>
                  <Link to={`/products/${product._id}`} style={viewBtn}>View details</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;