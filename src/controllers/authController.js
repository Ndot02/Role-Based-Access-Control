import jwt from "jsonwebtoken";
import { loginSchema, registerSchema } from "../utils/validators.js";
import * as userService from "../services/userService.js";
import "dotenv/config";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";


const register = async (ctx) => {
  try {
    const payload = ctx.request.body || {};
    await registerSchema.validate(payload, { abortEarly: false });

    // default role is User unless specified and permitted by caller
    const safeRole = payload.role || "User";
console.log(payload.role) //Admin
    // create user (service validates duplicates)
    const user = await userService.createUser({
      name: payload.name,
      email: payload.email.toLowerCase(),
      password: payload.password,
      roleName: safeRole,
    });
    console.log(user)

    ctx.status = 201;
    ctx.body = { success: true, user };
  } catch (err) {
    // validation errors from yup
    if (err.name === "ValidationError") {
      ctx.status = 400;
      ctx.body = { success: false, errors: err.errors };
      return;
    }
    // custom errors
    ctx.status = err.status || 500;
    // avoid leaking internal details
    ctx.body = {
      success: false,
      message: ctx.status === 500 ? "Internal server error" : err.message,
    };
  }
};

const login = async (ctx) => {
  try {
    const payload = ctx.request.body || {};
    await loginSchema.validate(payload, { abortEarly: false });

    const email = (payload.email || "").toLowerCase();
    const user = await userService.findByEmail(email);

    // Always return generic message on failure to avoid leaking whether email exists
    const genericErr = () => {
      ctx.status = 401;
      ctx.body = { success: false, message: "Invalid credentials" };
    };

    if (!user) {
      return genericErr();
    }

    const valid = await userService.checkPassword(user, payload.password);
    if (!valid) {
      return genericErr();
    }

    // Build token payload - only minimal info
    const tokenPayload = {
      userId: user.id,
      role: user.role ? user.role.name : "User",
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    // safe user info
    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role ? user.role.name : "User",
    };

    ctx.body = { success: true, token, user: safeUser };
  } catch (err) {
    if (err.name === "ValidationError") {
      ctx.status = 400;
      ctx.body = { success: false, errors: err.errors };
      return;
    }
    ctx.status = err.status || 500;
    ctx.body = {
      success: false,
      message: ctx.status === 500 ? "Internal server error" : err.message,
    };
  }
};

export{register,login}