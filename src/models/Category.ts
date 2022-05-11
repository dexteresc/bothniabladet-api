import {
  BaseEntity,
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn
} from "typeorm";

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
}
