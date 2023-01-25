import { SetMetadata } from '@nestjs/common';
import { Role } from './roles.enum';

/**
 * @see https://docs.nestjs.com/security/authorization
 */
export const ROLES_KEY = 'RolesKey';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
