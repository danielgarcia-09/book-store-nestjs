import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { RoleRepository } from '../role/role.repository';
import { Status} from '../../shared/entity.status.enum';
import { plainToClass } from 'class-transformer';
import { ReadUserDto, UpdateUserDto } from './dto';


@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserRepository)
        private readonly _userRepository: UserRepository,
        @InjectRepository(RoleRepository)
        private readonly _roleRepository: RoleRepository,
    ) {}
    
    async get(userId: number): Promise<ReadUserDto> {
        if(!userId){
            throw new BadRequestException('userId must be sent');
        }

        const user: User = await this._userRepository.findOne(userId,{
            where: {status: Status.ACTIVE}
        });

        if(!user){
            throw new NotFoundException();
        }

        return plainToClass(ReadUserDto,user);
    }

    async getAll(): Promise<ReadUserDto[]> {

        const users: User[] = await this._userRepository.find({
            where: {status: Status.ACTIVE},
        });

        return users.map((user: User) => plainToClass(ReadUserDto,user));
    }

  
    async update(userId: number, user: Partial<UpdateUserDto>): Promise<ReadUserDto> {
        const foundUser: User = await this._userRepository.findOne(userId, {
            where: { status: Status.ACTIVE }
        });

        if(!foundUser){
            throw new NotFoundException('User does not exist')
        }
        
        foundUser.username = user.username;

        const updatedUser = await this._userRepository.save(foundUser);
        return plainToClass(ReadUserDto,updatedUser);
    }

    async delete(userId: number): Promise<void> {
        const userExist = await this._userRepository.findOne(userId, {
            where: {status: Status.ACTIVE}
        });
        
        if(!userExist){
            throw new NotFoundException();
        }

        await this._userRepository.update(userId, {status: Status.INACTIVE});
    }

    async setRoleToUser(userId: number, idRole: number): Promise<boolean> {
        const userExist = await this._userRepository.findOne(userId, {
            where: {status: Status.ACTIVE}
        });
        
        
        if(!userExist){
            throw new NotFoundException();
        }

        const roleExist = await this._roleRepository.findOne(idRole, {
            where: {status: Status.ACTIVE}
        });

        if(!roleExist){
            throw new NotFoundException('Role does not exist');
        }

        userExist.roles.push(roleExist);
        await this._userRepository.save(userExist);

        return true;
    }
}
