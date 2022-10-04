/**
 * Created by
 * Łukasz Dawidowicz
 * @2022
 **/
import { User } from "../models";
import type { NextFunction, Request, Response } from "express";
import { StatusCodeTypes } from "../enums";
import { CustomError } from "../utils";

export class UserController {
  public allUsers = async (req: Request, res: Response) => {
    try {
      const users = await User.find();

      res.status(200).json({
        status: StatusCodeTypes.SUCCESS,
        data: {
          users,
        },
      });
    } catch (error) {
      res.status(400).json({
        status: StatusCodeTypes.FAILED,
        message: error,
      });
    }
  };

  public createUser = async (req: Request, res: Response) => {
    try {
      const newUser = await User.create(req.body);
      res.status(200).json({
        status: StatusCodeTypes.SUCCESS,
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

  public getOneUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = await User.findById(req.params.id);

      if (!user)
        next(new CustomError(StatusCodeTypes.FAIL, 404, "No such user exists"));

      res.status(200).json({
        status: StatusCodeTypes.SUCCESS,
        data: {
          user,
        },
      });
    } catch (error) {
      res.status(400).json({
        status: StatusCodeTypes.FAILED,
        message: error,
      });
    }
  };

  public updateUser = (req: Request, res: Response) => {
    res.status(500).json({
      status: "ERROR",
      message: "Not implemented",
    });
  };

  public deleteUser = (req: Request, res: Response) => {
    res.status(500).json({
      status: "ERROR",
      message: "Not implemented",
    });
  };
}
