import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
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
  getFavorites(
    @Param('clientId') clientId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('sort') sort?: string,
    @Query('order') order?: string,
  ) {
    return this.favoritesService.getFavorites(+clientId, {
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 10,
      search,
      sort,
      order,
    });
  }

  @Delete(':productId')
  removeFavorite(
    @Param('clientId') clientId: string,
    @Param('productId') productId: string,
  ) {
    return this.favoritesService.removeFavorite(+clientId, productId);
  }
}
