import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";

import { User } from "./entity/User.js";
import { Role } from "./entity/Role.js";
import { Profile } from "./entity/Profile.js";
import { Otp } from "./entity/Otp.js";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  synchronize: true,
  logging: ["error"],
  entities: [User, Role,Profile,Otp],
});