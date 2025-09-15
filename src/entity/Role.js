import { EntitySchema } from "typeorm";

export const Role = new EntitySchema({
  name: "Role",
  tableName: "role",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    name: {
      type: "varchar",
      unique: true,
      
    },
  },
  relations: {
    users: {
      target: "User",         // link to User entity
      type: "one-to-many",    // one role → many users
      inverseSide: "role",    // points to `role` relation in User
    },
  },
});
