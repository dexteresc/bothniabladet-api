import { Router } from "express";
import passport = require("passport");
import photoRouter from "./photo";
import userRouter from "./user";
import categoryRouter from "./category";
import authRouter from "./auth";

const router = Router();
// Add authenticate middleware to all routes except auth

router.use(
  "/photo",
  passport.authenticate("jwt", { session: false }),
  photoRouter
);
router.use(
  "/user",
  passport.authenticate("jwt", { session: false }),
  userRouter
);
router.use(
  "/category",
  passport.authenticate("jwt", { session: false }),
  categoryRouter
);
router.use("/auth", authRouter);

export default router;
