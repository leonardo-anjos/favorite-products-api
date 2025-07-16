import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';

import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';
import { FavoritesIntegration } from './favorites.integration';
import { Favorite } from './entities/favorite.entity';
import { Client } from 'src/clients/entities/client.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Favorite, Client]), HttpModule],
  controllers: [FavoritesController],
  providers: [FavoritesService, FavoritesIntegration],
})
export class FavoritesModule {}
