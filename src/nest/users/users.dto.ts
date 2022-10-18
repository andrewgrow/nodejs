import { User } from './users.schema';

export class UserDto {
    name: string;
    phone: string;
    id?: string;

    static toEntity(dto: UserDto): User {
        const model = new User();
        model.name = dto.name;
        model.phone = dto.phone;
        return model;
    }

    static fromEntity(entity: User): UserDto {
        const dto = new UserDto();
        dto.id = entity._id;
        dto.name = entity.name;
        dto.phone = entity.phone;
        return dto;
    }
}
