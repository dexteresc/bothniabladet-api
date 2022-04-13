import { Router } from "express";
import { unlink } from "fs";
import * as multer from "multer";
import { AppDataSource } from "../../data-source";
import { Photo, User } from "../../models";

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });
const photoRouter = Router();

// fetch all photos from the database
photoRouter.get("/", async (req, res) => {
  const photos = await AppDataSource.manager.find(Photo);
  res.send(photos);
});

// search for photos by query
photoRouter.get("/search", async (req, res) => {
  const { query, limit } = req.query;

  if (!query) {
    res.status(400).send("Query is required");
    return;
  }
  if (typeof query !== "string") {
    res.status(400).send("Query must be a string");
    return;
  }
  const limitNum =
    limit && typeof limit === "string" ? parseInt(limit, 10) : undefined;
  // search for photos by full text search
  const photos = await AppDataSource.getRepository(Photo)
    .createQueryBuilder("photo")
    .leftJoinAndSelect("photo.categories", "category")
    .where("MATCH(title, description) AGAINST(:query IN BOOLEAN MODE)", {
      query
    })
    .orWhere("MATCH(category.name) AGAINST(:query IN BOOLEAN MODE)", {
      query
    })
    .take(limitNum)
    .getMany();

  res.send(photos);
});

// find a photo by id
photoRouter.get("/:id", async (req, res) => {
  // try to convert the id to a number
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) {
    res.status(400).send("Id must be a number");
    return;
  }
  const photo = await AppDataSource.manager.findOneBy(Photo, { id });
  if (!photo) {
    res.status(404).send("Photo not found");
    return;
  }
  res.send(photo);
});

// create a new photo
photoRouter.post("", upload.single("file"), async (req, res) => {
  // Get path to file
  const { filename } = req.file;
  const photo = new Photo();
  photo.title = req.body.title;
  photo.description = req.body.description;
  photo.url = `/uploads/${filename}`;

  await AppDataSource.manager.save(photo);
  res.send(photo);
});

// update a photo
photoRouter.put("/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) {
    res.status(400).send("Id must be a number");
    return;
  }
  const photo = await AppDataSource.manager.findOneBy(Photo, { id });
  if (!photo) {
    res.status(404).send("Photo not found");
    return;
  }
  photo.title = req.body.title;
  photo.url = req.body.url;
  // Get user
  const userId = parseInt(req.body.userId, 10);
  if (Number.isNaN(userId)) {
    res.status(400).send("UserId must be a number");
    return;
  }
  const user = await AppDataSource.manager.findOneBy(User, { id: userId });
  if (!user) {
    res.status(404).send("User not found");
    return;
  }
  photo.user = user;

  await AppDataSource.manager.save(photo);
  res.send(photo);
});

// delete a photo
photoRouter.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) {
    res.status(400).send("Id must be a number");
    return;
  }
  const photo = await AppDataSource.manager.findOneBy(Photo, { id });
  if (!photo) {
    res.status(404).send("Photo not found");
    return;
  }

  // Delete file
  const { url } = photo;

  // Remove file from the file system
  unlink(url, (err) => {
    if (err) {
      // eslint-disable-next-line no-console
      console.log(err);
    }
  });

  await AppDataSource.manager.remove(photo);
  res.send(photo);
});

export default photoRouter;
