import { body } from "express-validator";

const createSnippetValidator = () => {
  return [
    body("title")
      .trim()
      .notEmpty()
      .withMessage("Title is required")
      .isLength({ min: 3 })
      .withMessage("Title must be at least 3 characters long")
      .isLength({ max: 30 })
      .withMessage("Title cannot be longer than 30 characters"),
    body("description")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Description must be at least 3 characters long")
      .isLength({ max: 100 })
      .withMessage("Description cannot be longer than 100 characters"),
    body("code")
      .trim()
      .notEmpty()
      .withMessage("Snippet is required")
      .isLength({ max: 1000 })
      .withMessage("Snippet cannot be longer than 1000 characters"),
    body("language").trim().notEmpty().withMessage("Language is required"),
    body("tags").isArray({ max: 5 }).withMessage("Tags cannot exceed 5 items"),
  ];
};

const updateSnippetValidator = () => {
  return [
    body("title")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Title must be at least 3 characters long")
      .isLength({ max: 30 })
      .withMessage("Title cannot be longer than 30 characters"),
    body("description")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Description must be at least 3 characters long")
      .isLength({ max: 100 })
      .withMessage("Description cannot be longer than 100 characters"),
    body("code")
      .trim()
      .isLength({ max: 1000 })
      .withMessage("Snippet cannot be longer than 1000 characters"),
    body("language").trim(),
    body("tags").isArray({ max: 5 }).withMessage("Tags cannot exceed 5 items"),
  ];
};

export { createSnippetValidator, updateSnippetValidator };
