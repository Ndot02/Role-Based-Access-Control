import jwt from "jsonwebtoken";
import "dotenv/config";
const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret";

export const jwtAuth=async(ctx, next)=> {
  const authHeader = ctx.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    ctx.status = 401;
    ctx.body = { success: false, message: "Authorization token missing" };
    return;
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // attach to state
    ctx.state.user = decoded; // { userId, role, iat, exp }
    await next();
  } catch (err) {
    ctx.status = 401;
    ctx.body = { success: false, message: "Invalid or expired token" };
  }
};
