// User controller
import { User } from "../models";
import { AppDataSource } from "../data-source";

/**
 * Gets a user by email
 * @param email The email of the user
 * @returns The user with the given email
 */
function getUserByEmail(email: string): Promise<User> {
  return AppDataSource.manager.findOne(User, { where: { email } });
}

/**
 * Gets a user by id
 * @param id The id of the user
 * @returns The user with the given id
 */
function getUserById(id: number): Promise<User> {
  return AppDataSource.manager.findOne(User, { where: { id } });
}

/**
 * Creates a user
 * @param email The email of the user
 * @param password The password of the user
 * @returns The created user
 * @throws An error if the user already exists
 */
function createUser(email: string, password: string): Promise<User> {
  return AppDataSource.manager
    .findOne(User, { where: { email } })
    .then((user) => {
      if (user) {
        throw new Error("User already exists");
      }
      return AppDataSource.manager.save(User, { email, password });
    });
}

export { getUserByEmail, getUserById, createUser };
