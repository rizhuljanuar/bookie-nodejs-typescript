import { IsEmail, IsNotEmpty, MaxLength, MinLength } from "class-validator";
import { IsUnique } from "../../http/validators/isUniqueValidator";
import { User } from "./User";

export class RegisterDTO {
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(20)
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @IsUnique(User, "email")
  email: string;

  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(20)
  password: string;
}

export class LoginDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(20)
  password: string;
}
