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
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '100px 20px',
        textAlign: 'center',
        borderRadius: '0 0 50px 50px',
        marginBottom: '60px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: 'bold',
            marginBottom: '20px',
            textShadow: '0 4px 10px rgba(0,0,0,0.3)'
          }}>
            Welcome to ShopHub
          </h1>
          <p style={{
            fontSize: '1.3rem',
            marginBottom: '30px',
            opacity: 0.9
          }}>
            Discover amazing products at unbeatable prices
          </p>
          <Link
            to="/products"
            style={{
              background: 'white',
              color: '#667eea',
              padding: '15px 40px',
              borderRadius: '50px',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              textDecoration: 'none',
              display: 'inline-block',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
              transition: 'all 0.3s'
            }}
            onMouseEnter={e => {
              e.target.style.transform = 'translateY(-3px)';
              e.target.style.boxShadow = '0 15px 35px rgba(0,0,0,0.3)';
            }}
            onMouseLeave={e => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
            }}
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '60px 20px', background: '#f8f9fa' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '50px', color: '#333' }}>
            Why Choose Us?
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '30px'
          }}>
            {[
              { icon: 'Fast Delivery', title: 'Free Shipping', desc: 'On orders over $50' },
              { icon: 'Secure Payment', title: 'Secure Checkout', desc: '100% protected' },
              { icon: 'Support', title: '24/7 Support', desc: 'We\'re here to help' },
              { icon: 'Returns', title: 'Easy Returns', desc: '30-day guarantee' }
            ].map((feature, i) => (
              <div
                key={i}
                style={{
                  background: 'white',
                  padding: '30px',
                  borderRadius: '16px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                  transition: 'transform 0.3s'
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-10px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{
                  fontSize: '3rem',
                  marginBottom: '15px'
                }}>{feature.icon}</div>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '10px' }}>{feature.title}</h3>
                <p style={{ color: '#666' }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section style={{ padding: '80px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '2.2rem', textAlign: 'center', marginBottom: '50px', color: '#333' }}>
          Featured Products
        </h2>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <div style={{
              display: 'inline-block',
              width: '50px',
              height: '50px',
              border: '5px solid #f3f3f3',
              borderTop: '5px solid #667eea',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '30px'
          }}>
            {featured.map(product => (
              <Link
                key={product._id}
                to={`/products/${product._id}`}
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  background: 'white',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-10px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
                }}
              >
                <img
                  src={product.image || 'https://picsum.photos/300/200'}
                  alt={product.name}
                  style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover'
                  }}
                />
                <div style={{ padding: '20px' }}>
                  <h3 style={{ fontSize: '1.3rem', marginBottom: '10px', color: '#333' }}>
                    {product.name}
                  </h3>
                  <p style={{ color: '#666', marginBottom: '15px', height: '40px', overflow: 'hidden' }}>
                    {product.description?.substring(0, 60)}...
                  </p>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{
                      fontSize: '1.4rem',
                      fontWeight: 'bold',
                      color: '#667eea'
                    }}>
                      ${product.price}
                    </span>
                    <span style={{
                      background: '#e0e7ff',
                      color: '#667eea',
                      padding: '5px 12px',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: '500'
                    }}>
                      View Details
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <Link
            to="/products"
            style={{
              background: '#667eea',
              color: 'white',
              padding: '15px 40px',
              borderRadius: '50px',
              fontWeight: 'bold',
              textDecoration: 'none',
              display: 'inline-block',
              fontSize: '1.1rem',
              boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
              transition: 'all 0.3s'
            }}
            onMouseEnter={e => e.target.style.transform = 'translateY(-3px)'}
            onMouseLeave={e => e.target.style.transform = 'translateY(0)'}
          >
            View All Products
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        background: '#1a1a2e',
        color: 'white',
        padding: '80px 20px',
        textAlign: 'center',
        marginTop: '80px'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>
            Ready to Start Shopping?
          </h2>
          <p style={{ fontSize: '1.2rem', marginBottom: '30px', opacity: 0.8 }}>
            Join thousands of happy customers today
          </p>
          <Link
            to="/register"
            style={{
              background: '#ff6b6b',
              color: 'white',
              padding: '15px 40px',
              borderRadius: '50px',
              fontWeight: 'bold',
              textDecoration: 'none',
              fontSize: '1.1rem',
              display: 'inline-block'
            }}
          >
            Create Free Account
          </Link>
        </div>
      </section>

      {/* Spinner Animation */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Home;