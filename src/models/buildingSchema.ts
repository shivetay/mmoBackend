/**
 * Created by
 * Łukasz Dawidowicz
 * @2022
 **/
import mongoose, { Model, Schema, Types } from "mongoose";

interface IBuildingSchema {
  name: string;
  description: string;
  race: string;
  buildingType: string;
  level: number;
  bonus: string[];
}

const buildingSchema = new mongoose.Schema<
  IBuildingSchema,
  Model<IBuildingSchema>
>(
  {
    name: String,
    description: String,
    buildingType: String,
    level: {
      type: Number,
      default: 1,
    },
    bonus: [String],
    race: String,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const Building = mongoose.model<IBuildingSchema>(
  "Building",
  buildingSchema
);
