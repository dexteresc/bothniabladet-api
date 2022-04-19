import { DataSourceOptions } from "typeorm";
import { Category, Photo, User } from "../models";

const config: DataSourceOptions = {
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: process.env.DB_PD,
  database: "bothniabladet",
  synchronize: true,
  logging: false,
  entities: [User, Photo, Category],
  migrations: [],
  subscribers: []
};

export default config;
