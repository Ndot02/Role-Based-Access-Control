import Router from "@koa/router";
import { register, login, forgotPassword, resetPassword } from"../controllers/authController.js";

const router = new Router({ prefix: "/auth" });

router.post("/register", register);
router.post("/login", login);

router.post("/forgot-password", forgotPassword);

// Verify OTP & reset password
router.post("/reset-password", resetPassword);
export default router;
