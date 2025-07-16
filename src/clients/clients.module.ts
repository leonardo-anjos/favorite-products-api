import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { Client } from './entities/client.entity';
import { IsAlphaSpaces } from '../validators/is-alpha-spaces.validator';
import { IsNotTempEmail } from '../validators/is-not-temp-email.validator';

@Module({
  imports: [TypeOrmModule.forFeature([Client])],
  controllers: [ClientsController],
  providers: [ClientsService, IsAlphaSpaces, IsNotTempEmail],
})
export class ClientsModule {}
