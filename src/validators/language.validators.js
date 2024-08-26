import { body } from "express-validator";

const languageValidator = () => {
  return [
    body("title").trim().notEmpty().withMessage("Language title is required"),
    body("value").trim().notEmpty().withMessage("Language value is required"),
  ];
};

export { languageValidator };
