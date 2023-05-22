import express, { Express, NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import authorsRoute from "./routes/authors";
import { ErrorHandler } from "./http/middleware/ErrorHandler";
import bookRoute from "./routes/books";
import authRoute from "./routes/auths";

const app: Express = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// routes
app.use("/authors", authorsRoute);
app.use("/books", bookRoute);
app.use("/auth", authRoute);

app.use("*", (req: Request, res: Response) => {
  return res.status(404).json({
    success: false,
    message: "Ivalid route",
  });
});

app.use(ErrorHandler.handleErrors);

export default app;
