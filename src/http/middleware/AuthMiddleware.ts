import { Request, Response, NextFunction } from "express";
import { ResponseUtl } from "../../utils/Response";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../../database/data-source";
import { User } from "../../database/entities/User";

export class AuthMiddleware {
  static async authenticate(req: Request, res: Response, next: NextFunction) {
    const { authorization: tokenHeader } = req.headers;
    if (!tokenHeader) {
      return ResponseUtl.sendError(res, "Token not provided", null, 401);
    }

    const token = tokenHeader.replace(/^Bearer\s/, "");

    try {
      const decoded = jwt.verify(
        token,
        process.env.ACCESS_KEY_SECRET || "secret123"
      );

      //@ts-ignore
      const { userId: id } = decoded;
      const repo = AppDataSource.getRepository(User);
      const user = await repo.findOneByOrFail({ id });

      //@ts-ignore
      req.user = user;
    } catch (error) {
      console.log(error);
      return ResponseUtl.sendError(res, "Invalid token", null, 401);
    }

    next();
  }
}
