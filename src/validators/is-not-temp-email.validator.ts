import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

const TEMP_DOMAINS = [
  'test.com',
  'teste.com',
  'email.com',
  'mail.com',
  'example.com',
  'mailinator.com',
  '10minutemail.com',
  'guerrillamail.com',
  'tempmail.com',
  'yopmail.com',
];

@ValidatorConstraint({ name: 'isNotTempEmail', async: false })
export class IsNotTempEmail implements ValidatorConstraintInterface {
  validate(email: string, _args: ValidationArguments) {
    const domain = email.split('@')[1]?.toLowerCase();
    return domain ? !TEMP_DOMAINS.includes(domain) : false;
  }

  defaultMessage(_args: ValidationArguments) {
    return 'E-mail de domínio temporário não é permitido.';
  }
}
