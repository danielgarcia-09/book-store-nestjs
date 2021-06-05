import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { Role } from './role.entity';
import { RoleService } from './role.service';

@Controller('roles')
export class RoleController {
    constructor(private readonly _roleService: RoleService) {}

    @Get(':id')
    async getRole(@Param('id', ParseIntPipe) id: number): Promise<Role> {
        return await this._roleService.get(id);
    }

    @Get()
    async getRoles(): Promise<Role[]> {
        return await this._roleService.getAll();
    }

    @Post()
    async createRole(@Body() role: Role): Promise<Role> {
        return await this._roleService.createRole(role);
    }
    
    @Patch(':id')
    async updateRole(@Param('id', ParseIntPipe) id: number, @Body() role: Role): Promise<void> {
        return await this._roleService.update(id,role);
    }

    @Delete(':id')
    async deleteRole(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
        await this._roleService.delete(id);
        return true;
    }
}
