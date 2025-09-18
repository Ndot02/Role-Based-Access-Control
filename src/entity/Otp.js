import { EntitySchema } from "typeorm";

export const Otp = new EntitySchema({
  name: "Otp",
  tableName: "otps",
  columns: {
    id: { type: "int", primary: true, generated: true },
    email: { type: "varchar" },
    otp: { type: "varchar" },           // store as string
    expiresAt: { type: "bigint" }      // store timestamp
  }
});
