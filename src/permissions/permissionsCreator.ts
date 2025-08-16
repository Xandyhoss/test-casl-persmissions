import { AbilityBuilder, createMongoAbility, PureAbility } from "@casl/ability";

type Role = "ADMIN" | "USER";
export interface User {
  id: number;
  userType: "ADMIN" | "USER";
}

type Actions = "create" | "read" | "delete";
type Subjects = "Posts" | "Users";
export type AppAbility = PureAbility<[Actions, Subjects]>;

type UserPermissions = (
  user: User,
  abilities: AbilityBuilder<AppAbility>
) => void;

const permissions: Record<Role, UserPermissions> = {
  ADMIN(_, { can, cannot }) {
    can("create", "Users");
    can("delete", "Users");
    can("read", "Posts");
    cannot("create", "Posts");
    cannot("delete", "Posts");
  },
  USER(_, { can }) {
    can("create", "Posts");
    can("delete", "Posts");
    can("read", "Posts");
  },
};

export const getUserPermissions = (user: User) => {
  const abilities = new AbilityBuilder<AppAbility>(createMongoAbility);
  permissions[user.userType](user, abilities);
  return abilities.build();
};
