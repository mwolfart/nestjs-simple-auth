import { AbilityBuilder, PureAbility } from '@casl/ability';
import { createPrismaAbility, PrismaQuery, Subjects } from '@casl/prisma';
import { Injectable, Scope } from '@nestjs/common';
import { Post, Role, User } from '@prisma/client';

export type PermissionActions =
  | 'manage'
  | 'create'
  | 'read'
  | 'update'
  | 'delete';

export type PermissionResource = Subjects<{ User: User; Post: Post }> | 'all';

export type AppAbility = PureAbility<
  [PermissionActions, PermissionResource],
  PrismaQuery
>;

export type DefinePermissions = (
  user: User,
  builder: AbilityBuilder<AppAbility>,
) => void;

// TODO: Persist permissions in the database
const rolePermissionsMap: Record<Role, DefinePermissions> = {
  ADMIN: (user, { can }) => {
    can('manage', 'all');
  },
  READER: (user, { can }) => {
    can('read', 'Post', { published: true });
  },
  EDITOR: (user, { can }) => {
    can('read', 'Post');
    can('create', 'Post');
    can('update', 'Post');
  },
  WRITER: (user, { can }) => {
    can('read', 'Post', { OR: [{ published: true }, { authorId: user.id }] });
    can('create', 'Post');
    can('update', 'Post', { authorId: user.id });
    can('delete', 'Post', { authorId: user.id });
  },
};

@Injectable({ scope: Scope.REQUEST })
export class CaslAbilityService {
  ability: AppAbility;

  createForUser(user: User) {
    const builder = new AbilityBuilder<AppAbility>(createPrismaAbility);
    rolePermissionsMap[user.role](user, builder);
    this.ability = builder.build();
    return this.ability;
  }
}
