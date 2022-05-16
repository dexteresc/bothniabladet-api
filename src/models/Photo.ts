/* eslint-disable import/prefer-default-export */
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { Category } from "./Category";
import { User } from "./User";

@Entity()
@Index(["title", "description"], { fulltext: true })
export class Photo extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @ManyToOne(() => User, (user) => user.photos)
  user: User | undefined;

  @ManyToMany(() => Category, (category) => category.photos)
  @JoinTable()
  categories: Category[];
}
