/**
 * Created by
 * Łukasz Dawidowicz
 * @2022
 **/

const mongoose = require("mongoose");
const dotenv = require("dotenv");

// shut down when error
process.on("uncaughtException", (err: Error) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: `./dev.env` });

// DB connection
const DB = process.env.MONGO_DB?.replace(
  `<PASSWORD>`,
  process.env.DB_PASSWORD as string
);

const application = require("./app");

mongoose
  .connect(DB, {})
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
