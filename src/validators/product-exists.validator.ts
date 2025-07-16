import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { FakestoreService } from '../external-api/fakestore/fakestore.service';

@ValidatorConstraint({ name: 'productExists', async: true })
@Injectable()
export class ProductExists implements ValidatorConstraintInterface {
  constructor(private readonly fakestoreService: FakestoreService) {}

  async validate(productId: string, _args: ValidationArguments) {
    return await this.fakestoreService.exists(productId);
  }

  defaultMessage(_args: ValidationArguments) {
    return 'The specified product does not exist.';
  }
}
