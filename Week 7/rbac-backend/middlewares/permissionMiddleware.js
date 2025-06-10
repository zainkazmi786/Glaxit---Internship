
// ===== middlewares/permissionMiddleware.js =====
const checkPermission = (requiredPermission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    const userPermissions = req.user.getPermissions();
    
    if (!userPermissions.includes(requiredPermission)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required permission: ${requiredPermission}`
      });
    }

    next();
  };
};

const checkRole = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    const userRoles = req.user.roles.map(role => role.name);
    
    if (!userRoles.includes(requiredRole)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${requiredRole}`
      });
    }

    next();
  };
};

module.exports = {
  checkPermission,
  checkRole
};
