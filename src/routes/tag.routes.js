import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {
  addTag,
  deleteTag,
  getAllTags,
  updateTag,
} from "../controllers/tag.controllers.js";
import { tagValidator } from "../validators/tag.validators.js";
import { validate } from "../validators/validate.js";

const router = Router();

router.route("/").get(verifyJWT, getAllTags);
router.route("/").post(verifyJWT, tagValidator(), validate, addTag);
router.route("/:tagId").patch(verifyJWT, tagValidator(), validate, updateTag);
router.route("/:tagId").delete(verifyJWT, deleteTag);

export default router;
