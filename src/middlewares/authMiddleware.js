import jwt from "jsonwebtoken";
import "dotenv/config";
const JWT_SECRET = process.env.JWT_SECRET;

export const jwtAuth = async (ctx, next) => {
  const authHeader = ctx.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    ctx.status = 401;
    ctx.body = { success: false, message: "Authorization token missing" };
    return;
  }
  const token = authHeader.split(" ")[1];

  // console.log("Received Token:", token);
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // console.log("Decoded:", decoded);
    // attach to state
    ctx.state.user = decoded; // { userId, role, iat, exp }
    // console.log("ctx.state.user at route:", ctx.state.user);
    await next();
  } catch (err) {
    ctx.status = 401;
    ctx.body = { success: false, message: "Invalid or expired token" };
  }
  //console.log("jwt_sectet:",JWT_SECRET)
};
