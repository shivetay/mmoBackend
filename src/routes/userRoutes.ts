/**
 * Created by
 * Łukasz Dawidowicz
 * @2022
 **/

import express from "express";
import { UserController } from "../controllers";

const userController = new UserController();

export const userRouter = express.Router();

/*
GET
get all users
POST
create user
protected
/users/
*/
userRouter
  .route("/")
  .get(userController.allUsers)
  .post(userController.createUser);

/*
GET
get single user
protected
/users/:id
*/

userRouter.route("/:id").get(userController.getOneUser).patch().delete();

/*
GET
me
protected
*/
userRouter.get("/me");
