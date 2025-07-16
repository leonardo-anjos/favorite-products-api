import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Favorite } from './entities/favorite.entity';
import { Client } from 'src/clients/entities/client.entity';
import { FavoritesIntegration } from './favorites.integration';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private readonly favoriteRepo: Repository<Favorite>,

    @InjectRepository(Client)
    private readonly clientRepo: Repository<Client>,

    private readonly integration: FavoritesIntegration,
  ) {}

  async addFavorite(clientId: number, productId: string) {
    const client = await this.clientRepo.findOne({
      where: { id: clientId },
      relations: ['favorites'],
    });
    if (!client) throw new NotFoundException('Cliente não encontrado');

    const exists = await this.favoriteRepo.findOne({
      where: { client: { id: clientId }, productId },
    });
    if (exists) throw new ConflictException('Produto já está nos favoritos');

    const product = await this.integration.fetchProductById(productId);

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
    if (!client) throw new NotFoundException('Cliente não encontrado');

    return client.favorites.map((fav) => ({
      id: fav.id,
      productId: fav.productId,
      title: fav.title,
      image: fav.image,
      price: fav.price,
      review: fav.review,
    }));
  }

  async removeFavorite(clientId: number, productId: string) {
    const favorite = await this.favoriteRepo.findOne({
      where: { client: { id: clientId }, productId },
    });

    if (!favorite)
      throw new NotFoundException('Produto favorito não encontrado');
    return this.favoriteRepo.remove(favorite);
  }
}
