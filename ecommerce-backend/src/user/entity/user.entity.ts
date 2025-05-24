import { Exclude, Expose } from 'class-transformer';
import { BaseEntity } from 'src/common/base.entity';
import { Product } from 'src/product/entities/product.entity';

import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number;

  @Column()
  @Expose()
  email: string;

  @Column()
  @Expose()
  nickName: string;

  @Column()
  @Exclude()
  password: string;

  @ManyToMany(() => Product, (product) => product.users)
  @JoinTable()
  products: Product[];
}
