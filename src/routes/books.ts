import express from "express";
import { BooksController } from "../http/controllers/BooksController";
import { ErrorHandler } from "../http/middleware/ErrorHandler";

const bookController = new BooksController();

const bookRoute = express.Router();

bookRoute.get("/", ErrorHandler.catchErrors(bookController.getBooks));
bookRoute.get("/:id", ErrorHandler.catchErrors(bookController.getBook));
bookRoute.post("/", ErrorHandler.catchErrors(bookController.create));
bookRoute.patch("/", ErrorHandler.catchErrors(bookController.update));
bookRoute.delete("/", ErrorHandler.catchErrors(bookController.delete));

export default bookRoute;
