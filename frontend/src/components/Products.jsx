import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import placeholder from '../assets/placeholder.jpg';

const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  const getImageSrc = (img) => {
    // no image at all → use local
    if (!img) return placeholder;

    // ignore old seeded placeholder host
    if (img.includes('via.placeholder.com')) return placeholder;

    // backend/static or real remote URL
    if (img.startsWith('http') || img.startsWith('/')) return img;

    // anything else → fallback
    return placeholder;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Explore products</h1>
            <p className="text-slate-400 mt-1">Browse our curated selection of items.</p>
          </div>
          <div className="w-full sm:w-auto">
            <div className="flex items-center gap-2 bg-slate-900/40 border border-slate-800 rounded-xl px-3 py-2 shadow-sm shadow-slate-950/30 sm:min-w-60 backdrop-blur">
              <span className="text-slate-400 text-sm">🔍</span>
              <input disabled className="bg-transparent flex-1 outline-none text-sm text-slate-100 placeholder:text-slate-500" placeholder="Search products..." />
            </div>
          </div>
        </header>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <div key={product._id} className="group bg-slate-900/40 rounded-2xl border border-slate-800 overflow-hidden hover:-translate-y-px hover:border-slate-600/80 hover:bg-slate-900/70 transition flex flex-col">
              <div className="relative h-44 bg-slate-800">
                <img src={getImageSrc(product.image)} alt={product.name} className="h-full w-full object-cover" />
                <span className="absolute top-3 left-3 bg-slate-100 text-slate-950 text-[0.6rem] uppercase tracking-wide px-2 py-1 rounded-full shadow-sm">New</span>
              </div>
              <div className="p-4 flex flex-col gap-3 flex-1">
                <p className="text-sm font-semibold text-slate-50 leading-snug line-clamp-2 min-h-10">{product.name}</p>
                <div className="flex items-center justify-between gap-2 mt-auto">
                  <span className="text-base font-bold text-slate-50">${product.price}</span>
                  <Link to={`/products/${product._id}`} className="inline-flex items-center gap-1 text-xs font-medium text-slate-950 bg-slate-100 hover:bg-white rounded-full px-4 py-2 transition shadow-sm">
                    View details
                    <span aria-hidden>→</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
          {products.length === 0 && (
            <p className="text-slate-400">No products found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;