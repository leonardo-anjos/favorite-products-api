import { Injectable, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

interface ProductData {
  id: number;
  title: string;
  price: number;
  image: string;
  review: string | null;
}

@Injectable()
export class FakestoreService {
  constructor(private readonly http: HttpService) {}

  async fetchProductById(productId: string): Promise<ProductData> {
    try {
      const { data } = await firstValueFrom(
        this.http.get(`https://fakestoreapi.com/products/${productId}`),
      );

      return {
        id: data.id,
        title: data.title,
        price: data.price,
        image: data.image,
        review: data.rating?.rate?.toString() ?? null,
      };
    } catch {
      throw new NotFoundException(
        `Produto ID ${productId} não encontrado na FakeStore API`,
      );
    }
  }

  async fetchAllProducts(): Promise<ProductData[]> {
    try {
      const { data } = await firstValueFrom(
        this.http.get(`https://fakestoreapi.com/products`),
      );

      return data.map((item: any) => ({
        id: item.id,
        title: item.title,
        price: item.price,
        image: item.image,
        review: item.rating?.rate?.toString() ?? null,
      }));
    } catch {
      throw new NotFoundException('Erro ao buscar produtos da FakeStore API');
    }
  }
}
