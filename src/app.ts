import cors = require("cors");
import express = require("express");
import { existsSync, mkdirSync } from "fs";
import passport = require("passport");
import path = require("path");
import passportMiddleware from "./middleware/passport.middleware";
import router from "./routes/v1";

function loggerMiddleware(
  request: express.Request,
  response: express.Response,
  next: express.NextFunction
) {
  // eslint-disable-next-line no-console
  console.log(`${request.method} ${request.path}`);
  next();
}
const app = express();

app.use(express.json({ limit: "10mb" })); // for parsing application/json
app.use(loggerMiddleware); // Logger
passportMiddleware(passport);
app.use(passport.initialize());

// CORS
const whitelist = process.env.WHITELISTED_DOMAINS
  ? process.env.WHITELISTED_DOMAINS.split(",")
  : [];

app.use(
  cors({
    origin: (origin, callback) => {
      if (whitelist.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    }
  })
);

// Host images
export const dir = path.join(__dirname, "../uploads");
// Check if dir exists
if (!existsSync(dir)) {
  // Create dir
  mkdirSync(dir);
  console.log("Created uploads directory"); // eslint-disable-line no-console
}

app.use(
  "/uploads",
  express.static(dir, {
    maxAge: "1m",
    immutable: true
  })
);

// Download image
app.get("/uploads/:name/download", (req, res) => {
  const { name } = req.params;
  const file = path.join(dir, name);
  res.download(file);
});

app.use("/api/v1/", router); // Routes

export { app };
