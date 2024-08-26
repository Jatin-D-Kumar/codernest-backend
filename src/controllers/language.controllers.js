import mongoose from "mongoose";
import { Language } from "../models/language.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getAllLanguages = asyncHandler(async (req, res) => {
  const languages = await Language.find({});

  return res
    .status(200)
    .json(new ApiResponse(200, languages, "Languages fetched successfully"));
});

const addLanguage = asyncHandler(async (req, res) => {
  const userEmail = req.user.email;

  if (userEmail !== process.env.ADMIN_EMAIL) {
    throw new ApiError(401, "You are not allowed to access this service");
  }
  const { title, value } = req.body;

  const language = await Language.create({
    title,
    value,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, language, "Language added successfully"));
});

const updateLanguage = asyncHandler(async (req, res) => {
  const userEmail = req.user.email;

  if (userEmail !== process.env.ADMIN_EMAIL) {
    throw new ApiError(401, "You are not allowed to access this service");
  }

  const { title, value } = req.body;
  const { languageId } = req.params;

  const language = await Language.findOne({
    _id: new mongoose.Types.ObjectId(languageId),
  });

  if (!language) {
    throw new ApiError(404, "Language does not exist");
  }

  const updatedLanguage = await Language.findByIdAndUpdate(
    languageId,
    {
      $set: {
        title,
        value,
      },
    },
    {
      new: true,
    }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedLanguage, "Language updated successfully")
    );
});

const deleteLanguage = asyncHandler(async (req, res) => {
  const userEmail = req.user.email;

  if (userEmail !== process.env.ADMIN_EMAIL) {
    throw new ApiError(401, "You are not allowed to access this service");
  }

  const { languageId } = req.params;

  const language = await Language.findOne({
    _id: new mongoose.Types.ObjectId(languageId),
  });

  if (!language) {
    throw new ApiError(404, "Language does not exist");
  }

  await Language.findByIdAndDelete(languageId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Language deleted successfully"));
});

export { getAllLanguages, addLanguage, updateLanguage, deleteLanguage };
