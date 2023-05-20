import { Request, Response } from "express";
import { AppDataSource } from "../../database/data-source";
import { Book } from "../../database/entities/Book";
import { Paginator } from "../../database/Paginator";
import { ResponseUtl } from "../../utils/Response";
import { CreateBookDTO, UpdateBookDTO } from "../dtos/BookDTO";
import { validateOrReject } from "class-validator";

export class BooksController {
  async getBooks(req: Request, res: Response) {
    const builders = AppDataSource.getRepository(Book)
      .createQueryBuilder("book")
      .leftJoinAndSelect("book.author", "author")
      .orderBy("book.id", "DESC");

    const { records: books, paginationInfo } = await Paginator.paginate(
      builders,
      req
    );

    const bookData = books.map((book: Book) => {
      return book;
    });

    return ResponseUtl.sendResponse(
      res,
      "Fetched book successfuly",
      bookData,
      paginationInfo
    );
  }

  async getBook(req: Request, res: Response) {
    const { id } = req.params;

    const book = await AppDataSource.getRepository(Book).findOneByOrFail({
      id: Number(id),
    });

    return ResponseUtl.sendResponse<Partial<Book>>(
      res,
      "Fetch book successfuly",
      book
    );
  }

  async create(req: Request, res: Response) {
    const bookData = req.body;
    bookData.image = req.file?.filename;

    const dto = new CreateBookDTO();
    Object.assign(dto, bookData);
    dto.price = parseInt(bookData.price);
    dto.authorId = parseInt(bookData.authorId);

    await validateOrReject(dto);

    const repo = AppDataSource.getRepository(Book);
    const book = repo.create(bookData);
    await repo.save(book);

    return ResponseUtl.sendResponse(res, "create book successfuly", book);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const bookData = req.body;

    const dto = new UpdateBookDTO();
    Object.assign(dto, bookData);
    dto.id = parseInt(bookData.id);

    await validateOrReject(dto);

    const repo = AppDataSource.getRepository(Book);
    const book = await repo.findOneByOrFail({
      id: Number(id),
    });

    repo.merge(book, bookData);
    await repo.save(book);

    return ResponseUtl.sendResponse(res, "update book successfuly", book);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    const repo = AppDataSource.getRepository(Book);
    const book = await repo.findOneByOrFail({
      id: Number(id),
    });

    await repo.remove(book);
    return ResponseUtl.sendResponse(res, "delete book successfuly", null);
  }
}
