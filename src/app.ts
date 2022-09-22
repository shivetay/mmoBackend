/**
 * Created by
 * Łukasz Dawidowicz
 * @2022
 **/

import express, { Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import { StatusCodeTypes } from "./enums";
import { userRouter } from "./routes";
import { CustomError } from "./utils";

export const app = express();

/* middleware */

if (process.env.NODE_ENV === "develop") {
  app.use(morgan("dev"));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: " To many req",
});

app.use("/api", limiter);

app.use(express.json({ limit: "10kb" }));

app.use(express.static(`${__dirname}/public`));

/* routes */

app.use("/api/v1/users", userRouter);

/* error handling */

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    status: StatusCodeTypes.FAILED,
  });
  next();

  const err = new CustomError(
    StatusCodeTypes.FAIL,
    404,
    `Can't find ${req.originalUrl}`
  );
  err.status;
  err.statusCode;
});

module.exports = app;
