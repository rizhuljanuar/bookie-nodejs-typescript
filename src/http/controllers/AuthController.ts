import { Request, Response } from "express";
import { loginDTO, registerDTO } from "../dtos/AuthDTO";
import { validateOrReject } from "class-validator";
import { AppDataSource } from "../../database/data-source";
import { User } from "../../database/entities/User";
import { ResponseUtl } from "../../utils/Response";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

export class AuthController {
  async register(req: Request, res: Response) {
    const registerData = req.body;

    const dto = new registerDTO();
    dto.name = registerData.name;
    dto.email = registerData.email;
    dto.password = registerData.password;

    await validateOrReject(dto);

    const repo = AppDataSource.getRepository(User);
    const user = repo.create(registerData);
    await repo.save(user);

    return ResponseUtl.sendResponse(res, "login user successfully", user, null);
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    const dto = new loginDTO();
    dto.email = email;
    dto.password = password;

    await validateOrReject(dto);

    const repo = AppDataSource.getRepository(User);
    const user = await repo.findOneBy({ email });

    if (!user) {
      return ResponseUtl.sendError(res, "Invalid credentials", null, 401);
    }

    let passwordMatches = await compare(password, user.password);
    if (!passwordMatches) {
      return ResponseUtl.sendError(res, "Invalid credentials", null, 401);
    }

    let accessToken = sign(
      { userId: user.id },
      process.env.ACCESS_KEY_SECRET || "secret123",
      {
        expiresIn: "30m",
      }
    );

    const returnUser = user.toResponse();

    return ResponseUtl.sendResponse(res, "login user successfully", {
      user: returnUser,
      accessToken,
    });
  }
}
