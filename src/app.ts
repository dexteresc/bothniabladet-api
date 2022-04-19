import * as cors from "cors";
import * as express from "express";
import * as passport from "passport";
import * as path from "path";
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

app.use(passport.initialize());
app.use(express.json({ limit: "10mb" })); // for parsing application/json
app.use(loggerMiddleware); // Logger
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
const dir = path.join(__dirname, "../uploads");
app.use(
  "/uploads",
  express.static(dir, {
    maxAge: "1y"
  })
);

// Download image
app.get("/uploads/:id/download", (req, res) => {
  const file = path.join(dir, req.params.id);
  res.download(file);
});

app.use("/api/v1/", router); // Routes

export { app };