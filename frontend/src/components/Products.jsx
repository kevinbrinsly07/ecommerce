import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Explore products</h1>
            <p className="text-slate-500 mt-1">Browse our curated selection of items.</p>
          </div>
          <div className="w-full sm:w-auto">
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm sm:min-w-60">
              <span className="text-slate-400 text-sm">🔍</span>
              <input disabled className="bg-transparent flex-1 outline-none text-sm placeholder:text-slate-400" placeholder="Search products..." />
            </div>
          </div>
        </header>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <div key={product._id} className="group bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col">
              <div className="relative h-44 bg-slate-100">
                <img src={product.image || 'https://via.placeholder.com/150'} alt={product.name} className="h-full w-full object-cover" />
                <span className="absolute top-3 left-3 bg-white/90 text-[0.6rem] uppercase tracking-wide px-2 py-0.5 rounded-full text-slate-900">New</span>
              </div>
              <div className="p-4 flex flex-col gap-3 flex-1">
                <p className="text-sm font-semibold text-slate-900 leading-snug line-clamp-2 min-h-10">{product.name}</p>
                <div className="flex items-center justify-between gap-2 mt-auto">
                  <span className="text-base font-bold text-indigo-600">${product.price}</span>
                  <Link to={`/products/${product._id}`} className="inline-flex items-center gap-1 text-xs font-medium text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-full px-3 py-1 transition">
                    View details
                    <span aria-hidden>→</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
          {products.length === 0 && (
            <p className="text-slate-500">No products found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;