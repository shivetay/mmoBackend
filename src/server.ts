/**
 * Created by
 * Łukasz Dawidowicz
 * @2022
 **/

import mongoose from "mongoose";
import dotenv from "dotenv";

// shut down when error
process.on("uncaughtException", (err: Error) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

// ! !== develop = develop O_o
const dotenvConfig =
  process.env.NODE_ENV !== "develop" ? "./dev.env" : "./prod.env";

dotenv.config({ path: `${dotenvConfig}` });

// DB connection
const DB = process.env.MONGO_DB?.replace(
  `<PASSWORD>`,
  process.env.DB_PASSWORD as string
);

const application = require("./app");

mongoose
  .connect(DB as string, {})
  .then(() => {})
  .catch((err: Error) => console.log(err));

const port = process.env.PORT || 8000;
const server = application.listen(port, () => {
  console.log(`app running on ${port}`);
});

process.on("unhandledRejection", (err: Error) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
