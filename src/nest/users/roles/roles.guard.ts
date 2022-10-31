import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { Role } from './role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        console.log(`requiredRoles: ${JSON.stringify(requiredRoles)}`);
        if (!requiredRoles || this.onlyGuest(requiredRoles)) {
            return true; // a method or a controller may be used without any permissions
        }
        const { user } = context.switchToHttp().getRequest();
        const result = requiredRoles.some((role) => {
            console.log(`user? ${JSON.stringify(user)}`);
            user?.roles?.includes(role);
        });
        if (!result) {
            throw new ForbiddenException('Forbidden.', 'Not allowed role.');
        } else return true;
    }

    private onlyGuest(requiredRoles: Role[]): boolean {
        return requiredRoles.length == 1 && requiredRoles.pop() == Role.Guest;
    }
}

