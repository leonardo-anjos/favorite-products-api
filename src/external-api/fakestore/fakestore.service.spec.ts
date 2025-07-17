import { NotFoundException } from '@nestjs/common';
import { of } from 'rxjs';
import { FakestoreService } from './fakestore.service';

describe('FakestoreService', () => {
  let service: FakestoreService;
  let cacheManager: any;
  let httpService: any;

  beforeEach(() => {
    cacheManager = {
      get: jest.fn(),
      set: jest.fn(),
    };
    httpService = {
      get: jest.fn(),
    };
    service = new FakestoreService(cacheManager, httpService);
  });

  describe('fetchProductById', () => {
    it('should return product from cache if present', async () => {
      const product = {
        id: 1,
        title: 'Test',
        price: 10,
        description: '',
        category: '',
        image: '',
        review: null,
        ratingCount: null,
      };
      cacheManager.get.mockResolvedValue(product);
      const result = await service.fetchProductById('1');
      expect(result).toEqual(product);
      expect(cacheManager.get).toHaveBeenCalledWith('fakestore:product:1');
    });

    it('should fetch, parse, cache and return product if not in cache', async () => {
      cacheManager.get.mockResolvedValue(undefined);
      const apiData = {
        id: 2,
        title: 'API',
        price: 20,
        description: '',
        category: '',
        image: '',
        rating: { rate: 4.5, count: 10 },
      };
      httpService.get.mockReturnValue(of({ data: apiData }));
      cacheManager.set.mockResolvedValue(undefined);
      const result = await service.fetchProductById('2');
      expect(result).toMatchObject({
        id: 2,
        title: 'API',
        price: 20,
        review: '4.5',
        ratingCount: 10,
      });
      expect(cacheManager.set).toHaveBeenCalledWith(
        'fakestore:product:2',
        expect.any(Object),
        60,
      );
    });

    it('should throw NotFoundException if API returns invalid data', async () => {
      cacheManager.get.mockResolvedValue(undefined);
      httpService.get.mockReturnValue(of({ data: { invalid: true } }));
      await expect(service.fetchProductById('3')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('fetchAllProducts', () => {
    it('should return products from cache if present', async () => {
      const products = [
        {
          id: 1,
          title: 'Cached',
          price: 10,
          description: '',
          category: '',
          image: '',
          review: null,
          ratingCount: null,
        },
      ];
      cacheManager.get.mockResolvedValue(products);
      const result = await service.fetchAllProducts();
      expect(result).toEqual(products);
      expect(cacheManager.get).toHaveBeenCalledWith('fakestore:all-products');
    });

    it('should fetch, parse, cache and return products if not in cache', async () => {
      cacheManager.get.mockResolvedValue(undefined);
      const apiData = [
        {
          id: 1,
          title: 'A',
          price: 10,
          description: '',
          category: '',
          image: '',
          rating: { rate: 4, count: 5 },
        },
        {
          id: 2,
          title: 'B',
          price: 20,
          description: '',
          category: '',
          image: '',
          rating: { rate: 5, count: 10 },
        },
      ];
      httpService.get.mockReturnValue(of({ data: apiData }));
      cacheManager.set.mockResolvedValue(undefined);
      const result = await service.fetchAllProducts();
      expect(result.length).toBe(2);
      expect(result[0]).toMatchObject({
        id: 1,
        title: 'A',
        review: '4',
        ratingCount: 5,
      });
      expect(result[1]).toMatchObject({
        id: 2,
        title: 'B',
        review: '5',
        ratingCount: 10,
      });
      expect(cacheManager.set).toHaveBeenCalledWith(
        'fakestore:all-products',
        expect.any(Array),
        60,
      );
    });

    it('should throw NotFoundException if API returns invalid data', async () => {
      cacheManager.get.mockResolvedValue(undefined);
      httpService.get.mockReturnValue(of({ data: { not: 'an array' } }));
      await expect(service.fetchAllProducts()).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('exists', () => {
    it('should return true if product exists', async () => {
      jest.spyOn(service, 'fetchProductById').mockResolvedValue({} as any);
      await expect(service.exists('1')).resolves.toBe(true);
    });
    it('should return false if product does not exist', async () => {
      jest
        .spyOn(service, 'fetchProductById')
        .mockRejectedValue(new NotFoundException());
      await expect(service.exists('2')).resolves.toBe(false);
    });
  });
});
