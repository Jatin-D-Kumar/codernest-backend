import mongoose from "mongoose";
import { Snippet } from "../models/snippet.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getSnippets = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 15,
    title = null,
    tag = null,
    language = null,
  } = req.query;

  let query = Snippet.find({ isDeleted: false, author: req.user._id });

  if (title) {
    query = query.where("title").regex(new RegExp(title, "i"));
  }

  // apply tag filter
  if (tag) {
    query = query.where("tags").in([tag]);
  }

  // apply language filter
  if (language) {
    query = query.where("language").equals(language);
  }

  // Apply sorting (recent first by default)
  query = query.sort("-createdAt");

  const totalCount = await Snippet.countDocuments(query);

  // Apply pagination
  const skip = (page - 1) * limit;
  query = query.skip(skip).limit(limit);

  // populate data
  query = query
    .populate("language")
    .populate({ path: "tags", select: "-author" });

  // Execute the query
  const snippets = await query.exec();

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        snippets,
        page: page,
        totalPages: Math.ceil(totalCount / limit),
      },
      "Snippets fetched successfully"
    )
  );
});

const getFavoriteSnippets = asyncHandler(async (req, res) => {
  const { page = 1, limit = 15, tag = null } = req.query;

  let query = Snippet.find({
    isDeleted: false,
    isFavorite: true,
    author: req.user._id,
  });

  // apply tag filter
  if (tag) {
    query = query.where("tags").in([tag]);
  }

  // Apply sorting (recent first by default)
  query = query.sort("-createdAt");

  const totalCount = await Snippet.countDocuments(query);

  // Apply pagination
  const skip = (page - 1) * limit;
  query = query.skip(skip).limit(limit);

  // populate data
  query = query.populate("language").populate("tags");

  // Execute the query
  const snippets = await query.exec();

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        snippets,
        page: page,
        totalPages: Math.ceil(totalCount / limit),
      },
      "Favorite snippets fetched successfully"
    )
  );
});

const getTrashSnippets = asyncHandler(async (req, res) => {
  const { page = 1, limit = 15, tag = null } = req.query;

  let query = Snippet.find({
    isDeleted: true,
    author: req.user._id,
  });

  // apply tag filter
  if (tag) {
    query = query.where("tags").in([tag]);
  }

  // Apply sorting (recent first by default)
  query = query.sort("-createdAt");

  const totalCount = await Snippet.countDocuments(query);

  // Apply pagination
  const skip = (page - 1) * limit;
  query = query.skip(skip).limit(limit);

  // populate data
  query = query.populate("language").populate("tags");

  // Execute the query
  const snippets = await query.exec();

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        snippets,
        page: page,
        totalPages: Math.ceil(totalCount / limit),
      },
      "Trash snippets fetched successfully"
    )
  );
});

const createSnippet = asyncHandler(async (req, res) => {
  const { title, description, code, language, tags = [] } = req.body;

  const snippet = await Snippet.create({
    title,
    description,
    code,
    language,
    tags,
    author: req.user._id,
  });

  if (!snippet) {
    throw new ApiError(500, "Error while creating a snippet");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, snippet, "Snippet created successfully"));
});

const updateSnippet = asyncHandler(async (req, res) => {
  const { title, description, code, language, tags } = req.body;
  const { snippetId } = req.params;

  const snippet = await Snippet.findOne({
    _id: new mongoose.Types.ObjectId(snippetId),
    author: req.user?._id,
  });

  if (!snippet) {
    throw new ApiError(404, "Snippet does not exist");
  }

  const updatedSnippet = await Snippet.findByIdAndUpdate(
    snippetId,
    {
      $set: {
        title,
        description,
        code,
        language,
        tags,
      },
    },
    {
      new: true,
    }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedSnippet, "Snippet updated successfully"));
});

const deleteSnippet = asyncHandler(async (req, res) => {
  const { snippetId } = req.params;

  const snippet = await Snippet.findOne({
    _id: new mongoose.Types.ObjectId(snippetId),
    author: req.user?._id,
  });

  if (!snippet) {
    throw new ApiError(404, "Snippet does not exist");
  }

  await Snippet.findByIdAndDelete(snippetId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Snippet deleted successfully"));
});

const moveSnippetToTrash = asyncHandler(async (req, res) => {
  const { snippetId } = req.params;

  const snippet = await Snippet.findOne({
    _id: new mongoose.Types.ObjectId(snippetId),
    author: req.user?._id,
  });

  if (!snippet) {
    throw new ApiError(404, "Snippet does not exist");
  }

  await Snippet.findByIdAndUpdate(
    snippetId,
    {
      $set: {
        isDeleted: true,
      },
    },
    {
      new: true,
    }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Snippet moved to trash"));
});

const restoreSnippetFromTrash = asyncHandler(async (req, res) => {
  const { snippetId } = req.params;

  const snippet = await Snippet.findOne({
    _id: new mongoose.Types.ObjectId(snippetId),
    author: req.user?._id,
  });

  if (!snippet) {
    throw new ApiError(404, "Snippet does not exist");
  }

  const restoredSnippet = await Snippet.findByIdAndUpdate(
    snippetId,
    {
      $set: {
        isDeleted: false,
      },
    },
    {
      new: true,
    }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, restoredSnippet, "Snippet restored from trash"));
});

const markFavorite = asyncHandler(async (req, res) => {
  const { snippetId } = req.params;

  const snippet = await Snippet.findOne({
    _id: new mongoose.Types.ObjectId(snippetId),
    author: req.user?._id,
  });

  if (!snippet) {
    throw new ApiError(404, "Snippet does not exist");
  }

  const updatedSnippet = await Snippet.findByIdAndUpdate(
    snippetId,
    {
      $set: {
        isFavorite: true,
      },
    },
    {
      new: true,
    }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedSnippet,
        "Snippet added to favorites successfully"
      )
    );
});

const unmarkFavorite = asyncHandler(async (req, res) => {
  const { snippetId } = req.params;

  const snippet = await Snippet.findOne({
    _id: new mongoose.Types.ObjectId(snippetId),
    author: req.user?._id,
  });

  if (!snippet) {
    throw new ApiError(404, "Snippet does not exist");
  }

  const updatedSnippet = await Snippet.findByIdAndUpdate(
    snippetId,
    {
      $set: {
        isFavorite: false,
      },
    },
    {
      new: true,
    }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedSnippet,
        "Snippet removed from favorites successfully"
      )
    );
});

const getSnippetById = asyncHandler(async (req, res) => {
  const { snippetId } = req.params;
  const snippet = await Snippet.findOne({
    _id: new mongoose.Types.ObjectId(snippetId),
    author: req.user?._id,
  })
    .populate("language")
    .populate("tags");

  if (!snippet) {
    throw new ApiError(404, "Snippet does not exist");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, snippet, "Fetched snippet by id successfully"));
});

const getUniqueLanguagesCount = asyncHandler(async (req, res) => {
  const result = await Snippet.aggregate([
    { $match: { author: req.user._id, isDeleted: false } },
    { $group: { _id: "$language", count: { $sum: 1 } } },
    {
      $lookup: {
        from: "languages",
        localField: "_id",
        foreignField: "_id",
        as: "language",
      },
    },
    { $unwind: "$language" },
    {
      $project: {
        _id: "$language._id",
        title: "$language.title",
        value: "$language.value",
        count: 1,
      },
    },
    { $sort: { count: -1 } },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        result,
        "Fetched user languages with count successfully"
      )
    );
});

const getSnippetCount = asyncHandler(async (req, res) => {
  const [totalCount, favoriteSnippetCount] = await Promise.all([
    Snippet.countDocuments({ isDeleted: false, author: req.user._id }),
    Snippet.countDocuments({
      isDeleted: false,
      isFavorite: true,
      author: req.user._id,
    }),
  ]);

  // Respond with the counts in a structured JSON format
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { totalCount, favoriteSnippetCount },
        "Fetched snippet counts successfully"
      )
    );
});

export {
  getSnippets,
  getFavoriteSnippets,
  getTrashSnippets,
  createSnippet,
  updateSnippet,
  deleteSnippet,
  moveSnippetToTrash,
  restoreSnippetFromTrash,
  markFavorite,
  unmarkFavorite,
  getSnippetById,
  getUniqueLanguagesCount,
  getSnippetCount,
};
