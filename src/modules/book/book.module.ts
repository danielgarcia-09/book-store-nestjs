import { Module } from '@nestjs/common';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookRepository } from './book.repository';
import { UserRepository } from '../user/user.repository';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [TypeOrmModule.forFeature([BookRepository, UserRepository]), PassportModule.register({
    defaultStrategy: 'jwt'
  })],
  controllers: [BookController],
  providers: [BookService]
})
export class BookModule {}
