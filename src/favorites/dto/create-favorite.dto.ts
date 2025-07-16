import { IsString, IsNotEmpty, Matches, Validate } from 'class-validator';
import { ProductExists } from '../../validators/product-exists.validator';

export class CreateFavoriteDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d+$/, { message: 'productId must be a positive number.' })
  @Validate(ProductExists, { message: 'The specified product does not exist.' })
  productId: string;
}
