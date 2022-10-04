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
  passwordConfirm: string | undefined;
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
    require: true,
    validate: {
      //only works on save!!
      validator: function (el: string) {
        return el === this.password;
      },
      message: "password is not the same",
    },
  },
  race: { type: String },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre("save", async function (next) {
  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

export const User = mongoose.model("User", userSchema);
