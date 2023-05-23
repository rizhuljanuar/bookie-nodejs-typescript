import * as dotenv from "dotenv"

dotenv.config()

const env = process.env.DB_CONNECTION || "mysql"

const mysql = {
  db: {
    driver: env,
    host: process.env.DB_HOST || "127.0.0.1",
    port: process.env.DB_PORT || "3306",
    name: process.env.DB_DATABASE || "db",
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || "",
  },
}

const pgsql = {
  db: {
    driver: env,
    host: process.env.DB_HOST || "127.0.0.1",
    port: process.env.DB_PORT || "5432",
    name: process.env.DB_DATABASE || "db",
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || "",
  },
}

const filterDB = {
  mysql,
  pgsql,
}

//@ts-ignore
const configDB = filterDB[env]

export default configDB
