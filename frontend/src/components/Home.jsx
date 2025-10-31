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
    <div style={{ fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif', background: '#0f172a0d' }}>
      {/* Top hero */}
      <section
        style={{
          background: 'radial-gradient(circle at top, #dbeafe 0%, #eff6ff 35%, #ffffff 70%)',
          borderBottom: '1px solid rgba(15,23,42,0.05)',
        }}
      >
        <div
          style={{
            maxWidth: '1180px',
            margin: '0 auto',
            padding: '5.5rem 1.25rem 4.25rem',
            display: 'grid',
            gridTemplateColumns: '1.1fr 0.9fr',
            gap: '3rem',
            alignItems: 'center',
          }}
        >
          {/* Left side */}
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '.5rem',
                background: 'rgba(15,23,42,0.05)',
                border: '1px solid rgba(15,23,42,0.03)',
                borderRadius: '9999px',
                padding: '.35rem .85rem',
                marginBottom: '1.4rem',
              }}
            >
              <span style={{ fontSize: '0.55rem', textTransform: 'uppercase', letterSpacing: '.06em', color: '#0f172a' }}>
                NEW DROPS
              </span>
              <span style={{ fontSize: '0.55rem', color: '#0f172a88' }}>|</span>
              <span style={{ fontSize: '0.65rem', color: '#0f172a99' }}>Up to 40% off this week</span>
            </div>
            <h1
              style={{
                fontSize: 'clamp(2.7rem, 5vw, 3.25rem)',
                fontWeight: 700,
                lineHeight: 1.02,
                color: '#0f172a',
                marginBottom: '1.1rem',
                letterSpacing: '-.03em',
              }}
            >
              ShopHub. Curated looks for modern living.
            </h1>
            <p style={{ color: '#475569', fontSize: '1rem', maxWidth: '34rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Discover trending fashion, gadgets, and home decor from trusted brands. Fast delivery, secure checkout, effortless returns.
            </p>
            <div style={{ display: 'flex', gap: '.9rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <Link
                to="/products"
                style={{
                  background: '#0f172a',
                  color: '#fff',
                  padding: '.75rem 1.35rem',
                  borderRadius: '9999px',
                  fontWeight: 600,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '.3rem',
                  boxShadow: '0 18px 38px rgba(15,23,42,0.18)',
                }}
              >
                Shop now <span aria-hidden>→</span>
              </Link>
              <Link
                to="/register"
                style={{
                  background: 'transparent',
                  color: '#0f172a',
                  padding: '.75rem 1.05rem',
                  borderRadius: '9999px',
                  fontWeight: 500,
                  textDecoration: 'none',
                  border: '1px solid rgba(15,23,42,.09)',
                }}
              >
                Create account
              </Link>
              <div style={{ display: 'flex', gap: '.75rem', alignItems: 'center' }}>
                <div style={{ height: '2.4rem', width: '2.4rem', borderRadius: '9999px', background: '#fff', border: '1px solid rgba(148,163,184,.3)' }}></div>
                <div>
                  <p style={{ fontSize: '.65rem', color: '#94a3b8' }}>Trusted by over</p>
                  <p style={{ fontSize: '.78rem', color: '#0f172a', fontWeight: 600 }}>12,400+ shoppers</p>
                </div>
              </div>
            </div>
            {/* Stat bar */}
            <div
              style={{
                display: 'flex',
                gap: '1.5rem',
                marginTop: '2.3rem',
                flexWrap: 'wrap',
              }}
            >
              {[
                { label: 'New arrivals', value: '120+' },
                { label: '5‑star reviews', value: '3.2k' },
                { label: 'Avg. delivery', value: '2‑4 days' },
              ].map((item, i) => (
                <div key={i} style={{ minWidth: '7rem' }}>
                  <p style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0f172a' }}>{item.value}</p>
                  <p style={{ fontSize: '.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.08em' }}>{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right side hero card */}
          <div
            style={{
              background: 'linear-gradient(165deg, rgba(15,23,42,1) 0%, rgba(15,23,42,0) 100%), url(https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=850&q=60) center/cover no-repeat',
              borderRadius: '1.5rem',
              minHeight: '320px',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 18px 40px rgba(15,23,42,0.18)',
            }}
          >
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(15,23,42,0.05) 0%, rgba(15,23,42,1) 100%)' }}></div>
            <div style={{ position: 'relative', padding: '1.4rem 1.4rem 1.1rem', color: '#fff', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: '.65rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,.6)' }}>This week’s pick</p>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 700, marginTop: '.4rem' }}>Streetwear Essentials</h2>
                <p style={{ fontSize: '.77rem', color: 'rgba(255,255,255,.6)', marginTop: '.45rem', maxWidth: '15rem' }}>
                  Up to 35% off on sneakers, hoodies, and accessories.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '.65rem', alignItems: 'center' }}>
                <span style={{ fontSize: '1.65rem', fontWeight: 700 }}>$59</span>
                <span style={{ fontSize: '.68rem', textDecoration: 'line-through', color: 'rgba(255,255,255,.35)' }}>$92</span>
                <span style={{ fontSize: '.62rem', background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.12)', borderRadius: '9999px', padding: '.25rem .6rem' }}>Bestseller</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits strip */}
      <section style={{ background: '#fff', borderBottom: '1px solid rgba(15,23,42,.03)' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '1rem 1.25rem', display: 'flex', gap: '1rem', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          {[
            { title: 'Free shipping over $50', desc: 'Fast, tracked delivery' },
            { title: 'Secure payments', desc: 'SSL, 3D secure supported' },
            { title: '30‑day returns', desc: 'No questions asked' },
            { title: '24/7 support', desc: 'Chat with our team' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: '.65rem', alignItems: 'center', minWidth: '12rem' }}>
              <div style={{ height: '2.2rem', width: '2.2rem', borderRadius: '.85rem', background: 'rgba(15,23,42,.05)' }}></div>
              <div>
                <p style={{ fontSize: '.8rem', fontWeight: 600, color: '#0f172a' }}>{item.title}</p>
                <p style={{ fontSize: '.65rem', color: '#94a3b8' }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section style={{ maxWidth: '1180px', margin: '0 auto', padding: '3.5rem 1.25rem 4.2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.6rem', gap: '1rem' }}>
          <div>
            <p style={{ fontSize: '.65rem', letterSpacing: '.1em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '.3rem' }}>Featured</p>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 700, color: '#0f172a' }}>Best picks for you</h2>
          </div>
          <Link to="/products" style={{ fontSize: '.75rem', color: '#0f172a', textDecoration: 'none', fontWeight: 500 }}>View all →</Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3.2rem 1rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '9999px', border: '3px solid #e2e8f0', borderTopColor: '#0f172a', margin: '0 auto', animation: 'spin 1s linear infinite' }}></div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1.5rem' }}>
            {featured.map((product) => (
              <Link
                key={product._id}
                to={`/products/${product._id}`}
                style={{
                  background: '#fff',
                  border: '1px solid rgba(148,163,184,0.18)',
                  borderRadius: '1.25rem',
                  overflow: 'hidden',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'transform .15s ease, box-shadow .15s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  minHeight: '260px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 16px 40px rgba(15,23,42,0.06)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ position: 'relative', padding: '.9rem .9rem 0' }}>
                  <img
                    src={product.image || 'https://picsum.photos/300/200'}
                    alt={product.name}
                    style={{ width: '100%', height: '170px', objectFit: 'cover', borderRadius: '1rem' }}
                  />
                  <span style={{ position: 'absolute', top: '1.3rem', left: '1.3rem', background: 'rgba(15,23,42,.8)', color: '#fff', fontSize: '.6rem', padding: '.25rem .5rem', borderRadius: '9999px', textTransform: 'uppercase', letterSpacing: '.05em' }}>
                    New
                  </span>
                </div>
                <div style={{ padding: '1rem .95rem 1.1rem', display: 'flex', flexDirection: 'column', gap: '.4rem', flex: 1 }}>
                  <p style={{ fontSize: '.7rem', textTransform: 'uppercase', letterSpacing: '.08em', color: '#94a3b8' }}>{product.category || 'General'}</p>
                  <h3 style={{ fontSize: '.95rem', fontWeight: 600, color: '#0f172a' }}>{product.name}</h3>
                  <p style={{ fontSize: '.72rem', color: '#94a3b8', flexGrow: 1 }}>
                    {(product.description && product.description.slice(0, 50) + (product.description.length > 50 ? '…' : '')) || 'Top‑rated product this month.'}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '.35rem' }}>
                    <span style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>${product.price}</span>
                    <span style={{ fontSize: '.7rem', background: 'rgba(15,23,42,.03)', border: '1px solid rgba(15,23,42,.06)', padding: '.25rem .6rem', borderRadius: '9999px', color: '#0f172a' }}>View →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* CTA footer */}
      <section style={{ background: '#0f172a', color: '#fff', padding: '3.5rem 1.25rem 4.5rem', marginTop: '1rem' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
            <p style={{ fontSize: '.65rem', textTransform: 'uppercase', letterSpacing: '.08em', color: 'rgba(255,255,255,.55)' }}>Join our community</p>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginTop: '.4rem' }}>Get exclusive offers & early access.</h2>
            <p style={{ fontSize: '.8rem', color: 'rgba(255,255,255,.7)', marginTop: '.35rem' }}>We send 1–2 emails per month. No spam.</p>
          </div>
          <form style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
            <input
              type="email"
              placeholder="Enter your email"
              style={{
                background: 'rgba(15,23,42,0.35)',
                border: '1px solid rgba(255,255,255,.04)',
                borderRadius: '9999px',
                padding: '.55rem 1rem',
                minWidth: '220px',
                color: '#fff',
                outline: 'none',
              }}
            />
            <button type="submit" style={{ background: '#fff', color: '#0f172a', border: 'none', borderRadius: '9999px', padding: '.55rem 1.05rem', fontWeight: 600, cursor: 'pointer' }}>
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* Spinner animation keyframes */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @media (max-width: 960px) {
          section:first-of-type > div {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;