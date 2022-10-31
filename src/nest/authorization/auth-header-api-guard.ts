import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { API_KEY_GUARD } from './auth-header-api-key.strategy';
import { Observable } from 'rxjs';

@Injectable()
export class AuthHeaderApiGuard extends AuthGuard(API_KEY_GUARD) implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        return super.canActivate(context);
    }

    handleRequest(err, user, info) {
        // You can throw an exception based on either "info" or "err" arguments
        console.log(`AuthHeaderApiGuard handleRequest check user. `
            + `err:${JSON.stringify(err)} - `
            + `user:${JSON.stringify(user)} - `
            + `info:${JSON.stringify(info)}`
        );
        if (err || !user) {
            throw err || new UnauthorizedException('Unauthorized Exception.',
                'You have no API_KEY into your header');
        }
        return user;
    }
}