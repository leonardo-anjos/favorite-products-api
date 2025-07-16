import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { z } from 'zod';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

const ProductDataSchema = z.object({
  id: z.number(),
  title: z.string(),
  price: z.number(),
  description: z.string(),
  category: z.string(),
  image: z.string(),
  rating: z
    .object({
      rate: z.number().optional(),
      count: z.number().optional(),
    })
    .optional(),
});

export interface ProductData {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  review: string | null;
  ratingCount: number | null;
}

@Injectable()
export class FakestoreService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly http: HttpService,
  ) {}

  async fetchProductById(productId: string): Promise<ProductData> {
    try {
      const cacheKey = `fakestore:product:${productId}`;
      let product = await this.cacheManager.get<ProductData>(cacheKey);
      if (!product) {
        const response: unknown = await firstValueFrom(
          this.http.get(`https://fakestoreapi.com/products/${productId}`),
        );
        const data = (response as { data: unknown }).data;
        const parsed = ProductDataSchema.safeParse(data);
        if (!parsed.success) {
          throw new Error(
            'Invalid response from external API: ' +
              JSON.stringify(parsed.error.issues),
          );
        }
        product = {
          id: parsed.data.id,
          title: parsed.data.title,
          price: parsed.data.price,
          description: parsed.data.description,
          category: parsed.data.category,
          image: parsed.data.image,
          review:
            parsed.data.rating && typeof parsed.data.rating.rate === 'number'
              ? parsed.data.rating.rate.toString()
              : null,
          ratingCount:
            parsed.data.rating && typeof parsed.data.rating.count === 'number'
              ? parsed.data.rating.count
              : null,
        };
        await this.cacheManager.set(cacheKey, product, 60); // cache por 60s
      }
      return product;
    } catch (e) {
      throw new NotFoundException(
        `Product ID ${productId} not found or invalid response from FakeStore API: ${(e as Error).message}`,
      );
    }
  }

  async fetchAllProducts(): Promise<ProductData[]> {
    try {
      const cacheKey = 'fakestore:all-products';
      let products = await this.cacheManager.get<ProductData[]>(cacheKey);
      if (!products) {
        const response: unknown = await firstValueFrom(
          this.http.get(`https://fakestoreapi.com/products`),
        );
        const data = (response as { data: unknown }).data;
        if (!Array.isArray(data)) {
          throw new Error('Invalid response from external API');
        }
        products = await Promise.all(
          data.map(async (item) => {
            const parsed = ProductDataSchema.safeParse(item);
            if (!parsed.success) {
              throw new Error(
                'Invalid product in response from external API: ' +
                  JSON.stringify(parsed.error.issues),
              );
            }
            const d = parsed.data;
            return {
              id: d.id,
              title: d.title,
              price: d.price,
              description: d.description,
              category: d.category,
              image: d.image,
              review:
                d.rating && typeof d.rating.rate === 'number'
                  ? d.rating.rate.toString()
                  : null,
              ratingCount:
                d.rating && typeof d.rating.count === 'number'
                  ? d.rating.count
                  : null,
            };
          }),
        );
        await this.cacheManager.set(cacheKey, products, 60); // cache por 60s
      }
      return products;
    } catch (e) {
      throw new NotFoundException(
        'Error fetching products from FakeStore API: ' + (e as Error).message,
      );
    }
  }

  async exists(productId: string): Promise<boolean> {
    try {
      await this.fetchProductById(productId);
      return true;
    } catch {
      return false;
    }
  }
}
