import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Favorite } from './entities/favorite.entity';
import { Client } from 'src/clients/entities/client.entity';
import { FakestoreService } from 'src/external-api/fakestore/fakestore.service';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private readonly favoriteRepo: Repository<Favorite>,

    @InjectRepository(Client)
    private readonly clientRepo: Repository<Client>,

    private readonly fakestore: FakestoreService,
  ) {}

  async addFavorite(clientId: number, productId: string) {
    const client = await this.clientRepo.findOne({
      where: { id: clientId },
      relations: ['favorites'],
    });
    if (!client) throw new NotFoundException('Client not found');

    const exists = await this.favoriteRepo.findOne({
      where: { client: { id: clientId }, productId },
    });
    if (exists) throw new ConflictException('Product is already in favorites');

    const product = await this.fakestore.fetchProductById(productId);

    const favorite = this.favoriteRepo.create({
      client: { id: client.id },
      productId,
      title: product.title,
      image: product.image,
      price: product.price,
      review: product.review ?? '',
    });

    return this.favoriteRepo.save(favorite);
  }

  async getFavorites(clientId: number) {
    const client = await this.clientRepo.findOne({
      where: { id: clientId },
      relations: ['favorites'],
    });
    if (!client) throw new NotFoundException('Client not found');

    return client.favorites;
  }

  async removeFavorite(clientId: number, productId: string) {
    const favorite = await this.favoriteRepo.findOne({
      where: { client: { id: clientId }, productId },
    });

    if (!favorite) throw new NotFoundException('Favorite product not found');
    return this.favoriteRepo.remove(favorite);
  }
}
