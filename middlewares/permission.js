export function permission(permit) {
  const permitSet = new Set(permit);
  return (req, res, next) => {
    const userPermissions = req.user?.permissions || [];
    const hasAccess = userPermissions.some((permission) => {
      return permitSet.has(permission);
    });
    if (!hasAccess) {
      return res.sendError({statusCode:403,message:"you don't have access to this part"})
    }
    next();
  };
}
