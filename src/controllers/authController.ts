/**
 * Created by
 * Łukasz Dawidowicz
 * @2022
 **/
import { IUserSchema, User } from "../models";
import type { NextFunction, Request, Response } from "express";
import jwt, { Secret } from "jsonwebtoken";
import { StatusCodeTypes } from "../enums";
import { CustomError } from "../utils";
import { promisify } from "util";
import process from "process";
import { resolve } from "path";
import { decode } from "punycode";

interface IRequestWithUser extends Request {
  user: IUserSchema;
}

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
        passwordChangedAt: req.body.passwordChangedAt,
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
    try {
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
    } catch (error) {
      res.status(400).json({
        status: StatusCodeTypes.FAILED,
        message: error,
      });
    }
  };

  public protect = async (
    req: IRequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    try {
      //1. get token
      let token;
      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
      ) {
        token = req.headers.authorization.split(" ")[1];
      } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
      }

      if (!token) {
        return next(
          next(
            new CustomError(
              StatusCodeTypes.FAIL,
              401,
              "You are not logged in! Please log in to get access."
            )
          )
        );
      }
      //2. validate token
      const decoded: any = await promisify<string, Secret>(jwt.verify)(
        token as string,
        process.env.JWT_SECRET as Secret
      );

      //3. check if user exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next(
          new CustomError(
            StatusCodeTypes.FAIL,
            401,
            "The user belonging to this token does no longer exist."
          )
        );
      }
      //4. check if user changed password after jwt was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(
          new CustomError(
            StatusCodeTypes.FAIL,
            401,
            "User recently changed password! Please log in again."
          )
        );
      }

      req.user = currentUser;
      next();
    } catch (error) {
      res.status(400).json({
        status: StatusCodeTypes.FAILED,
        message: error,
      });
    }
  };
}
