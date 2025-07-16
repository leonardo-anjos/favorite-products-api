import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index,
} from 'typeorm';
import { Client } from 'src/clients/entities/client.entity';

@Entity()
@Index(['productId'])
@Index(['client'])
export class Favorite {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  productId: string;

  @Column()
  title: string;

  @Column()
  image: string;

  @Column('decimal')
  price: number;

  @Column({ nullable: true })
  review: string;

  @ManyToOne(() => Client, (client) => client.favorites, {
    onDelete: 'CASCADE',
  })
  client: Client;
}
