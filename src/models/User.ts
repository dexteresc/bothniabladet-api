import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinTable,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";
import { Photo } from "./Photo";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: "" })
  firstName: string;

  @Column({ default: "" })
  lastName: string;

  @Column()
  email: string;

  @Column()
  salt: string;

  @Column()
  hash: string;

  @OneToMany(() => Photo, (photo) => photo.user)
  @JoinTable()
  photos: Photo[];

  @Column({ default: false })
  isAdmin: boolean;

  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)"
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)"
  })
  updatedAt: Date;
}
