import { Controller, Post, Get, Delete, Param, Body } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';

@Controller('clients/:clientId/favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post()
  addFavorite(
    @Param('clientId') clientId: string,
    @Body() dto: CreateFavoriteDto,
  ) {
    return this.favoritesService.addFavorite(+clientId, dto.productId);
  }

  @Get()
  getFavorites(@Param('clientId') clientId: string) {
    return this.favoritesService.getFavorites(+clientId);
  }

  @Delete(':productId')
  removeFavorite(
    @Param('clientId') clientId: string,
    @Param('productId') productId: string,
  ) {
    return this.favoritesService.removeFavorite(+clientId, productId);
  }
}
