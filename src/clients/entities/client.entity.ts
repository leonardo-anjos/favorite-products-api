import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Favorite } from 'src/favorites/entities/favorite.entity';

@Entity()
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @OneToMany(() => Favorite, (favorite) => favorite.client, { cascade: true })
  favorites: Favorite[];
}
