/**
 * Created by
 * Łukasz Dawidowicz
 * @2022
 **/

import express from "express";

export const userRouter = express.Router();

/*
GET
get all users
protected
/users/
*/
userRouter.route("/").get();

/*
GET
get single user
protected
/users/:id
*/

userRouter.route("/:id").get().patch().delete();

/*
GET
me
protected
*/
userRouter.get("/me");
