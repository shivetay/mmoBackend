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
  public signToken = (id: any) => {
    return jwt.sign({ id }, process.env.JWT_SECRET as Secret, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
  };
  public signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
      });

      // * add JWT
      const token = this.signToken(newUser._id);

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
  public login = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    // 1. check if email and password exists
    if (!email || !password) {
      next(
        new CustomError(
          StatusCodeTypes.FAIL,
          400,
          "Please provide email and password"
        )
      );
    }
    // 2. check for user && password is valid
    // ! +password will be back in output
    const user = await User.findOne({ email }).select("+password");

    const passwordCheck = user?.correctPassword(password, user.password);

    if (!user || !passwordCheck) {
      next(
        new CustomError(StatusCodeTypes.FAIL, 401, "Wrong email or password")
      );
    }
    //3. send token if ok JWT to client
    const token = this.signToken(user?._id);

    res.status(200).json({
      status: StatusCodeTypes.SUCCESS,
      token,
    });
  };
}
