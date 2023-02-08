import { Controller, Get, UseGuards } from '@nestjs/common';
import { Roles } from '../security/roles/roles.decorator';
import { Role } from '../security/roles/roles.enum';
import { AppJwtGuard } from '../security/jwt/app.jwt.guard';
import { RolesGuard } from '../security/roles/roles.guard';

@Controller('/transactions')
@Roles(Role.ADMIN)
@UseGuards(AppJwtGuard, RolesGuard)
export class TransactionsController {
    @Get()
    getLastTransactions() {
        return [];
    }
}
