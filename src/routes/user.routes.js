import { Router } from "express";
import passport from "passport";
import {
  userLoginValidator,
  userRegisterValidator,
  userForgotPasswordValidator,
  userChangeCurrentPasswordValidator,
  userResetForgottenPasswordValidator,
} from "../validators/user.validators.js";
import {
  loginUser,
  logoutUser,
  verifyEmail,
  registerUser,
  getCurrentUser,
  updateUserAvatar,
  handleSocialLogin,
  refreshAccessToken,
  forgotPasswordRequest,
  changeCurrentPassword,
  resetForgottenPassword,
  resendEmailVerification,
} from "../controllers/user.controllers.js";
import { validate } from "../validators/validate.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

// Unsecured route
router
  .route("/register")
  .post(
    upload.single("avatar"),
    userRegisterValidator(),
    validate,
    registerUser
  );
router.route("/login").post(userLoginValidator(), validate, loginUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/verify-email/:verificationToken").get(verifyEmail);

router
  .route("/forgot-password")
  .post(userForgotPasswordValidator(), validate, forgotPasswordRequest);
router
  .route("/reset-password/:resetToken")
  .post(
    userResetForgottenPasswordValidator(),
    validate,
    resetForgottenPassword
  );

// Secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router
  .route("/avatar")
  .patch(verifyJWT, upload.single("avatar"), updateUserAvatar);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router
  .route("/change-password")
  .post(
    verifyJWT,
    userChangeCurrentPasswordValidator(),
    validate,
    changeCurrentPassword
  );
router
  .route("/resend-email-verification")
  .post(verifyJWT, resendEmailVerification);

// SSO routes
router.route("/google").get(
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
  (req, res) => {
    res.send("redirecting to google...");
  }
);

router.route("/github").get(
  passport.authenticate("github", {
    scope: ["profile", "email"],
  }),
  (req, res) => {
    res.send("redirecting to github...");
  }
);

router.route("/google/callback").get(
  passport.authenticate("google", {
    failureRedirect: `${process.env.CLIENT_SSO_FAILURE_REDIRECT_URL}?error=SSOError&error_description=Authentication Failed`,
  }),
  handleSocialLogin
);

router.route("/github/callback").get(
  passport.authenticate("github", {
    failureRedirect: `${process.env.CLIENT_SSO_FAILURE_REDIRECT_URL}?error=SSOError&error_description=Authentication Failed`,
  }),
  handleSocialLogin
);

export default router;
