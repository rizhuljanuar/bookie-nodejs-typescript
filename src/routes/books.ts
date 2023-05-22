import express from "express"
import { BooksController } from "../http/controllers/BooksController"
import { ErrorHandler } from "../http/middleware/ErrorHandler"
import { AuthMiddleware } from "../http/middleware/AuthMiddleware"
import { AdminMiddleware } from "../http/middleware/AdminMiddleware"
import { FileUploader } from "../http/middleware/FileUploader"

const bookController = new BooksController()

const bookRoute = express.Router()

bookRoute.get(
  "/",
  ErrorHandler.catchErrors(AuthMiddleware.authenticate),
  ErrorHandler.catchErrors(bookController.getBooks)
)
bookRoute.get(
  "/:id",
  ErrorHandler.catchErrors(AuthMiddleware.authenticate),
  ErrorHandler.catchErrors(bookController.getBook)
)
bookRoute.post(
  "/",
  ErrorHandler.catchErrors(AuthMiddleware.authenticate),
  ErrorHandler.catchErrors(AdminMiddleware.check),
  FileUploader.upload("image", "books", 2 * 1024 * 1024),
  ErrorHandler.catchErrors(bookController.create)
)
bookRoute.patch(
  "/:id",
  ErrorHandler.catchErrors(AuthMiddleware.authenticate),
  ErrorHandler.catchErrors(AdminMiddleware.check),
  ErrorHandler.catchErrors(bookController.update)
)
bookRoute.delete(
  "/:id",
  ErrorHandler.catchErrors(AuthMiddleware.authenticate),
  ErrorHandler.catchErrors(AdminMiddleware.check),
  ErrorHandler.catchErrors(bookController.delete)
)

export default bookRoute
