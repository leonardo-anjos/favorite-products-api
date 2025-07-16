import { IsString, IsNotEmpty, Validate } from 'class-validator';
import { ProductExists } from '../../validators/product-exists.validator';

export class CreateFavoriteDto {
  @IsString()
  @IsNotEmpty()
  @Validate(ProductExists, { message: 'The specified product does not exist.' })
  productId: string;
}
