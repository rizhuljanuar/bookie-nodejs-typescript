import * as dotenv from "dotenv"
import { DataSource } from "typeorm"
import { Author } from "../database/entities/Author"
import { Book } from "./entities/Book"
import { User } from "./entities/User"
import configDB from "../config/database"

dotenv.config()

export const AppDataSource = new DataSource({
  type: configDB.db.driver,
  host: configDB.db.host,
  port: Number(configDB.db.port),
  username: configDB.db.username,
  password: configDB.db.password,
  database: configDB.db.name,
  logging: ["query"],
  synchronize: false,
  entities: [Author, Book, User],
  subscribers: [],
  migrations: ["src/database/migrations/*.ts"],
})
