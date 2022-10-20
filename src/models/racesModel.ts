/**
 * Created by
 * Łukasz Dawidowicz
 * @2022
 **/

import mongoose, { Model, Schema, Types } from "mongoose";

export interface IRaceSchema {
  name: string;
  buildings: Types.ObjectId;
  description: string;
}

const raceSchema = new mongoose.Schema<IRaceSchema, Model<IRaceSchema>>(
  {
    name: String,
    description: String,
    buildings: {
      types: Schema.Types.ObjectId,
      ref: "Building",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

raceSchema.pre(/^find/, function (next) {
  this.populate({
    path: "buildings",
  });
  next();
});

export const Race = mongoose.model<IRaceSchema>("Race", raceSchema);
