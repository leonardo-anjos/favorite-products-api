import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { FakestoreService } from './fakestore.service';

@Module({
  imports: [HttpModule],
  providers: [FakestoreService],
  exports: [FakestoreService],
})
export class FakestoreModule {}
