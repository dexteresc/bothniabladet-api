import { Router } from "express";
import { unlink } from "fs";
import multer = require("multer");
import { join } from "path";
import { In } from "typeorm";
import { AppDataSource } from "../../data-source";
import { Category, Photo, User } from "../../models";
import storage from "../../middleware/multer.middleware";
import { dir } from "../../app";

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
  const { title, description, categories, userId } = req.body;
  const { filename } = req.file;
  const photo = new Photo();
  photo.title = title;
  photo.description = description;
  photo.url = `/uploads/${filename}`;
  photo.user = await User.findOneBy({ id: userId });
  // Find categories and add them to the photo using in operator
  if (categories) {
    // Turn string "[1,2,3,4]" into array
    const categoryIds = JSON.parse(categories);
    if (categoryIds.length > 0) {
      photo.categories = await Category.findBy({ id: In(categoryIds) });
    }
  }

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
  const photo = await AppDataSource.manager.findOneBy(Photo, { id }); // find the photo
  if (!photo) {
    res.status(404).send("Photo not found");
    return;
  }

  const url = join(dir, "../", photo.url); // get the full path to the file

  // Remove file from the file system
  unlink(url, async (err) => {
    if (err) {
      res.status(500).send("Error deleting file");
      return;
    }
    await AppDataSource.manager.remove(photo); // delete the photo from the database
    res.send(photo);
  });
});

export default photoRouter;
