import express from "express"
import { AuthorsController } from "../http/controllers/AuthorsController"
import { FileUploader } from "../http/middleware/FileUploader"
import { ErrorHandler } from "../http/middleware/ErrorHandler"
import { AuthMiddleware } from "../http/middleware/AuthMiddleware"
import { AdminMiddleware } from "../http/middleware/AdminMiddleware"

const authorsController = new AuthorsController()

const authorsRoute = express.Router()

authorsRoute.get(
  "/",
  ErrorHandler.catchErrors(AuthMiddleware.authenticate),
  ErrorHandler.catchErrors(authorsController.getAuthors)
)
authorsRoute.get(
  "/:id",
  ErrorHandler.catchErrors(AuthMiddleware.authenticate),
  ErrorHandler.catchErrors(authorsController.getAuthor)
)
authorsRoute.post(
  "/",
  ErrorHandler.catchErrors(AuthMiddleware.authenticate),
  ErrorHandler.catchErrors(AdminMiddleware.check),
  FileUploader.upload("image", "authors", 2 * 1024 * 1024),
  ErrorHandler.catchErrors(authorsController.createAuthor)
)
authorsRoute.patch(
  "/:id",
  ErrorHandler.catchErrors(AuthMiddleware.authenticate),
  ErrorHandler.catchErrors(AdminMiddleware.check),
  ErrorHandler.catchErrors(authorsController.updateAuthor)
)
authorsRoute.delete(
  "/:id",
  ErrorHandler.catchErrors(AuthMiddleware.authenticate),
  ErrorHandler.catchErrors(AdminMiddleware.check),
  ErrorHandler.catchErrors(authorsController.deleteAuthor)
)

export default authorsRoute
