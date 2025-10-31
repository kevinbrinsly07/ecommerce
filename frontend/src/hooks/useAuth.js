import { useState } from 'react';
import { jwtDecode } from 'jwt-decode'; // Correct import
import axios from 'axios';

const useAuth = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const login = async (username, password) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { username, password });
      const newToken = res.data.token;
      localStorage.setItem('token', newToken);
      setToken(newToken);
    } catch (err) {
      console.error('Login failed:', err.response?.data || err.message);
      throw err;
    }
  };

  const register = async (username, password) => {
    try {
      await axios.post('http://localhost:5000/api/auth/register', { username, password });
      await login(username, password); // Auto-login
    } catch (err) {
      console.error('Register failed:', err.response?.data || err.message);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  const getUserId = () => {
    if (!token) return null;
    try {
      const decoded = jwtDecode(token);
      return decoded.id;
    } catch (err) {
      console.error('Invalid token');
      return null;
    }
  };

  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

  return { token, login, register, logout, getUserId, config };
};

export default useAuth;