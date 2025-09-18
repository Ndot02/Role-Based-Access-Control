import { EntitySchema } from "typeorm";

export const Profile = new EntitySchema({
  name: "Profile",
  tableName: "profile",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    profilePicture: { type: "varchar" },
    bio: { type: "text", nullable: true },
    phoneNumber: { type: "varchar",nullable:true },
    address: { type: "varchar",nullable:true },
    dateOfBirth: { type: "date",nullable:true },
  },
  relations: {
    user: {
      type: "one-to-one",
      target: "User",
      joinColumn: true,
      
    },
  },
});
