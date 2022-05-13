import { Router } from "express";
import { User } from "../../models";
import { userSignUp } from "../../controller/user.controller";
import { logIn } from "../../middleware/passport.middleware";

const authRouter = Router();
// create a new user

authRouter.post("/signup", async (req, res) => {
  const user = new User();

  user.email = req.body.email;
  user.password = req.body.password;

  try {
    await userSignUp(user.email, user.password);
    res.send(user);
  } catch (err) {
    res.status(500).send(err);
  }
});

authRouter.post("/login", async (req, res) => {
  const user = await logIn(req.body.email, req.body.password);
  if (user) {
    res.send(user);
  } else {
    res.status(500).send("Invalid email or password");
  }
});

export default authRouter;
