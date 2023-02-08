import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Inject,
    Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from './roles.enum';
import { ROLES_KEY } from './roles.decorator';
import { UsersService } from '../../users/users.service';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../../users/users.schema';
import { Model } from 'mongoose';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    // @Inject()
    // private userService: UsersService;

    @InjectModel(User.name)
    private userModel: Model<UserDocument>;

    async canActivate(context: ExecutionContext): Promise<boolean> {
        // Add this decorators can as @Roles(Role.USER) or @Roles(Role.ADMIN)
        // Method retrieves metadata for a specified key for a specified set of targets
        // and return a first not undefined value.
        // A method decorator @Roles(Role.ADMIN) will override controller decorator @Roles(Role.USER).
        // so without admin role you cannot do something.
        const requiredRoles: Role[] = this.reflector.getAllAndOverride<Role[]>(
            ROLES_KEY,
            [context.getHandler(), context.getClass()],
        );

        // If for method or controller nothing roles was defined we cannot check anything.
        if (!requiredRoles) {
            return true;
        }

        // Get request to working with data
        const request = context.switchToHttp().getRequest();

        // For normal checking we have to get user role by their id
        const dbRecord = await this.userModel
            .findById(request.user_id)
            .select('role')
            .exec();

        let userRole;
        if (dbRecord.role) {
            userRole = dbRecord.role;
        }

        if (!userRole || !this.isAccept(requiredRoles, userRole)) {
            throw new ForbiddenException(
                'Your role is restricted for this access point.',
            );
        }
        return true;
    }

    /**
     * If user role is included into an array with required roles that is acceptable result.
     * So we can return true. In not included will return false.
     * @param requiredRoles array with roles that can be accepted for working
     * @param userRole for checking
     */
    private isAccept(requiredRoles: Role[], userRole: Role) {
        if (Role.ADMIN === userRole) {
            return true; // immediately true
        }
        return requiredRoles.some((requiredRole) => {
            return userRole === requiredRole;
        });
    }
}
