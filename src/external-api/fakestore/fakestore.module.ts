import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { FakestoreService } from './fakestore.service';
import { FakestoreController } from './fakestore.controller';

@Module({
  imports: [HttpModule, CacheModule.register()],
  providers: [FakestoreService],
  controllers: [FakestoreController],
  exports: [FakestoreService],
})
export class FakestoreModule {}
