import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
  path: "./.env",
});

connectDB()
  .then(() => {
    const port = process.env.PORT || 8080;
    app
      .listen(port, () => {
        console.log("⚙️ Server is running on port:", port);
      })
      .on("error", (error) => {
        console.log("⚙️ Server Initialization Error:", error);
      });
  })
  .catch((error) => {
    console.log("MongoDB Connection Error:", error);
  });

export default app;
