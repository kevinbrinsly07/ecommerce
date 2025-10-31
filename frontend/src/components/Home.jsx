import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then(res => {
        // Show 6 random featured products
        const shuffled = [...res.data].sort(() => 0.5 - Math.random());
        setFeatured(shuffled.slice(0, 6));
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Top hero */}
      <section className="bg-linear-to-b from-slate-100 via-slate-50 to-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 grid lg:grid-cols-[1.1fr,0.9fr] gap-10 items-center">
          {/* Left side */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-100 bg-slate-50/70 px-3 py-1 mb-6">
              <span className="text-[0.6rem] tracking-[0.2em] uppercase text-slate-900">NEW DROPS</span>
              <span className="text-[0.6rem] text-slate-900/50">|</span>
              <span className="text-[0.6rem] text-slate-900/60">Up to 40% off this week</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 mb-4 leading-tight">
              ShopHub. Curated looks for modern living.
            </h1>
            <p className="text-slate-600 max-w-xl mb-6">
              Discover trending fashion, gadgets, and home decor from trusted brands. Fast delivery, secure checkout, effortless returns.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/products"
                className="inline-flex items-center gap-1 rounded-full bg-slate-900 text-white px-5 py-2.5 font-semibold shadow-lg shadow-slate-900/10"
              >
                Shop now <span aria-hidden>→</span>
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-1 rounded-full border border-slate-200 text-slate-900 px-4 py-2 font-medium bg-white"
              >
                Create account
              </Link>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-white border border-slate-200"></div>
                <div>
                  <p className="text-xs text-slate-400">Trusted by over</p>
                  <p className="text-sm font-semibold text-slate-900">12,400+ shoppers</p>
                </div>
              </div>
            </div>
            {/* Stat bar */}
            <div className="mt-8 flex flex-wrap gap-6">
              {[
                { label: 'New arrivals', value: '120+' },
                { label: '5‑star reviews', value: '3.2k' },
                { label: 'Avg. delivery', value: '2‑4 days' },
              ].map((item, i) => (
                <div key={i} className="min-w-26">
                  <p className="text-2xl font-semibold text-slate-900">{item.value}</p>
                  <p className="text-[0.65rem] uppercase tracking-[0.25em] text-slate-400">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right side hero card */}
          <div
            className="relative rounded-2xl overflow-hidden min-h-80 shadow-xl bg-cover bg-center"
            style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=850&q=60)' }}
          >
            <div className="absolute inset-0 bg-linear-to-b from-slate-900/90 via-slate-900/50 to-slate-900/90"></div>
            <div className="relative h-full flex flex-col justify-between p-6 text-white">
              <div>
                <p className="text-xs tracking-widest uppercase text-white/60">This week’s pick</p>
                <h2 className="text-xl font-bold mt-1">Streetwear Essentials</h2>
                <p className="text-sm text-white/60 mt-2 max-w-xs">
                  Up to 35% off on sneakers, hoodies, and accessories.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold">$59</span>
                <span className="text-xs line-through text-white/40">$92</span>
                <span className="text-xs bg-white/10 border border-white/20 rounded-full px-2 py-1">Bestseller</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits strip */}
      <section className="bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap gap-6 justify-between">
          {[
            { title: 'Free shipping over $50', desc: 'Fast, tracked delivery' },
            { title: 'Secure payments', desc: 'SSL, 3D secure supported' },
            { title: '30‑day returns', desc: 'No questions asked' },
            { title: '24/7 support', desc: 'Chat with our team' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 min-w-48">
              <div className="h-9 w-9 rounded-xl bg-slate-100"></div>
              <div>
                <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                <p className="text-xs text-slate-400">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex items-center justify-between gap-3 mb-6">
          <div>
            <p className="text-xs tracking-wide uppercase text-slate-400 mb-1">Featured</p>
            <h2 className="text-xl font-bold text-slate-900">Best picks for you</h2>
          </div>
          <Link to="/products" className="text-sm text-slate-900 font-medium hover:underline">
            View all →
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-10 w-10 rounded-full border-2 border-slate-200 border-t-slate-900 animate-spin"></div>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {featured.map((product) => (
              <Link
                key={product._id}
                to={`/products/${product._id}`}
                className="group bg-white border border-slate-100 rounded-2xl overflow-hidden flex flex-col hover:-translate-y-1 hover:shadow-lg transition"
              >
                <div className="relative p-3">
                  <img
                    src={product.image || 'https://picsum.photos/300/200'}
                    alt={product.name}
                    className="h-40 w-full object-cover rounded-xl"
                  />
                  <span className="absolute top-4 left-4 bg-slate-900/90 text-white text-[0.6rem] uppercase tracking-wide px-2 py-1 rounded-full">
                    New
                  </span>
                </div>
                <div className="p-4 flex flex-col gap-2 flex-1">
                  <p className="text-xs uppercase tracking-wide text-slate-400">{product.category || 'General'}</p>
                  <h3 className="text-sm font-semibold text-slate-900">{product.name}</h3>
                  <p className="text-xs text-slate-400 grow">
                    {(product.description && product.description.slice(0, 50) + (product.description.length > 50 ? '…' : '')) || 'Top‑rated product this month.'}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-base font-bold text-slate-900">${product.price}</span>
                    <span className="text-xs bg-slate-100 border border-slate-200 px-2 py-1 rounded-full text-slate-900">View →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* CTA footer */}
      <section className="bg-slate-900 text-white py-14 mt-6">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-wide text-white/60">Join our community</p>
            <h2 className="text-2xl font-bold mt-1">Get exclusive offers & early access.</h2>
            <p className="text-sm text-white/70 mt-2">We send 1–2 emails per month. No spam.</p>
          </div>
          <form className="flex gap-3 flex-wrap" onSubmit={e => e.preventDefault()}>
            <input
              type="email"
              placeholder="Enter your email"
              className="min-w-[220px] rounded-full bg-slate-800 border border-slate-700 px-4 py-2 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-600"
            />
            <button
              type="submit"
              className="rounded-full bg-white text-slate-900 px-6 py-2 font-semibold cursor-pointer hover:bg-slate-100 transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;