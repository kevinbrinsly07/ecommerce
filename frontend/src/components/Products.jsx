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
    <div>
      <h2>Products</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {products.map(product => (
          <li
            key={product._id} // Use MongoDB _id
            style={{
              border: '1px solid #ddd',
              margin: '10px',
              padding: '10px',
              borderRadius: '8px',
              display: 'inline-block',
              width: '200px'
            }}
          >
            <Link to={`/products/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <img
                src={product.image || 'https://via.placeholder.com/150'}
                alt={product.name}
                style={{ width: '100%', height: '150px', objectFit: 'cover' }}
              />
              <p><strong>{product.name}</strong></p>
              <p>${product.price}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Products;