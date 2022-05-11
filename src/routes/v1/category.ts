import { Router } from "express";
import { AppDataSource } from "../../data-source";
import { Category, Photo } from "../../models";

const categoryRouter = Router();

// fetch all categories from the database
categoryRouter.get("/", async (req, res) => {
  const categories = await AppDataSource.manager.find(Category);
  res.send(categories);
});

// find a category by id
categoryRouter.get("/:id", async (req, res) => {
  // try to convert the id to a number
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) {
    res.status(400).send("Id must be a number");
    return;
  }
  const category = await AppDataSource.manager.findOneBy(Category, { id });
  res.send(category);
});

// create a new category
categoryRouter.post("", async (req, res) => {
  const category = new Category();
  category.name = req.body.name;
  category.type = req.body.type;
  category.parentId = req.body.parentId;
  await AppDataSource.manager.save(category);
  res.send(category);
});

// update a category
categoryRouter.put("/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) {
    res.status(400).send("Id must be a number");
    return;
  }
  const category = await AppDataSource.manager.findOneBy(Category, { id });
  if (!category) {
    res.status(404).send("Category not found");
    return;
  }
  category.name = req.body.name;
  category.type = req.body.type;
  category.parentId = req.body.parentId;
  
  await AppDataSource.manager.save(category);
  res.send(category);
});

// delete a category
categoryRouter.delete("/:id", async (req, res) => {
  // Check that no photos are associated with the category
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) {
    res.status(400).send("Id must be a number");
    return;
  }
  const category = await AppDataSource.manager.findOneBy(Category, { id });
  if (!category) {
    res.status(404).send("Category not found");
    return;
  }
  const photos = await AppDataSource.manager.find(Photo, {
    where: { categories: { id } }
  });
  if (photos.length > 0) {
    res.status(400).send("Category has photos associated with it");
    return;
  }
  await AppDataSource.manager.remove(category);
  res.send(category);
});

export default categoryRouter;
