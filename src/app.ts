import * as cors from "cors";
import * as express from "express";
import * as cookieParser from "cookie-parser";
import * as passport from "passport";
import { serve, setup } from "swagger-ui-express";
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
console.log(dir);
app.use(
  "/uploads",
  express.static(dir, {
    maxAge: "1y"
  })
);

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use("/api/v1/", router); // Routes

// TODO - add swagger-jsdoc
app.use(
  "/docs",
  serve,
  setup(undefined, {
    swaggerOptions: {
      url: "/swagger.json"
    }
  })
);

app.all("*", (req, res) => {
  res.statusCode = 404;
  res.json({ status: "success", message: "404", success: false });
});

export { app };
