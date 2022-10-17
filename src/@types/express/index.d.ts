import express from "express";
import { IUserSchema } from "../../models";

declare global {
  module Express {
    export interface Request {
      user: IUserSchema;
    }
  }
}
