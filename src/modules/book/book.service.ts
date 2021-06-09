import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './book.entity';
import { BookRepository } from './book.repository';
import { UserRepository } from '../user/user.repository';
import { Status } from '../../shared/entity.status.enum';
import { ReadBookDto, CreateBookDto, UpdateBookDto  } from './dtos';
import { plainToClass } from 'class-transformer';
import { In } from 'typeorm';
import { User } from '../user/user.entity';
import { Role } from '../role/role.entity';
import { RoleType } from '../role/roletype.enum';


@Injectable()
export class BookService {
    constructor(
        @InjectRepository(BookRepository)
        private readonly _bookRepository: BookRepository,
        @InjectRepository(UserRepository)
        private readonly _userRepository: UserRepository,
    ) {}

    async get(bookId: number): Promise<ReadBookDto>{
        if(!bookId){
            throw new BadRequestException('userId must be sent');
        }

        const book: Book = await this._bookRepository.findOne(bookId,{
            where: {status: Status.ACTIVE}
        });

        if(!book){
            throw new NotFoundException('book does not exist');
        }
    
        return plainToClass(ReadBookDto,book);

    }

    async getAll(): Promise<ReadBookDto[]>{
        const books: Book[] = await this._bookRepository.find({
            where: {status: Status.ACTIVE}
        });
        return books.map((book: Book) => plainToClass(ReadBookDto,book));
    }

    async getBooksByAuthor(authorId: number): Promise<ReadBookDto[]>{
        if(!authorId){
            throw new BadRequestException('author does not exist');
        }

        const books: Book[] = await this._bookRepository.createQueryBuilder('books')
        .leftJoinAndSelect("books.authors", "users")
        .where('books.status = :status',{status : Status.ACTIVE})
        .andWhere("users.id = :id ", { id: authorId })
         .getMany();
        
        return books.map(book => plainToClass(ReadBookDto, book) );
    }

    async create(book: Partial<CreateBookDto>){
        const authors: User[] = [];

        for(const authorId of book.authors){
            const authorExists = await this._userRepository.findOne( authorId, {
                where: { status: Status.ACTIVE },
            })

            if(!authorExists){
                throw new NotFoundException('Author does not exist');
            }

            const isAuthor = authorExists.roles.some(
                (role: Role) => role.name === RoleType.AUTHOR,
            );

            if(!isAuthor){
                throw new UnauthorizedException(`This user ${authorId} is not an author`);
            }
            
            authors.push(authorExists);
        }

        const savedBook: Book = await this._bookRepository.save({
            name: book.name,
            description: book.description,
            authors: authors
        });

        return plainToClass(ReadBookDto, savedBook); 
    }

    async createByAuthor(book: Partial<CreateBookDto>,authorId: number){
        const author = await this._userRepository.findOne( authorId, {
            where: { status: Status.ACTIVE },
        })

        if(!author){
            throw new NotFoundException('Author does not exist');
        }

        const isAuthor = author.roles.some(
            (role: Role) => role.name === RoleType.AUTHOR
        );

        if(!isAuthor){
            throw new UnauthorizedException(`This user ${authorId} is not an author`);
        }

        const savedBook: Book = await this._bookRepository.save({
            name: book.name,
            description: book.description,
            author
        });

        return plainToClass(ReadBookDto, savedBook); 
    }

    async update(bookId: number ,book: Partial<UpdateBookDto>, authorId: number){
        const bookExists = await this._bookRepository.findOne( bookId, {
            where: { status: Status.ACTIVE },
        })

        if(!bookExists){
            throw new NotFoundException('Book does not exist');
        }

        const isOwnBook = bookExists.authors.some(
            (author: User) => author.id === authorId
        );

        if(!isOwnBook){
            throw new UnauthorizedException(`This user isn't this book author`);
        }

        const updatedBook = await this._bookRepository.update(bookId, book);
        return plainToClass(ReadBookDto, updatedBook);
    }

    async delete(bookId: number){
        const bookExists = await this._bookRepository.findOne( bookId, {
            where: { status: Status.ACTIVE },
        })

        if(!bookExists){
            throw new NotFoundException('Book does not exist');
        }

        await this._bookRepository.update(bookId, { status: Status.INACTIVE });
    }
}
