import {
  BaseEntity,
  Column,
  Entity,
  Index,
  ManyToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { Photo } from "./Photo";

@Entity()
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ fulltext: true })
  @Column()
  name: string;

  @Column({
    default: "category"
  })
  type: "folder" | "category";

  @Column({ nullable: true })
  parentId: number;

  @ManyToMany(() => Photo, (photo) => photo.categories)
  photos: Photo[];
}
