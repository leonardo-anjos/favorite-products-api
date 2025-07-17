import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  Matches,
  Validate,
} from 'class-validator';
import { IsNotTempEmail } from '../../validators/is-not-temp-email.validator';
import { IsAlphaSpaces } from '../../validators/is-alpha-spaces.validator';

export class CreateClientDto {
  @ApiProperty({ example: 'John Doe' })
  @IsNotEmpty()
  @MinLength(3, { message: 'Name must be at least 3 characters long.' })
  @Validate(IsAlphaSpaces, {
    message: 'Name must contain only letters and spaces.',
  })
  name: string;

  @ApiProperty({ example: 'john@gmail.com' })
  @IsEmail()
  @Matches(/^\S+@\S+\.\S+$/, { message: 'E-mail must not contain spaces.' })
  @Validate(IsNotTempEmail, {
    message: 'Temporary email domains are not allowed.',
  })
  email: string;
}
