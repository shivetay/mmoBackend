/**
 * Created by
 * Łukasz Dawidowicz
 * @2022
 **/
import mongoose, { Document, Model, Schema, Types } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

export interface IUserSchema extends Document {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string | undefined;
  passwordChangedAt: Date | number;
  active: boolean;
  race: Types.ObjectId;
  role: string;
  level: number;
  experience: number;
  correctPassword: (candidatePassword: string, userPassword: string) => void;
  changedPasswordAfter: (iat: any) => boolean;
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
      // **only works on create/save
      validator: function (el: string) {
        return el === this.password;
      },
      message: "password is not the same",
    },
  },
  passwordChangedAt: Date || Number,
  race: { type: Schema.Types.ObjectId, ref: "Race" },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  level: { type: Number, default: 1 },
  experience: {
    type: Number,
    default: 0,
  },
});

userSchema.pre("save", async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) return next();

  //hash password cost 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre(/^find/, function (next) {
  this.populate({
    path: "race",
    select: "name",
  });
  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword: string,
  userPassword: string
) {
  //return true if password is the same
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (
  JWTTimeStamp: any
): boolean {
  console.log(this.passwordChangedAt, JWTTimeStamp);
  if (this.passwordChangedAt) {
    const changedTimestamp = this.passwordChangedAt.getTime() / (1000 * 10);

    return JWTTimeStamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

export const User = mongoose.model<IUserSchema>("User", userSchema);
