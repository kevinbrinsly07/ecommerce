import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import useAuth from '../hooks/useAuth';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { token, config } = useAuth();

  useEffect(() => {
    axios.get(`http://localhost:5000/api/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => console.error(err));
  }, [id]);

  const addToCart = async () => {
    if (!token) return alert('Please login');
    try {
      await axios.post('http://localhost:5000/api/cart/add', { productId: id, quantity: 1 }, config);
      alert('Added to cart!');
    } catch (err) {
      alert(err.response?.data?.message || 'Error');
    }
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div>
      <h2>{product.name}</h2>
      <img src={product.image} alt={product.name} />
      <p>{product.description}</p>
      <p>${product.price}</p>
      <button onClick={addToCart}>Add to Cart</button>
    </div>
  );
};

export default ProductDetail;