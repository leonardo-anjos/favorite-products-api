import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { FakestoreService } from './fakestore.service';
import { FakestoreController } from './fakestore.controller';

@Module({
  imports: [HttpModule],
  providers: [FakestoreService],
  controllers: [FakestoreController],
  exports: [FakestoreService],
})
export class FakestoreModule {}
