import mongoose from "mongoose";
import { Tag } from "../models/tag.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getAllTags = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, name = null } = req.query;

  let query = Tag.find({ author: req.user._id });

  if (name) {
    query = query.where("name").regex(new RegExp(name, "i"));
  }

  const totalCount = await Tag.countDocuments(query);

  // Apply pagination
  const skip = (page - 1) * limit;
  query = query.skip(skip).limit(limit);

  const tags = await query.exec();

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        tags,
        page: page,
        totalPages: Math.ceil(totalCount / limit),
      },
      "Tags fetched successfully"
    )
  );
});

const addTag = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const tag = await Tag.create({
    name,
    author: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, tag, "Tag created successfully"));
});

const updateTag = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const { tagId } = req.params;

  const tag = await Tag.findOne({
    _id: new mongoose.Types.ObjectId(tagId),
    author: req.user?._id,
  });

  if (!tag) {
    throw new ApiError(404, "Tag does not exist");
  }

  const updatedTag = await Tag.findByIdAndUpdate(
    tagId,
    {
      $set: {
        name: name,
      },
    },
    { new: true }
  );

  return res
    .status(201)
    .json(new ApiResponse(201, updatedTag, "Tag updated successfully"));
});

const deleteTag = asyncHandler(async (req, res) => {
  const { tagId } = req.params;

  const tag = await Tag.findOne({
    _id: new mongoose.Types.ObjectId(tagId),
    author: req.user?._id,
  });

  if (!tag) {
    throw new ApiError(404, "Tag does not exist");
  }

  await Tag.findByIdAndDelete(tagId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Tag deleted successfully"));
});

export { getAllTags, addTag, updateTag, deleteTag };
