import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { Favorite } from 'src/favorites/entities/favorite.entity';

@Entity()
@Index(['email'], { unique: true })
@Index(['name'])
export class Client {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @OneToMany(() => Favorite, (favorite) => favorite.client, { cascade: true })
  favorites: Favorite[];
}
