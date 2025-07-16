import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';
import { Favorite } from './entities/favorite.entity';
import { Client } from 'src/clients/entities/client.entity';
import { ExternalApiModule } from 'src/external-api/external-api.module';
import { ProductExists } from '../validators/product-exists.validator';

@Module({
  imports: [TypeOrmModule.forFeature([Favorite, Client]), ExternalApiModule],
  controllers: [FavoritesController],
  providers: [FavoritesService, ProductExists],
})
export class FavoritesModule {}
