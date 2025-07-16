import { Module } from '@nestjs/common';
import { FakestoreModule } from './fakestore/fakestore.module';

@Module({
  imports: [FakestoreModule],
  exports: [FakestoreModule],
})
export class ExternalApiModule {}
