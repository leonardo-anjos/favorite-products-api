import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Client } from 'src/clients/entities/client.entity';

@Entity()
export class Favorite {
  @PrimaryGeneratedColumn()
  id: number;

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
