const jwt = require('jsonwebtoken');

// middleware to authenticate JWT in Authorization header (Bearer <token>)
const auth = (req, res, next) => {
  const header = req.headers['authorization'];
  const token = header && header.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

// middleware factory to require a specific role (e.g., 'admin')
const requireRole = (role) => (req, res, next) => {
  // Ensure user is attached by auth middleware
  if (!req.user) return res.status(401).json({ message: 'Access denied' });
  // Support user.role being a string or array
  const userRole = req.user.role;
  const hasRole = Array.isArray(userRole) ? userRole.includes(role) : userRole === role;
  if (!hasRole) return res.status(403).json({ message: 'Forbidden: insufficient role' });
  next();
};

module.exports = { auth, requireRole };