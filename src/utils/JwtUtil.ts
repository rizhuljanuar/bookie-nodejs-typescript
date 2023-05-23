import jwt from "jsonwebtoken"
import { AppDataSource } from "../database/data-source"
import { User } from "../database/entities/User"

export class JwtUtil {
  static signJwt(payload: Object, options?: jwt.SignOptions | undefined) {
    return jwt.sign(payload, `${process.env.ACCESS_KEY_SECRET}`, {
      ...(options && options),
      algorithm: "RS256",
    })
  }

  static verifyJwt(token: string) {
    try {
      const decoded = jwt.verify(token, `${process.env.ACCESS_KEY_PUBLIC}`)

      return {
        valid: true,
        expired: false,
        decoded,
      }
    } catch (error: any) {
      return {
        valid: false,
        expired: (error.message = "jwt expired"),
        decoded: null,
      }
    }
  }

  static async reIssueAccessToken(refreshToken: string) {
    const { decoded }: any = this.verifyJwt(refreshToken)

    const email = decoded.email
    const repo = AppDataSource.getRepository(User)
    const user = await repo.findOneBy({ email })

    const accessToken = this.signJwt({ ...user }, { expiresIn: "1d" })

    return accessToken
  }
}
