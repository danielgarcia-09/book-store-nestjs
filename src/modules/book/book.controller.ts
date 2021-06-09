import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { BookService } from './book.service';
import { ReadBookDto, CreateBookDto, UpdateBookDto  } from './dtos';
import { GetUser } from '../auth/user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from '../role/guards/role.guard';
import { Roles } from '../role/decorators/role.decorator';
import { RoleType } from '../role/roletype.enum';

@Controller('book')
export class BookController {
    constructor(
        private readonly _bookService: BookService
    ) {}

    @Get(':id')
    getBook(@Param('id', ParseIntPipe) id: number): Promise<ReadBookDto>{
        return this._bookService.get(id);
    }

    @Get('author/:authorId')
    getBookByAuthor(@Param('authorId', ParseIntPipe) authorId: number):Promise<ReadBookDto[]>{
        return this._bookService.getBooksByAuthor(authorId);
    }

    @Get()
    getBooks(): Promise<ReadBookDto[]>{
        return this._bookService.getAll();
    }

    @Roles(RoleType.AUTHOR)
    @UseGuards(AuthGuard(), RoleGuard)
    @Post()
    createBook(@Body() book: CreateBookDto){
        return this._bookService.create(book);
    }

    @Roles(RoleType.AUTHOR)
    @UseGuards(AuthGuard(), RoleGuard)
    @Post()
    createBookByAuthor(@GetUser('id') authorId: number, @Body() book: CreateBookDto): Promise<ReadBookDto>{
        return this._bookService.createByAuthor(book, authorId);
    }

    @Patch(':id')
    updateBook(
        // * @GetUser(), Con este decorador verificamos el usuario que esta en sesion con el token, cada vez que usemos este decorador, Utilizara el jwtStrategy con la Interfaz IJwtPayload para dar el usuario entero o una propiedad especifica
        @GetUser('id') authorId: number,
        @Param('id',ParseIntPipe) bookId: number,
        @Body() book: UpdateBookDto
    ): Promise<ReadBookDto>{
        return this._bookService.update(bookId, book, authorId);
    }

    @Delete()
    deleteBook(bookId: number): Promise<void>{
        return this._bookService.delete(bookId);
    }
}
