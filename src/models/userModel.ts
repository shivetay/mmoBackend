/**
 * Created by
 * Łukasz Dawidowicz
 * @2022
 **/
import mongoose, { Model } from "mongoose";
import validator from "validator";

interface IUserSchema {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  active: boolean;
  race: string;
}

const userSchema = new mongoose.Schema<IUserSchema, Model<IUserSchema>>({
  name: { type: String, require: [true, "Name is required"], unique: true },
  email: {
    type: String,
    require: [true, "Email is required"],
    unique: true,
    //transform to lower case
    lowercase: true,
    validate: [validator.isEmail, "Not valid email"],
  },
  password: {
    type: String,
    require: [true, "Password is required"],
    unique: true,
    // minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    // require: [true, "Name is required"],
    require: true,
    // ! types issue with validator
    // validate: {
    //   //only works on save!!
    //   validator: function (el: any) {
    //     return el === this.password;
    //   },
    //   message: "password is not the same",
    // },
  },
  race: { type: String },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

export const User = mongoose.model("User", userSchema);
