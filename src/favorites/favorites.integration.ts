import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

// Define the expected product data type
interface ProductApiResponse {
  title: string;
  image: string;
  price: number;
  rating?: { rate?: number };
}

@Injectable()
export class FavoritesIntegration {
  constructor(private readonly http: HttpService) {}

  async fetchProductById(productId: string): Promise<{
    title: string;
    image: string;
    price: number;
    review: string | null;
  }> {
    try {
      const response = await firstValueFrom(
        this.http.get<ProductApiResponse>(
          `https://fakestoreapi.com/products/${productId}`,
        ),
      );
      const data = response.data;

      return {
        title: data.title,
        image: data.image,
        price: data.price,
        review: data.rating?.rate?.toString() ?? null,
      };
    } catch {
      throw new NotFoundException('Produto não encontrado na API externa');
    }
  }
}
