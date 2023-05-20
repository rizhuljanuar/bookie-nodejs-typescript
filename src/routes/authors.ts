import express from "express";
import { AuthorsController } from "../http/controllers/AuthorsController";
import { FileUploader } from "../http/middleware/FileUploader";
import { ErrorHandler } from "../http/middleware/ErrorHandler";

const authorsController = new AuthorsController();

const authorsRoute = express.Router();

authorsRoute.get("/", ErrorHandler.catchErrors(authorsController.getAuthors));
authorsRoute.get("/:id", ErrorHandler.catchErrors(authorsController.getAuthor));
authorsRoute.post(
  "/",
  FileUploader.upload("image", "authors", 2 * 1024 * 1024),
  ErrorHandler.catchErrors(authorsController.createAuthor)
);
authorsRoute.patch(
  "/:id",
  ErrorHandler.catchErrors(authorsController.updateAuthor)
);
authorsRoute.delete(
  "/:id",
  ErrorHandler.catchErrors(authorsController.deleteAuthor)
);

export default authorsRoute;
