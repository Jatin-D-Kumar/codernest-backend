import mongoose, { Schema } from "mongoose";

const SnippetSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
    },
    code: {
      type: String,
      required: true,
    },
    language: {
      type: Schema.Types.ObjectId,
      ref: "Language",
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
    tags: {
      type: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
      default: [],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Snippet = mongoose.model("Snippet", SnippetSchema);
