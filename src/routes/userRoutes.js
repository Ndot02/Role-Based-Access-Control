import Router from "@koa/router";
import { jwtAuth } from "../middlewares/authMiddleware.js";
import {requireRole} from "../middlewares/requireRole.js";
import { getProfile, getAllUsers } from "../controllers/userController.js";

const router = new Router();

router.get("/profile", jwtAuth, getProfile);
router.get("/users", jwtAuth, requireRole("Admin"), getAllUsers);

export default router;
