import { Router } from "express";
import { AppDataSource } from "../../data-source";
import { Category, Photo } from "../../models";

const categoryRouter = Router();

// fetch all categories from the database
categoryRouter.get("/", async (req, res) => {
  // Return all categories, sort by parentId, then by type (1 = folder, 2 = category), then by name
  const categories = await Category.find({
    order: {
      parentId: "ASC",
      type: "DESC",
      name: "ASC"
    }
  });
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

  // Find and remove all subcategories
  const subcategories = await AppDataSource.manager.find(Category, {
    where: { parentId: id }
  });

  AppDataSource.manager.remove([category, ...subcategories]);

  res.send(category);
});

// Get photos for a category
categoryRouter.get("/:id/photos", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) {
    res.status(400).send("Id must be a number");
    return;
  }
  const category = await Category.findOne({ where: { id } });
  if (!category) {
    res.status(404).send("Category not found");
    return;
  }

  const photos = await AppDataSource.manager.find(Photo, {
    where: { categories: { id } }
  });

  res.status(200).send(photos);
});

export default categoryRouter;
