import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ReadRoleDto, UpdateRoleDto ,CreateRoleDto } from './dtos';
import { RoleService } from './role.service';


@Controller('roles')
export class RoleController {
    constructor(private readonly _roleService: RoleService) {}

    @Get(':roleId')
    getRole(@Param('roleId', ParseIntPipe) id: number): Promise<ReadRoleDto> {
        return this._roleService.get(id);
    }

    @Get()
    getRoles(): Promise<ReadRoleDto[]> {
        return this._roleService.getAll();
    }

    @Post()
    createRole(@Body() role: CreateRoleDto): Promise<ReadRoleDto> {
        return this._roleService.createRole(role);
    }
    
    @Patch(':roleId')
    updateRole(@Param('roleId', ParseIntPipe) id: number, @Body() role: UpdateRoleDto): Promise<ReadRoleDto> {
        return this._roleService.update(id,role);
    }

    @Delete(':roleId')
    deleteRole(@Param('roleId', ParseIntPipe) id: number): Promise<void> {
         return this._roleService.delete(id);
    
    }
}
