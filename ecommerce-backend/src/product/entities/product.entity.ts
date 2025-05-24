import { BaseEntity } from 'src/common/base.entity';
import { User } from 'src/user/entity/user.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productName: string;

  @Column()
  price: number;

  @ManyToMany(() => User, (user) => user.products)
  users: User[];
}
