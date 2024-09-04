// middleware/roleMiddleware.js
const boom = require('@hapi/boom');
const { getUserRolePermissions } = require('../../api/Role/service');

const permissionCheck = (requiredPermissions) => {
  return async (req, res, next) => {
    try {
      const userRole = req.user.role;
      console.log(userRole,"role");
      
      const userPermissions = await getUserRolePermissions(userRole);

console.log(userPermissions,"userPermissions");

      const hasPermission = requiredPermissions.every((permission) =>
        userPermissions.includes(permission)
      );

      if (!hasPermission) {
        return next(boom.forbidden('You do not have permission to perform this action.'));
      }

      next();
    } catch (error) {
      console.error(error.message);
      return next(boom.internal('Failed to check permissions.'));
    }
  };
};

module.exports = { permissionCheck };
