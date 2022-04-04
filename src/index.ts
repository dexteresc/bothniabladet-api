import "dotenv/config";
import { AppDataSource } from "./data-source";
import { User } from "./entity/User";
import * as express from "express";

AppDataSource.initialize()
  .then(async () => {
    console.log("Inserting a new user into the database...");
    const user = new User();
    user.firstName = "Timber";
    user.lastName = "Saw";
    user.email = "timer@saw.com";

    await AppDataSource.manager.save(user);
    console.log("Saved a new user with id: " + user.id);

    console.log("Loading users from the database...");
    const users = await AppDataSource.manager.find(User);
    console.log("Loaded users: ", users);

    const app = express();
    app.use(express.json());

    app.get("/", (req, res) => {
      res.send("Hello World!");
    });
    app.listen(process.env.PORT, () => {
      console.log(`Example app listening on port ${process.env.PORT}!`);
    });
  })
  .catch((error) => console.log(error));
