import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {
  addLanguage,
  deleteLanguage,
  getAllLanguages,
  updateLanguage,
} from "../controllers/language.controllers.js";
import { languageValidator } from "../validators/language.validators.js";
import { validate } from "../validators/validate.js";

const router = Router();

router.route("/").get(verifyJWT, getAllLanguages);
router.route("/").post(verifyJWT, languageValidator(), validate, addLanguage);
router
  .route("/:languageId")
  .patch(verifyJWT, languageValidator(), validate, updateLanguage);
router.route("/:languageId").delete(verifyJWT, deleteLanguage);

export default router;
