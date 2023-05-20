import { Request, Response } from "express";
import { AppDataSource } from "../../database/data-source";
import { Author } from "../../database/entities/Author";
import { ResponseUtl } from "../../utils/Response";
import { Paginator } from "../../database/Paginator";
import { CreateAuthorDTO, UpdateAuthorDTO } from "../../http/dtos/AuthorDTO";
import { validate } from "class-validator";

export class AuthorsController {
  async getAuthors(req: Request, res: Response): Promise<Response> {
    const builders = AppDataSource.getRepository(Author)
      .createQueryBuilder()
      .orderBy("id", "DESC");

    const { records: authors, paginationInfo } = await Paginator.paginate(
      builders,
      req
    );
    return ResponseUtl.sendResponse(
      res,
      "Fetched authors successfully",
      authors,
      paginationInfo
    );
  }

  async getAuthor(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const author = await AppDataSource.getRepository(Author).findOneByOrFail({
      id: Number(id),
    });

    return ResponseUtl.sendResponse<Author>(
      res,
      "Fetched author successfully",
      author.toPayload()
    );
  }

  async createAuthor(req: Request, res: Response): Promise<Response> {
    const authorData = req.body;
    authorData.image = req.file?.filename;

    const dto = new CreateAuthorDTO();
    Object.assign(dto, authorData);

    const errors = await validate(dto);
    if (errors.length > 0) {
      return ResponseUtl.sendError(res, "Invalid data", errors, 422);
    }

    const repo = AppDataSource.getRepository(Author);
    const author = repo.create(authorData);
    await repo.save(author);

    return ResponseUtl.sendResponse(res, "Create author successfully", author);
  }

  async updateAuthor(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const authorData = req.body;

    const dto = new UpdateAuthorDTO();
    Object.assign(dto, authorData);
    dto.id = parseInt(id);

    const errors = await validate(dto);
    if (errors.length > 0) {
      return ResponseUtl.sendError(res, "Invalid data", errors, 422);
    }

    const repo = AppDataSource.getRepository(Author);

    const author = await repo.findOneByOrFail({
      id: Number(id),
    });

    repo.merge(author, authorData);
    await repo.save(author);

    return ResponseUtl.sendResponse(
      res,
      "Update author successfully",
      author.toPayload()
    );
  }

  async deleteAuthor(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const repo = AppDataSource.getRepository(Author);
    const author = await repo.findOneByOrFail({
      id: Number(id),
    });

    await repo.remove(author);

    return ResponseUtl.sendResponse(res, "Delete author successfully", null);
  }
}
