import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinTable,
  BaseEntity
} from "typeorm";
import { Photo } from "./Photo";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({default: ""})
  firstName: string;

  @Column({default: ""})
  lastName: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Photo, (photo) => photo.user)
  @JoinTable()
  photos: Photo[];
}
