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
  @IsNotEmpty()
  @MinLength(3, { message: 'O nome deve ter pelo menos 3 caracteres.' })
  @Validate(IsAlphaSpaces, {
    message: 'O nome deve conter apenas letras e espaços.',
  })
  name: string;

  @IsEmail()
  @Matches(/^\S+@\S+\.\S+$/, { message: 'E-mail não pode conter espaços.' })
  @Validate(IsNotTempEmail, {
    message: 'E-mail de domínio temporário não é permitido.',
  })
  email: string;
}
