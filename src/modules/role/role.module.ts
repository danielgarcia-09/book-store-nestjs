import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleRepository } from './role.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleController } from './role.controller';

@Module({
    imports: [TypeOrmModule.forFeature([RoleRepository])],
    providers: [RoleService],
    controllers: [RoleController]
})
export class RoleModule {}
