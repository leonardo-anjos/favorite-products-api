import { Controller, Get, Query, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { FakestoreService, ProductData } from './fakestore.service';

@ApiTags('external-products')
@Controller('external-products')
export class FakestoreController {
  constructor(private readonly fakestore: FakestoreService) {}

  @Get()
  @ApiOperation({ summary: 'list all products from fakestore with filters' })
  async getAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('search') search: string = '',
    @Query('sort') sort: string = 'title',
    @Query('order') order: 'asc' | 'desc' = 'asc',
    @Query('category') category?: string,
  ): Promise<{
    data: ProductData[];
    total: number;
    page: number;
    limit: number;
    lastPage: number;
  }> {
    const all = await this.fakestore.fetchAllProducts();
    let filtered = all.filter((p) =>
      p.title.toLowerCase().includes(search.toLowerCase()),
    );
    if (category) {
      filtered = filtered.filter((p) => p.category === category);
    }
    filtered = filtered.sort((a, b) => {
      let vA = a[sort];
      let vB = b[sort];
      if (typeof vA === 'string') vA = vA.toLowerCase();
      if (typeof vB === 'string') vB = vB.toLowerCase();
      if (vA < vB) return order === 'asc' ? -1 : 1;
      if (vA > vB) return order === 'asc' ? 1 : -1;
      return 0;
    });
    const total = filtered.length;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 10);
    const lastPage = Math.max(1, Math.ceil(total / limitNum));
    const data = filtered.slice((pageNum - 1) * limitNum, pageNum * limitNum);
    return { data, total, page: pageNum, limit: limitNum, lastPage };
  }

  @Get(':id')
  @ApiOperation({ summary: 'get a product by ID from fakestore' })
  async getById(@Param('id') id: string) {
    return this.fakestore.fetchProductById(id);
  }
}
