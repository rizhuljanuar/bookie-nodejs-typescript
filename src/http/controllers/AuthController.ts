import { Request, Response } from "express"
import { loginDTO, registerDTO } from "../dtos/AuthDTO"
import { validate } from "class-validator"
import { AppDataSource } from "../../database/data-source"
import { User } from "../../database/entities/User"
import { ResponseUtl } from "../../utils/Response"
import { compare } from "bcryptjs"
import { JwtUtil } from "../../utils/JwtUtil"

export class AuthController {
  async register(req: Request, res: Response): Promise<Response> {
    const registerData = req.body

    const dto = new registerDTO()
    dto.name = registerData.name
    dto.email = registerData.email
    dto.password = registerData.password

    const errors = await validate(dto)
    if (errors.length > 0) {
      return ResponseUtl.sendError(res, "Invalid data", errors, 422)
    }

    const repo = AppDataSource.getRepository(User)
    const user = repo.create(registerData)
    await repo.save(user)

    return ResponseUtl.sendResponse(res, "login user successfully", user, null)
  }

  async login(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body

    const dto = new loginDTO()
    dto.email = email
    dto.password = password

    const errors = await validate(dto)
    if (errors.length > 0) {
      return ResponseUtl.sendError(res, "Invalid data", errors, 422)
    }

    const repo = AppDataSource.getRepository(User)
    const user = await repo.findOneBy({ email })

    if (!user) {
      return ResponseUtl.sendError(res, "Invalid credentials", null, 401)
    }

    let passwordMatches = await compare(password, user.password)
    if (!passwordMatches) {
      return ResponseUtl.sendError(res, "Invalid credentials", null, 401)
    }

    let accessToken = JwtUtil.signJwt({ ...user }, { expiresIn: "30m" })
    let refreshToken = JwtUtil.signJwt({ ...user }, { expiresIn: "1y" })
    const returnUser = user.toResponse()

    return ResponseUtl.sendResponse(res, "login user successfully", {
      user: returnUser,
      accessToken,
      refreshToken,
    })
  }

  async refreshToken(req: Request, res: Response) {
    const { refreshToken } = req.body

    const accessToken = await JwtUtil.reIssueAccessToken(refreshToken)

    return ResponseUtl.sendResponse(res, "refresh token successfully", accessToken)
  }
}
