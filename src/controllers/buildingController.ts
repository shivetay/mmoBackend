/**
 * Created by
 * Łukasz Dawidowicz
 * @2022
 **/
import { Building } from "../models";
import type { NextFunction, Request, Response } from "express";
import { StatusCodeTypes } from "../enums";

export class BuildingController {
  public getAll = async (req: Request, res: Response) => {
    try {
      const buildings = await Building.find();
      res.status(200).json({
        status: StatusCodeTypes.SUCCESS,
        data: {
          buildings,
        },
      });
    } catch (error) {
      res.status(400).json({
        status: StatusCodeTypes.FAILED,
        message: error,
      });
    }
  };

  public createBuilding = async (req: Request, res: Response) => {
    try {
      const newBuilding = await Building.create(req.body);

      res.status(200).json({
        status: StatusCodeTypes.SUCCESS,
        data: {
          building: newBuilding,
        },
      });
    } catch (error) {
      res.status(400).json({
        status: StatusCodeTypes.FAILED,
        message: error,
      });
    }
  };
  public updateBuilding = (req: Request, res: Response) => {
    res.status(500).json({
      status: "ERROR",
      message: "Not implemented",
    });
  };

  public deleteBuilding = (req: Request, res: Response) => {
    res.status(500).json({
      status: "ERROR",
      message: "Not implemented",
    });
  };
}
