import bcrypt from "bcrypt";
import { AppDataSource } from "../data-source.js";

import "dotenv/config";

const SALT_ROUNDS = 10;

const getRoleRepository = () => AppDataSource.getRepository("Role");
const getUserRepository = () => AppDataSource.getRepository("User");

const createUser = async ({ name, email, password, roleName}) => {
  const userRepo = getUserRepository();
  const roleRepo = getRoleRepository();

  const existing = await userRepo.findOne({ where: { email } });
  if (existing) {
    const err = new Error("Email already in use");
    err.status = 400;
    throw err;
  }
  const role = await roleRepo.findOne({ where: { name: roleName } });
  if (!role) {
    const err = new Error("Role doesnot exist");
    err.status = 400;
    throw err;
  }

  const hashed = await bcrypt.hash(password, SALT_ROUNDS);

  const user = userRepo.create({
    name,
    email,
    password: hashed,
    role: role,
    roleId: role.id,
  });
  const saved = await userRepo.save(user);
  delete saved.password;
  return saved;
};

const findByEmail = async (email) => {
  return await AppDataSource.getRepository("User").findOne({
    where: { email },
    relations: ["role"], // load role relation
  });
};

const findById = async (id) => {
  return await AppDataSource.getRepository("User").findOne({
    where: { id },
    relations: ["role"], // load role relation
  });
};

const checkPassword = async (user, password) => {
  return bcrypt.compare(password, user.password);
};

const getAllUser = async () => {
  const userRepo = getUserRepository();
  const users = await userRepo.find({ relations: ["role"] });
  console.log(users)

  //remove password field

  return users.map((u) => {
    const { password, ...safe } = u;
    return safe;
  });
};


export {findByEmail,findById,checkPassword,createUser,getAllUser}