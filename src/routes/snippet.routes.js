import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {
  createSnippet,
  deleteSnippet,
  getFavoriteSnippets,
  getSnippetById,
  getSnippetCount,
  getSnippets,
  getTrashSnippets,
  getUniqueLanguagesCount,
  markFavorite,
  moveSnippetToTrash,
  restoreSnippetFromTrash,
  unmarkFavorite,
  updateSnippet,
} from "../controllers/snippet.controllers.js";
import {
  createSnippetValidator,
  updateSnippetValidator,
} from "../validators/snippet.validators.js";
import { validate } from "../validators/validate.js";

const router = Router();

router.route("/").get(verifyJWT, getSnippets);
router.route("/favorites").get(verifyJWT, getFavoriteSnippets);
router.route("/trash").get(verifyJWT, getTrashSnippets);
router.route("/languages").get(verifyJWT, getUniqueLanguagesCount);
router.route("/count").get(verifyJWT, getSnippetCount);
router.route("/:snippetId").get(verifyJWT, getSnippetById);

router
  .route("/")
  .post(verifyJWT, createSnippetValidator(), validate, createSnippet);
router
  .route("/:snippetId")
  .patch(verifyJWT, updateSnippetValidator(), validate, updateSnippet);

router.route("/:snippetId").delete(verifyJWT, deleteSnippet);

router.route("/:snippetId/favorite").patch(verifyJWT, markFavorite);
router.route("/:snippetId/unfavorite").patch(verifyJWT, unmarkFavorite);

router.route("/:snippetId/trash").patch(verifyJWT, moveSnippetToTrash);
router.route("/:snippetId/restore").patch(verifyJWT, restoreSnippetFromTrash);

export default router;
