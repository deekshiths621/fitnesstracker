const { createError } = require("../error.js");

// Check if user is authenticated
const requireAuth = (req, res, next) => {
  if (!req.user || !req.user.id) {
    return next(createError(401, "User not authenticated"));
  }
  next();
};

// Check if user is admin
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return next(createError(403, "Admin access required"));
  }
  next();
};

module.exports = {
  requireAuth,
  requireAdmin,
};
