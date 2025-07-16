import { validate } from 'class-validator';
import { ProductExists } from '../../validators/product-exists.validator';

beforeAll(() => {
  jest
    .spyOn(ProductExists.prototype, 'validate')
    .mockImplementation(async () => true);
});

import { UpdateFavoriteDto } from './update-favorite.dto';

describe('UpdateFavoriteDto', () => {
  it('should validate a valid dto', async () => {
    const dto = new UpdateFavoriteDto();
    dto.productId = '1';
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });
});
