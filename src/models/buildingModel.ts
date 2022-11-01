/**
 * Created by
 * Łukasz Dawidowicz
 * @2022
 **/
import mongoose, { Model } from "mongoose";

interface IBuildingSchema {
  buildingName: string;
  description?: string;
  race: string;
  buildingType?: string;
  level: number;
  bonus?: string[];
}

const buildingSchema = new mongoose.Schema<
  IBuildingSchema,
  Model<IBuildingSchema>
>(
  {
    buildingName: String,
    description: String,
    buildingType: String,
    level: {
      type: Number,
      default: 1,
    },
    bonus: [String],
    race: {
      type: String,
      enum: ["orc", "human", "elvs", "nekro"],
    },
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
