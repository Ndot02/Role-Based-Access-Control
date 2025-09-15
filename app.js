import Koa from "koa";
import bodyParser from "koa-bodyparser";
import {errorHandler} from "./src/middlewares/errorHandler.js";
import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import "dotenv/config";

import { AppDataSource } from "./src/data-source.js";

import { Role } from "./src/entity/Role.js";

const app = new Koa();
const RoleEntity = Role;


app.use(errorHandler);
app.use(bodyParser());

// init db and seed roles
AppDataSource.initialize()
  .then(async () => {
    console.log("DB connected");

    const roleRepo = AppDataSource.getRepository("Role");
    const existing = await roleRepo.count();
    if (existing === 0) {
      await roleRepo.save([{ name: "Admin" }, { name: "User" }]);
      console.log("Seeded roles: Admin, User");
    }
  })
  .catch((err) => {
    console.error("DB init error", err);
    process.exit(1);
  });

// mount routes
app.use(authRoutes.routes()).use(authRoutes.allowedMethods());
app.use(userRoutes.routes()).use(userRoutes.allowedMethods());


console.log("Registered auth routes:");
authRoutes.stack.forEach(r => console.log(`${r.methods} ${r.path}`));

console.log("Registered user routes:");
userRoutes.stack.forEach(r => console.log(`${r.methods} ${r.path}`));


// basic root
app.use(async (ctx, next) => {
  if (ctx.path === "/" && ctx.method === "GET") {
    ctx.body = { message: "Koa Auth API running" };
    return;
  }
  await next();
});
app.use(async ctx => {
  if (ctx.path === "/ping") {
    ctx.body = "pong";
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
