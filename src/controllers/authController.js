import jwt from "jsonwebtoken";
import { loginSchema, registerSchema } from "../utils/validators.js";
import * as userService from "../services/userService.js";
import "dotenv/config";
import { generateOtp, getExpiry } from "../utils/otpUtil.js";
import { sendOtpEmail } from "../utils/emailUtil.js";
import bcrypt from "bcrypt"
const JWT_SECRET = process.env.JWT_SECRET ;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ;
import { AppDataSource } from "../data-source.js";

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
  console.log("JWT_SECRET:", process.env.JWT_SECRET);

};

export const forgotPassword = async (ctx) => {
  const { email } = ctx.request.body;
  const userRepo = AppDataSource.getRepository("User");
  const otpRepo = AppDataSource.getRepository("Otp"); // create OTP table in DB

  const user = await userRepo.findOne({ where: { email } });
  if (!user) return ctx.throw(404, "User not found");

  const otp = generateOtp();
  const expiresAt = getExpiry();
  await otpRepo.save({ email, otp, expiresAt });

  await sendOtpEmail(email, otp);
  ctx.body = { success: true, message: "OTP sent to email" };
};

export const resetPassword = async (ctx) => {
  const { email, otp, newPassword } = ctx.request.body;
  const userRepo = AppDataSource.getRepository("User");
  const otpRepo = AppDataSource.getRepository("Otp");

  const record = await otpRepo.findOne({ where: { email, otp } });
  if (!record || record.expiresAt < Date.now()) return ctx.throw(400, "Invalid or expired OTP");

  const user = await userRepo.findOne({ where: { email } });
  user.password = await bcrypt.hash(newPassword, 10);
  await userRepo.save(user);

  await otpRepo.delete({ email });
  ctx.body = { success: true, message: "Password reset successful" };
};

export{register,login}