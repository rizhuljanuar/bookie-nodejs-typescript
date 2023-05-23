import express from "express"
import { AuthController } from "../http/controllers/AuthController"
import { ErrorHandler } from "../http/middleware/ErrorHandler"

const authController = new AuthController()

const authRoute = express.Router()

authRoute.post("/register", ErrorHandler.catchErrors(authController.register))
authRoute.post("/login", ErrorHandler.catchErrors(authController.login))
authRoute.post("/refresh-token", ErrorHandler.catchErrors(authController.refreshToken))

export default authRoute
