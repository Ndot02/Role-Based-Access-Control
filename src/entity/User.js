import { EntitySchema } from "typeorm"

 export const User = new EntitySchema({
  name: "User",
  tableName: "user",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true
    },
    name: {
      type: "varchar",
     
    },
    email: {
      type: "varchar",
      unique: true,
      
    },
    password: {
      type: "varchar",
      
    },
    
    
  },
  relations: {
    role: {
      target: "Role",
      type: "many-to-one",
      joinColumn: { name: "roleId" },
    }
  }
});


