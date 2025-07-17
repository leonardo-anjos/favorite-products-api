import { FakestoreController } from './fakestore.controller';
import { FakestoreService } from './fakestore.service';

describe('FakestoreController', () => {
  let controller: FakestoreController;
  let service: Partial<Record<keyof FakestoreService, jest.Mock>>;

  beforeEach(() => {
    service = {
      fetchAllProducts: jest.fn(),
      fetchProductById: jest.fn(),
    };
    controller = new FakestoreController(
      service as unknown as FakestoreService,
    );
  });

  describe('getAll', () => {
    it('should return paginated, filtered, and sorted products', async () => {
      const products = [
        {
          id: 1,
          title: 'Alpha',
          price: 10,
          category: 'cat1',
          description: '',
          image: '',
          review: null,
          ratingCount: null,
        },
        {
          id: 2,
          title: 'Beta',
          price: 20,
          category: 'cat2',
          description: '',
          image: '',
          review: null,
          ratingCount: null,
        },
        {
          id: 3,
          title: 'Gamma',
          price: 30,
          category: 'cat1',
          description: '',
          image: '',
          review: null,
          ratingCount: null,
        },
      ];
      service.fetchAllProducts!.mockResolvedValue(products);
      const result = await controller.getAll(
        '1',
        '2',
        'a',
        'title',
        'asc',
        'cat1',
      );
      expect(result.data.length).toBe(2);
      expect(result.data[0].title).toBe('Alpha');
      expect(result.data[1].title).toBe('Gamma');
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(2);
      expect(result.lastPage).toBe(1);
    });
  });

  describe('getById', () => {
    it('should return product by id', async () => {
      const product = {
        id: 1,
        title: 'Alpha',
        price: 10,
        category: 'cat1',
        description: '',
        image: '',
        review: null,
        ratingCount: null,
      };
      service.fetchProductById!.mockResolvedValue(product);
      const result = await controller.getById('1');
      expect(result).toEqual(product);
      expect(service.fetchProductById).toHaveBeenCalledWith('1');
    });
  });
});
