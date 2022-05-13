// User controller

import { pbkdf2 } from "crypto";
import { User } from "../models";
import { AppDataSource } from "../data-source";

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

/**
 * Creates a user
 * @param email The email of the user
 * @param password The password of the user
 * @returns The created user
 * @throws An error if the user already exists
 */
export async function createUser(
  email: string,
  password: string
): Promise<User> {
  // Check if user already exists
  if (await getUserByEmail(email)) {
    throw new Error("User already exists");
  }
  // Create user
  const user = new User();
  user.email = email;
  user.password = password;
  return AppDataSource.manager.save(user);
}

export const userSignUp = async (email: string, password: string) => {
  const user = await getUserByEmail(email);
  if (user) {
    throw new Error("User already exists");
  }
  if (!user) {
    // Signup dags
    pbkdf2(password, "salt", 100000, 64, "sha512", async (err, derivedKey) => {
      if (err) {
        throw err;
      }
      await createUser(email, derivedKey.toString("hex"));
    });
  }
  return false;
};

export const userSignIn = async (email: string, password: string) => {
  const user = await getUserByEmail(email);
  if (!user) {
    throw new Error("User not found");
  }
  pbkdf2(password, "salt", 100000, 64, "sha512", async (err, derivedKey) => {
    if (err) {
      throw err;
    }
    if (derivedKey.toString("hex") === user.password) {
      return user;
    }
    throw new Error("Invalid password");
  });
  return false;
};
