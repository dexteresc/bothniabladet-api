import { pbkdf2Sync, randomBytes } from "crypto";

/**
 * This function takes a plain text password and creates a salt and hash out of it.
 * @param password The plain text password
 * @returns Hash and salt
 */
export const genPassword = (password: string) => {
  const salt = randomBytes(16).toString("hex");
  const hash = pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
  return {
    salt,
    hash
  };
};

/**
 * This function takes a plain text password and a hash and salt and checks if the password is correct.
 * @param password The plain text password
 * @param hash The hash
 * @param salt The salt
 * @returns True if the password matches the hash and salt, false otherwise
 */
export const validPassword = (password: string, hash: string, salt: string) => {
  const newHash = pbkdf2Sync(password, salt, 100000, 64, "sha512").toString(
    "hex"
  );
  return newHash === hash;
};
