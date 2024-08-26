import mongoose, { Schema } from "mongoose";

const TagSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Tag = mongoose.model("Tag", TagSchema);
