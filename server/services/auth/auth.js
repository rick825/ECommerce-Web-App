const jwt = require('jsonwebtoken');
const { Admin } = require('../model/model');
const secretkey = process.env.SESSION_SECRET;

const authenticateAdmin = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Authentication failed. No token provided.' });
    }

    const decoded = jwt.verify(token, secretkey);
    const admin = await Admin.findById(decoded.user);
    
    if (!admin) {
      return res.status(401).json({ message: 'Authentication failed. Admin not found.' });
    }

    req.admin = admin;
    next();
  } catch (error) {
    console.log('Error in authentication middleware:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Middleware to check admin role
const authorizeAdminRole = (roles) => {
  return (req, res, next) => {
    if (roles.includes(req.admin.role)) {
      next();
    } else {
      return res.status(403).json({ message: 'Forbidden. You do not have the required role.' });
    }
  };
};

module.exports = {
  authenticateAdmin,
  authorizeAdminRole,
};
