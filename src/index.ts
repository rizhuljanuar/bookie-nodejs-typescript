import * as dotenv from "dotenv";
import app from "./app";
import { AppDataSource } from "./database/data-source";
import "reflect-metadata";

dotenv.config();

const PORT = process.env.APP_PORT || 3000;

AppDataSource.initialize()
  .then(async () => {
    console.log("Database connection success");
  })
  .catch((err) => console.error(err));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
