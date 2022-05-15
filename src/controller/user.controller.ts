import { User } from "../models";
import { AppDataSource } from "../data-source";
import { genPassword } from "../config/utils";

/**
 * Gets a user by email
 * @param email The email of the user
 * @returns The user with the given email
 */
export function getUserByEmail(email: string): Promise<User> {
  return User.findOneBy({ email });
}

/**
 * Gets a user by id
 * @param id The id of the user
 * @returns The user with the given id
 */
export function getUserById(id: number): Promise<User> {
  return AppDataSource.manager.findOne(User, { where: { id } });
}

export function createUser(email: string, password: string): Promise<User> {
  const { hash, salt } = genPassword(password);
  return User.create({ email, hash, salt }).save();
}
