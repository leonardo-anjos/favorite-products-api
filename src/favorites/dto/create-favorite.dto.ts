import { IsString, IsNotEmpty, Matches, Validate } from 'class-validator';
import { ProductExists } from '../../validators/product-exists.validator';

export class CreateFavoriteDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d+$/, { message: 'O productId deve ser um número positivo.' })
  @Validate(ProductExists, { message: 'O produto informado não existe.' })
  productId: string;
}
