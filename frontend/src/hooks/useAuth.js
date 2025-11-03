import React, { useState } from 'react';
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

  // small JWT payload decoder (browser). Avoids external jwt-decode import.
  const decodeJwt = (t) => {
    if (!t) return null;
    try {
      const payload = t.split('.')[1];
      if (!payload) return null;
      // base64url -> base64
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      // atob -> percent-encoding -> decodeURIComponent for unicode safety
      const json = decodeURIComponent(Array.prototype.map.call(atob(base64), (c) => '%'+('00'+c.charCodeAt(0).toString(16)).slice(-2)).join(''));
      return JSON.parse(json);
    } catch (err) {
      console.error('Failed to decode token', err);
      return null;
    }
  };

  const getUserId = () => {
    const decoded = decodeJwt(token);
    return decoded?.id || null;
  };

  const getUser = () => decodeJwt(token);

  const getUserRole = () => {
    const user = getUser();
    return user?.role || null;
  };

  // Memoize config so it doesn't change on every render
  const config = React.useMemo(() => (
    token ? { headers: { Authorization: `Bearer ${token}` } } : {}
  ), [token]);

  return { token, login, register, logout, getUserId, getUser, getUserRole, config };
};

export default useAuth;