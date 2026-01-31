import "reflect-metadata";

import { registerEnumType } from "type-graphql";

export enum Roles {
  Admin = "admin",
  Stu = "stu",
}

registerEnumType(Roles, {
  name: "Roles",
});
