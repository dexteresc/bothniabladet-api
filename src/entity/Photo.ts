import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class Photo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  dateAdded: Date;

  @ManyToOne((type) => User, (user) => user.photos)
  user: User;

  @Column()
  userId: number;
}
