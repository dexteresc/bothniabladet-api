import { Router } from "express";
import photoRouter from "./photo";
import userRouter from "./user";
import categoryRouter from "./category";
import authRouter from "./auth";

const router = Router();

router.use("/photo", photoRouter);
router.use("/user", userRouter);
router.use("/category", categoryRouter);
router.use("/auth", authRouter);

export default router;
