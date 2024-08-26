import express from "express";
import cors from "cors";
import passport from "./passport/index.js";
import session from "express-session";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import morganMiddleware from "./logger/morgan.logger.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

// Rate limiter to avoid misuse of the service and avoid cost spikes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Limit each IP to 500 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  keyGenerator: (req, res) => {
    return req.clientIp; // IP address from requestIp.mw(), as opposed to req.ip
  },
  handler: (_, __, ___, options) => {
    throw new ApiError(
      options.statusCode || 500,
      `There are too many requests. You are only allowed ${
        options.max
      } requests per ${options.windowMs / 60000} minutes`
    );
  },
});

app.use(limiter);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// required for passport
app.use(
  session({
    secret: process.env.EXPRESS_SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

app.use(morganMiddleware);

import { errorHandler } from "./middlewares/error.middlewares.js";
import userRouter from "./routes/user.routes.js";
import snippetRouter from "./routes/snippet.routes.js";
import tagRouter from "./routes/tag.routes.js";
import languageRouter from "./routes/language.routes.js";
import healthcheckRouter from "./routes/healthcheck.routes.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/snippets", snippetRouter);
app.use("/api/v1/tags", tagRouter);
app.use("/api/v1/languages", languageRouter);
app.use("/api/v1/healthcheck", healthcheckRouter);

app.use(errorHandler);

export { app };
