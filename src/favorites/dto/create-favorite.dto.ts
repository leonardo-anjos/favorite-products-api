import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Validate } from 'class-validator';
import { ProductExists } from '../../validators/product-exists.validator';

export class CreateFavoriteDto {
  @ApiProperty({ example: '5', description: 'id of the product to favorite' })
  @IsString()
  @IsNotEmpty()
  @Validate(ProductExists, { message: 'the specified product does not exist.' })
  productId: string;
}
