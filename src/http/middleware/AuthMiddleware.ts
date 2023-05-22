import { Request, Response, NextFunction } from "express";
import { ResponseUtl } from "../../utils/Response";

export class AuthMiddleware {
  static async authenticate(req: Request, res: Response, next: NextFunction) {
    const { authorization: tokenHeader } = req.headers;
    if (!tokenHeader) {
      return ResponseUtl.sendError(res, "Token not provided", null, 401);
    }

    const token = tokenHeader.replace(/^Bearer\s/, "");
  }
}
