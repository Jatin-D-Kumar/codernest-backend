import { body } from "express-validator";

const tagValidator = () => {
  return [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Tag name is required")
      .isLength({ max: 15 })
      .withMessage("Tag cannot be greater than 15 characters"),
  ];
};

export { tagValidator };
