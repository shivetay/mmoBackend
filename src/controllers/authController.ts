/**
 * Created by
 * Łukasz Dawidowicz
 * @2022
 **/
import { User } from "../models";
import type { NextFunction, Request, Response } from "express";
import jwt, { Secret } from "jsonwebtoken";
import { StatusCodeTypes } from "../enums";
import { CustomError } from "../utils";

export class AuthController {
  public signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
      });

      console.log(process.env.JWT_SECRET);

      // * add JWT

      if (!process.env.JWT_SECRET)
        next(new CustomError(StatusCodeTypes.FAIL, 404, "No TOKEN"));

      const token = jwt.sign(
        { id: newUser._id },
        process.env.JWT_SECRET as Secret,
        {
          expiresIn: process.env.JWT_EXPIRES_IN,
        }
      );

      res.status(200).json({
        status: StatusCodeTypes.SUCCESS,
        token,
        data: {
          user: newUser,
        },
      });
    } catch (error) {
      res.status(400).json({
        status: StatusCodeTypes.FAILED,
        message: error,
      });
    }
  };
}
