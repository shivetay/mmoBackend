/**
 * Created by
 * Łukasz Dawidowicz
 * @2022
 **/
import express from "express";
import { AuthController, RaceController } from "../controllers";

const authController = new AuthController();
const raceController = new RaceController();

export const raceRouter = express.Router();

/*
GET, POST
get all races
public/protected
/races/
*/

raceRouter
  .route("/")
  .get(raceController.getAll)
  .post(raceController.createRace);
