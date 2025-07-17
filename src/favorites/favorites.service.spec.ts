import { Test, TestingModule } from '@nestjs/testing';
import { FavoritesService } from './favorites.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Favorite } from './entities/favorite.entity';
import { Client } from '../clients/entities/client.entity';
import { Repository } from 'typeorm';
import { FakestoreService } from '../external-api/fakestore/fakestore.service';
import { NotFoundException, ConflictException } from '@nestjs/common';

describe('FavoritesService', () => {
  let service: FavoritesService;
  let favoriteRepo: jest.Mocked<Repository<Favorite>>;
  let clientRepo: jest.Mocked<Repository<Client>>;
  let fakestore: jest.Mocked<FakestoreService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FavoritesService,
        {
          provide: getRepositoryToken(Favorite),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            createQueryBuilder: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Client),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: FakestoreService,
          useValue: {
            fetchProductById: jest.fn(),
          },
        },
      ],
    }).compile();
    service = module.get<FavoritesService>(FavoritesService);
    favoriteRepo = module.get(getRepositoryToken(Favorite));
    clientRepo = module.get(getRepositoryToken(Client));
    fakestore = module.get(FakestoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addFavorite', () => {
    it('should throw NotFoundException if client not found', async () => {
      clientRepo.findOne.mockResolvedValue(null);
      favoriteRepo.findOne.mockResolvedValue(null);
      await expect(service.addFavorite('1', 'p1')).rejects.toThrow(
        NotFoundException,
      );
    });
    it('should throw ConflictException if favorite already exists', async () => {
      clientRepo.findOne.mockResolvedValue({
        id: '1',
        name: 'Test',
        email: 'test@test.com',
        favorites: [],
      } as Client);
      favoriteRepo.findOne.mockResolvedValue({ id: 'f1' } as Favorite);
      await expect(service.addFavorite('1', 'p1')).rejects.toThrow(
        ConflictException,
      );
    });
    it('should add and save favorite if not exists', async () => {
      clientRepo.findOne.mockResolvedValue({
        id: '1',
        name: 'Test',
        email: 'test@test.com',
        favorites: [],
      } as Client);
      favoriteRepo.findOne.mockResolvedValue(null);
      fakestore.fetchProductById.mockResolvedValue({
        id: 'p1',
        title: 'Product',
        image: 'img',
        price: 10,
        review: '4',
      } as any);
      favoriteRepo.create.mockReturnValue({ id: 'f1' } as Favorite);
      favoriteRepo.save.mockResolvedValue({ id: 'f1' } as Favorite);
      const result = await service.addFavorite('1', 'p1');
      expect(favoriteRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          client: { id: '1' },
          productId: 'p1',
          title: 'Product',
          image: 'img',
          price: 10,
          review: '4',
        }),
      );
      expect(result).toEqual({ id: 'f1' });
    });
  });

  describe('getFavorites', () => {
    it('should throw NotFoundException if client not found', async () => {
      clientRepo.findOne.mockResolvedValue(null);
      await expect(service.getFavorites('1', {})).rejects.toThrow(
        NotFoundException,
      );
    });
    it('should return paginated favorites', async () => {
      clientRepo.findOne.mockResolvedValue({
        id: '1',
        name: 'Test',
        email: 'test@test.com',
        favorites: [],
      } as Client);
      const mockQueryBuilder: any = {
        innerJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[{ id: 'f1' }], 1]),
      };
      favoriteRepo.createQueryBuilder = jest
        .fn()
        .mockReturnValue(mockQueryBuilder);
      const result = await service.getFavorites('1', {
        page: 1,
        limit: 10,
        search: 'P',
        sort: 'title',
        order: 'asc',
      });
      expect(result).toEqual({
        data: [{ id: 'f1' }],
        total: 1,
        page: 1,
        limit: 10,
        lastPage: 1,
      });
      expect(mockQueryBuilder.andWhere).toHaveBeenCalled();
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(
        'favorite.title',
        'ASC',
      );
    });
    it('should return empty data if no favorites', async () => {
      clientRepo.findOne.mockResolvedValue({
        id: '1',
        name: 'Test',
        email: 'test@test.com',
        favorites: [],
      } as Client);
      const mockQueryBuilder: any = {
        innerJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
      };
      favoriteRepo.createQueryBuilder = jest
        .fn()
        .mockReturnValue(mockQueryBuilder);
      const result = await service.getFavorites('1', { page: 1, limit: 10 });
      expect(result).toEqual({
        data: [],
        total: 0,
        page: 1,
        limit: 10,
        lastPage: 0,
      });
    });
  });

  describe('removeFavorite', () => {
    it('should throw NotFoundException if favorite not found', async () => {
      favoriteRepo.findOne.mockResolvedValue(null);
      await expect(service.removeFavorite('1', 'p1')).rejects.toThrow(
        NotFoundException,
      );
    });
    it('should remove favorite if found', async () => {
      favoriteRepo.findOne.mockResolvedValue({ id: 'f1' } as Favorite);
      favoriteRepo.remove.mockResolvedValue({ id: 'f1' } as Favorite);
      const result = await service.removeFavorite('1', 'p1');
      expect(favoriteRepo.remove).toHaveBeenCalledWith({ id: 'f1' });
      expect(result).toEqual({ id: 'f1' });
    });
  });
});
