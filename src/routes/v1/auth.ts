import { Router } from "express";
import { sign } from "jsonwebtoken";
import passport = require("passport");
import { validPassword } from "../../config/utils";
import { createUser, getUserByEmail } from "../../controller/user.controller";
import { User } from "../../models";

const authRouter = Router();
// create a new user

authRouter.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).send("Missing email or password");
    return;
  }
  try {
    const user = await getUserByEmail(email);
    if (user) {
      res.status(400).send("User already exists");
      return;
    }
    if (!user) {
      await createUser(email, password);
    }
    res.status(201).send("User created");
  } catch (err) {
    res.status(500).send(err);
  }
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).send("Please enter email and password");
    return;
  }
  try {
    const user = await getUserByEmail(email);
    if (!user) {
      res.status(404).send("User not found");
      return;
    }
    const { hash, salt, ...resUser } = user;
    if (validPassword(password, hash, salt)) {
      const token = sign({ user }, process.env.JWT_SECRET);
      res.status(200).send({ token, user: resUser });
    } else {
      res.status(401).send("Invalid password");
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

// Validate token and return user
authRouter.get(
  "/validate",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (req.user) {
      // Send back all user details except password
      const { hash, salt, ...user } = req.user as User;
      res.status(200).send(user);
      return;
    }
    res.status(401).send("Invalid token");
  }
);

export default authRouter;
