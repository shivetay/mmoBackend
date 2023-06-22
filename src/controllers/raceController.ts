/**
 * Created by
 * Łukasz Dawidowicz
 * @2022
 **/
import { Race } from "../models";
import type { NextFunction, Request, Response } from "express";
import { StatusCodeTypes } from "../enums";

export class RaceController {
  public getAll = async (req: Request, res: Response) => {
    try {
      const races = await Race.find();
      res.status(200).json({
        status: StatusCodeTypes.SUCCESS,
        data: {
          races,
        },
      });
    } catch (error) {
      res.status(400).json({
        status: StatusCodeTypes.FAILED,
        message: error,
      });
    }
  };

  public createRace = async (req: Request, res: Response) => {
    try {
      const newRace = await Race.create(req.body);

      res.status(200).json({
        status: StatusCodeTypes.SUCCESS,
        data: {
          race: newRace,
        },
      });
    } catch (error) {
      res.status(400).json({
        status: StatusCodeTypes.FAILED,
        message: error,
      });
    }
  };

  public updateRace = (req: Request, res: Response) => {
    res.status(500).json({
      status: "ERROR",
      message: "Not implemented",
    });
  };

  public deleteRace = (req: Request, res: Response) => {
    res.status(500).json({
      status: "ERROR",
      message: "Not implemented",
    });
  };
}
