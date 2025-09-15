import * as userService from "../services/userService.js"

export const getProfile=async(ctx)=> {
  // ctx.state.user is set by auth middleware
  const auth = ctx.state.user;
  if (!auth) {
    ctx.status = 401;
    ctx.body = { success: false, message: "Unauthorized" };
    return;
  }

  const user = await userService.findById(auth.userId);
  if (!user) {
    ctx.status = 404;
    ctx.body = { success: false, message: "User not found" };
    return;
  }
  // strip password
  const { password, ...safe } = user;
  ctx.body = { success: true, user: safe };
}

export const getAllUsers=async(ctx)=> {
  const users = await userService.getAllUser();
  
  ctx.body = { success: true, users };
}


