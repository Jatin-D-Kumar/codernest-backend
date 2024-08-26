import mongoose, { Schema } from "mongoose";

const LanguageSchema = new Schema(
  {
    title: {
      type: String,
      unique: true,
      required: true,
    },
    value: {
      type: String,
      unique: true,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Language = mongoose.model("Language", LanguageSchema);
