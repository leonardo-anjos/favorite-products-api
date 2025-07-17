import { Test, TestingModule } from '@nestjs/testing';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { CreateFavoriteDto } from './dto/create-favorite.dto';

describe('FavoritesController', () => {
  let controller: FavoritesController;
  let service: jest.Mocked<FavoritesService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FavoritesController],
      providers: [
        {
          provide: FavoritesService,
          useValue: {
            addFavorite: jest.fn(async () => undefined),
            getFavorites: jest.fn(async () => undefined),
            removeFavorite: jest.fn(async () => undefined),
          },
        },
      ],
    }).compile();
    controller = module.get<FavoritesController>(FavoritesController);
    service = module.get(FavoritesService);
  });

  describe('addFavorite', () => {
    it('should call service.addFavorite and return result', async () => {
      const dto: CreateFavoriteDto = { productId: 'p1' };
      const favorite = {
        id: 'f1',
        productId: 'p1',
        title: 'Product',
        image: 'img',
        price: 10,
        review: '4',
        client: {
          id: '1',
          name: 'Test',
          email: 'test@test.com',
          favorites: [],
        },
      };
      service.addFavorite.mockResolvedValue(favorite);
      const result = await controller.addFavorite('1', dto);
      expect(service.addFavorite).toHaveBeenCalledWith('1', 'p1');
      expect(result).toEqual(favorite);
    });
    it('should propagate errors from service', async () => {
      service.addFavorite.mockRejectedValue(new ConflictException());
      await expect(
        controller.addFavorite('1', { productId: 'p1' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('getFavorites', () => {
    it('should call service.getFavorites and return result', async () => {
      const resultMock = {
        data: [],
        total: 0,
        page: 1,
        limit: 10,
        lastPage: 0,
      };
      service.getFavorites.mockResolvedValue(resultMock);
      const result = await controller.getFavorites(
        '1',
        '1',
        '10',
        'A',
        'title',
        'asc',
      );
      expect(service.getFavorites).toHaveBeenCalledWith('1', {
        page: 1,
        limit: 10,
        search: 'A',
        sort: 'title',
        order: 'asc',
      });
      expect(result).toEqual(resultMock);
    });
    it('should propagate errors from service', async () => {
      service.getFavorites.mockRejectedValue(new NotFoundException());
      await expect(controller.getFavorites('1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('removeFavorite', () => {
    it('should call service.removeFavorite and return result', async () => {
      const favorite = {
        id: 'f1',
        productId: 'p1',
        title: 'Product',
        image: 'img',
        price: 10,
        review: '4',
        client: {
          id: '1',
          name: 'Test',
          email: 'test@test.com',
          favorites: [],
        },
      };
      service.removeFavorite.mockResolvedValue(favorite);
      const result = await controller.removeFavorite('1', 'p1');
      expect(service.removeFavorite).toHaveBeenCalledWith('1', 'p1');
      expect(result).toEqual(favorite);
    });
    it('should propagate errors from service', async () => {
      service.removeFavorite.mockRejectedValue(new NotFoundException());
      await expect(controller.removeFavorite('1', 'p1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
