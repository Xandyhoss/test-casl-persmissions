import {
  AbilityBuilder,
  createMongoAbility,
  PureAbility,
  subject,
} from "@casl/ability";
import { z } from "zod";

type Role = "ADMIN" | "USER";

export interface User {
  id: number;
  userType: Role;
  adminOrg: boolean;
}

//BILLING PERMISSIONS---------------------------------
const billingTypeName = z.literal("Billing");
const billingSchema = z.object({ authorId: z.number() });
const billingSubject = z.tuple([
  z.union([z.literal("manage"), z.literal("read"), z.literal("export")]),
  z.union([billingTypeName, billingSchema]),
]);

/////////////////////////////////////////////////////

//PROJECT PERMISSIONS---------------------------------
const projectsTypeName = z.literal("Project");
const projectSchema = z.object({ adminOrg: z.boolean(), authorId: z.number().optional() });
const projectsSubject = z.tuple([
  z.union([z.literal("read"), z.literal("create"), z.literal("delete")]),
  z.union([projectsTypeName, projectSchema]),
]);

//////////////////////////////////////////////////////

const subjectNames = z.union([billingTypeName, projectsTypeName]);
const subjectSchemas = z.union([billingSchema, projectSchema]);

const appAbilities = z.union([
  projectsSubject,
  billingSubject,
  z.tuple([z.literal("manage"), z.literal("all")]),
]);
type AppAbilities = z.infer<typeof appAbilities>;

import { ForcedSubject } from "@casl/ability";

type AppAbility = PureAbility<AppAbilities | [string, ForcedSubject<string>]>;

type UserPermissions = (
  user: User,
  abilities: AbilityBuilder<AppAbility>
) => void;

const permissions: Record<Role, UserPermissions> = {
  ADMIN(user, { can }) {
    can("export", "Billing", { authorId: user.id });
    can("create", "Project", { adminOrg: user.adminOrg, authorId: user.id });
  },
  USER(user, { can }) {
    can("export", "Billing", { authorId: user.id });
  },
};

export const getUserPermissionsUpdate = (user: User) => {
  const abilities = new AbilityBuilder<AppAbility>(createMongoAbility);
  permissions[user.userType](user, abilities);
  return abilities.build();
};

export const getSubject = (
  name: z.infer<typeof subjectNames>,
  conditions: z.infer<typeof subjectSchemas>
) => {
  return subject(name, conditions);
};
