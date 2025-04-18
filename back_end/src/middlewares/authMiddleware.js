
const { verifyToken } = require('../utils/jwtUtils');

const authMiddleware = (requiredRole) => {
  return (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ message: 'Authentication failed' });
      }

      const decoded = verifyToken(token);
      req.userData = decoded;

      if (requiredRole && decoded.role !== requiredRole) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: 'Authentication failed' });
    }
  };
};

module.exports = authMiddleware;