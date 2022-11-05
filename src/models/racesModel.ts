/**
 * Created by
 * Łukasz Dawidowicz
 * @2022
 **/

import mongoose, { Model } from "mongoose";

export interface IRaceSchema {
  name: string;
  buildings?: any;
  description: string;
}

const raceSchema = new mongoose.Schema<IRaceSchema, Model<IRaceSchema>>(
  {
    name: {
      type: String,
      unique: true,
    },
    description: String,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

raceSchema.virtual("buildings", {
  ref: "Building",
  foreignField: "race",
  localField: "name",
});

raceSchema.pre(/^find/, function (next) {
  this.populate({
    path: "buildings",
  });

  next();
});

export const Race = mongoose.model<IRaceSchema>("Race", raceSchema);
