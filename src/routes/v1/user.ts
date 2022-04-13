import { Router } from "express";
import { AppDataSource } from "../../data-source";
import { User } from "../../models";

const userRouter = Router();

// fetch all users from the database
userRouter.get("/", async (req, res) => {
  const users = await AppDataSource.manager.find(User);
  res.send(users);
});

// find a user by id
userRouter.get("/:id", async (req, res) => {
  // try to convert the id to a number
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) {
    res.status(400).send("Id must be a number");
    return;
  }
  const user = await AppDataSource.manager.findOneBy(User, { id });
  res.send(user);
});

// create a new user
userRouter.post("", async (req, res) => {
  const user = new User();
  user.firstName = req.body.firstName;
  user.lastName = req.body.lastName;
  user.email = req.body.email;
  await AppDataSource.manager.save(user);
  res.send(user);
});

// update a user
userRouter.put("/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) {
    res.status(400).send("Id must be a number");
    return;
  }
  const user = await AppDataSource.manager.findOneBy(User, { id });
  if (!user) {
    res.status(404).send("User not found");
    return;
  }
  user.firstName = req.body.firstName;
  user.lastName = req.body.lastName;
  user.email = req.body.email;
  await AppDataSource.manager.save(user);
  res.send(user);
});

// delete a user
userRouter.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) {
    res.status(400).send("Id must be a number");
    return;
  }
  const user = await AppDataSource.manager.findOneBy(User, { id });
  if (!user) {
    res.status(404).send("User not found");
    return;
  }
  await AppDataSource.manager.remove(user);
  res.send(user);
});

export default userRouter;
