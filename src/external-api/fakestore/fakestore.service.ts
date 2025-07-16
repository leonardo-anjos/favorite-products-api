import { Injectable, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { z } from 'zod';

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

interface ProductData {
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
  constructor(private readonly http: HttpService) {}

  async fetchProductById(productId: string): Promise<ProductData> {
    try {
      const response: unknown = await firstValueFrom(
        this.http.get(`https://fakestoreapi.com/products/${productId}`),
      );
      const data = (response as { data: unknown }).data;
      const parsed = ProductDataSchema.safeParse(data);
      if (!parsed.success) {
        throw new Error(
          'Resposta da API externa inválida: ' +
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
    } catch (e) {
      throw new NotFoundException(
        `Produto ID ${productId} não encontrado ou resposta inválida da FakeStore API: ${(e as Error).message}`,
      );
    }
  }

  async fetchAllProducts(): Promise<ProductData[]> {
    try {
      const response: unknown = await firstValueFrom(
        this.http.get(`https://fakestoreapi.com/products`),
      );
      const data = (response as { data: unknown }).data;
      if (!Array.isArray(data)) {
        throw new Error('Resposta da API externa inválida');
      }
      return data.map((item) => {
        const parsed = ProductDataSchema.safeParse(item);
        if (!parsed.success) {
          throw new Error(
            'Produto inválido na resposta da API externa: ' +
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
      });
    } catch (e) {
      throw new NotFoundException(
        'Erro ao buscar produtos da FakeStore API: ' + (e as Error).message,
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
