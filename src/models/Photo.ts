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

  @ManyToOne(() => User, (user) => user.photos)
  user: User | undefined;

  @ManyToMany(() => Category, (category) => category.photos)
  @JoinTable()
  categories: Category[];

  @Column({ nullable: true })
  useCount: number; // Column to store the amount of time the photo can be downloaded

  @Column({ default: false })
  owned: boolean;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;
}
