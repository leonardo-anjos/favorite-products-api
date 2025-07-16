import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'isAlphaSpaces', async: false })
export class IsAlphaSpaces implements ValidatorConstraintInterface {
  validate(text: string, _args: ValidationArguments) {
    return /^[A-Za-zÀ-ÿ\s]+$/.test(text);
  }

  defaultMessage(_args: ValidationArguments) {
    return 'Name must contain only letters and spaces.';
  }
}
