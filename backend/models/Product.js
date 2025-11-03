import React, { useEffect, useState } from 'react';
import placeholder from '../assets/placeholder.jpg';

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error(err));
  }, []);

  const getImageSrc = (img) => {
    if (!img) return placeholder;
    if (img.includes('via.placeholder.com')) return placeholder;
    if (img.includes('picsum.photos')) return placeholder;
    if (img.startsWith('http') || img.startsWith('/')) return img;
    return placeholder;
  };

  return (
    <div>
      <h1>Featured Products</h1>
      <div className="products-grid">
        {products.map((product) => (
          <div key={product._id} className="product-card">
            <img
              src={getImageSrc(product.image)}
              alt={product.name}
              className="h-40 w-full object-cover rounded-xl"
            />
            <h2>{product.name}</h2>
            <p>${product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;