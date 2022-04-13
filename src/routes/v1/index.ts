import { Router } from "express";
import * as passport from "passport";
import photoRouter from "./photo";
import userRouter from "./user";
import categoryRouter from "./category";
import { Passport } from "../../middleware";

const router = Router();

Passport(passport);

router.use("/photo", photoRouter);
router.use("/user", userRouter);
router.use("/category", categoryRouter);

export default router;
