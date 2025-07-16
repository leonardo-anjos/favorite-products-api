import { validate } from 'class-validator';
import { ProductExists } from '../../validators/product-exists.validator';

beforeAll(() => {
  jest
    .spyOn(ProductExists.prototype, 'validate')
    .mockImplementation(async () => true);
});

import { CreateFavoriteDto } from './create-favorite.dto';

describe('CreateFavoriteDto', () => {
  it('should validate a valid dto', async () => {
    const dto = new CreateFavoriteDto();
    dto.productId = '1';
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });
});
