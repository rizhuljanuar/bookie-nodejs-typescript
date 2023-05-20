import { Request, Response, NextFunction } from "express";
import { EntityNotFoundError } from "typeorm";
import { ResponseUtl } from "../../utils/Response";

export class ErrorHandler {
  static catchErrors(fn: any) {
    return (req: Request, res: Response, next: NextFunction) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  }

  static handleErrors(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log(err);
    if (err instanceof EntityNotFoundError) {
      return ResponseUtl.sendError(
        res,
        "Item/page you are looking for does not exist",
        null,
        404
      );
    }

    if (err.message === "Invalid file type") {
      return ResponseUtl.sendError(res, "Invalid file type", null, 422);
    }

    return res.status(500).send({
      success: false,
      message: "Something went wrong",
    });
  }
}
