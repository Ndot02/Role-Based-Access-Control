export  const requireRole=(roleName)=> {
  return async function(ctx, next) {
    const user = ctx.state.user;
    if (!user || !user.role) {
      ctx.status = 403;
      ctx.body = { success: false, message: "Forbidden" };
      return;
    }
    if (user.role !== roleName) {
      ctx.status = 403;
      ctx.body = { success: false, message: "Forbidden" };
      return;
    }
    await next();
  };
};
