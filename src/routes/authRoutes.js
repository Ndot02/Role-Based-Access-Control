import Router from "@koa/router";
import { register, login } from"../controllers/authController.js";

const router = new Router({ prefix: "/auth" });

router.post("/register", register);
router.post("/login", login);

export default router;
