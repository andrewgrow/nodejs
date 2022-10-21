import { SetMetadata } from '@nestjs/common';

/**
 * Use this decorator as a getter of Metadata class or methods wrapping.
 * e.g. wrapping controller:
 *
 * @Roles('guest')
 * @Controller('cats')
 * export class CatsController {}
 *
 * or wrapping method:
 *
 * @Roles('admin')
 * @Post()
 * async create(@Body() createCatDto: CreateCatDto) {
 *   this.catsService.create(createCatDto);
 * }
 *
 * The Reflector class provides two utility methods used to help with extract this data.
 * const roles = this.reflector.getAllAndOverride<string[]>('roles', [
 *   context.getHandler(),
 *   context.getClass(),
 * ]);
 * A guard with this code, running in the context of the create() method, with the above metadata, would result
 * in roles containing ['admin'].
 *
 * const roles = this.reflector.getAllAndMerge<string[]>('roles', [
 *   context.getHandler(),
 *   context.getClass(),
 * ]);
 * This would result in roles containing ['guest', 'admin'].
 *
 * The Reflector class is imported from the @nestjs/core package.
 *
 * @see [https://docs.nestjs.com/fundamentals/execution-context] for details of creating Roles decorator
 *
 * @param roles String's array
 *
 */
export const Roles = (...roles: string[]): any => {
    SetMetadata('roles', roles);
};
