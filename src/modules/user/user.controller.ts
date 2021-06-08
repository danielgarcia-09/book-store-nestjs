import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
    constructor(private readonly _userService: UserService) {}

    @Get(':id')
    async getUser(@Param('id', ParseIntPipe) id: number): Promise<User> {
        return await this._userService.get(id);
    }

    @UseGuards(AuthGuard())
    @Get()
    async getUsers(): Promise<User[]> {
        return await this._userService.getAll();
    }

    @Post('create')
    async createUser(@Body() user: User): Promise<User> {
        return await this._userService.createUser(user);
    }
    
    @Patch(':id')
    async updateUser(@Param('id', ParseIntPipe) id: number, @Body() user: User): Promise<void> {
        return await this._userService.update(id,user);
    }

    @Delete(':id')
    async deleteUser(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
        await this._userService.delete(id);
        return true;
    }
}
