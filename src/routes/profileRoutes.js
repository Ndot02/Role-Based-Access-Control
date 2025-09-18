import Router from "@koa/router";
import { updateProfile } from "../controllers/profileController.js";
import { jwtAuth } from "../middlewares/authMiddleware.js";
import {  uploadSingle } from "../middlewares/multerMiddleware.js";

const router = new Router();

router.put("/api/profile/update", jwtAuth, uploadSingle("profilePicture"), updateProfile);

export default router;
