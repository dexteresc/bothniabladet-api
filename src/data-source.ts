import "reflect-metadata";
import { DataSource } from "typeorm";
import config from "./config/database";

// eslint-disable-next-line import/prefer-default-export
export const AppDataSource = new DataSource(config);
