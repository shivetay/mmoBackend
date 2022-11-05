/**
 * Created by
 * Łukasz Dawidowicz
 * @2022
 **/

import express from "express";
import { AuthController, BuildingController } from "../controllers";

const buildingController = new BuildingController();
const authController = new AuthController();

export const buildingRouter = express.Router();

/*
GET, POST
get all buildings
create building
public/protected
/buildings/
*/

buildingRouter
  .route("/")
  .get(buildingController.getAll)
  .post(buildingController.createBuilding);
