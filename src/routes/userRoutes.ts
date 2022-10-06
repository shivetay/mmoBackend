/**
 * Created by
 * Łukasz Dawidowicz
 * @2022
 **/

import express from "express";
import { AuthController, UserController } from "../controllers";

const userController = new UserController();
const authController = new AuthController();

export const userRouter = express.Router();

/*
POST
sign in/create user
public
/signup
*/
userRouter.post("/signup", authController.signUp);

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
