import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FavoritesService } from './favorites.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';

@ApiTags('favorites')
@Controller('clients/:clientId/favorites')
@UseGuards(AuthGuard('jwt'))
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post()
  @ApiOperation({ summary: 'add a product to client favorites' })
  addFavorite(
    @Param('clientId') clientId: string,
    @Body() dto: CreateFavoriteDto,
  ) {
    return this.favoritesService.addFavorite(clientId, dto.productId);
  }

  @Get()
  @ApiOperation({ summary: 'list all favorite products for a client' })
  getFavorites(
    @Param('clientId') clientId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('sort') sort?: string,
    @Query('order') order?: string,
  ) {
    return this.favoritesService.getFavorites(clientId, {
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 10,
      search,
      sort,
      order,
    });
  }

  @Delete(':productId')
  @ApiOperation({ summary: 'remove a product from client favorites' })
  removeFavorite(
    @Param('clientId') clientId: string,
    @Param('productId') productId: string,
  ) {
    return this.favoritesService.removeFavorite(clientId, productId);
  }
}
