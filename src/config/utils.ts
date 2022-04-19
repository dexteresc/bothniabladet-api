import { hashSync } from "bcrypt";

export const generateHashedPassword = (password: string): string =>
  hashSync(password, 10);
