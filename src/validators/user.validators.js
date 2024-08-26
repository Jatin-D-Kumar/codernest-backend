import { body } from "express-validator";

const userRegisterValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),
    body("username")
      .trim()
      .notEmpty()
      .withMessage("Username is required")
      .isLowercase()
      .withMessage("Username must be lowercase")
      .isLength({ min: 3 })
      .withMessage("Username must be 3 characters long"),
    body("password").trim().notEmpty().withMessage("Password is required"),
  ];
};

const userLoginValidator = () => {
  return [
    body("email").trim().optional().isEmail().withMessage("Email is invalid"),
    body("username").trim().optional(),
    body("password").trim().notEmpty().withMessage("Password is required"),
  ];
};

const userForgotPasswordValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),
  ];
};

const userChangeCurrentPasswordValidator = () => {
  return [
    body("oldPassword")
      .trim()
      .notEmpty()
      .withMessage("Old password is required"),
    body("newPassword")
      .trim()
      .notEmpty()
      .withMessage("New Password is required"),
  ];
};

const userResetForgottenPasswordValidator = () => {
  return [
    body("newPassword")
      .trim()
      .notEmpty()
      .withMessage("New password is required"),
  ];
};

export {
  userRegisterValidator,
  userLoginValidator,
  userForgotPasswordValidator,
  userChangeCurrentPasswordValidator,
  userResetForgottenPasswordValidator,
};
