import { Router } from "express";
import { AppDataSource } from "../../data-source";
import { Photo } from "../../entity/Photo";
import { User } from "../../entity/User";
const router = Router();

// USERS
// fetch all users from the database
router.get("/user", async (req, res) => {
  const users = await AppDataSource.manager.find(User);
  res.send(users);
});

// find a user by id
router.get("/user/:id", async (req, res) => {
  // try to convert the id to a number
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).send("Id must be a number");
    return;
  }
  const user = await AppDataSource.manager.findOneBy(User, { id });
  res.send(user);
});

// create a new user
router.post("/user", async (req, res) => {
  const user = new User();
  user.firstName = req.body.firstName;
  user.lastName = req.body.lastName;
  user.email = req.body.email;
  await AppDataSource.manager.save(user);
  res.send(user);
});

// update a user

router.put("/user/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
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
router.delete("/user/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
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

// PHOTOS
// fetch all photos from the database
router.get("/photo", async (req, res) => {
  const photos = await AppDataSource.manager.find(Photo);
  res.send(photos);
});

// find a photo by id
router.get("/photo/:id", async (req, res) => {
  // try to convert the id to a number
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).send("Id must be a number");
    return;
  }
  const photo = await AppDataSource.manager.findOneBy(Photo, { id });
  res.send(photo);
});

// create a new photo
router.post("/photo", async (req, res) => {
  const photo = new Photo();
  photo.title = req.body.title;
  photo.url = req.body.url;
  photo.userId = req.body.userId;
  await AppDataSource.manager.save(photo);
  res.send(photo);
});
