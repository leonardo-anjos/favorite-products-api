import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import postgresConfig from './database/postgres.config';
import { DatabaseModule } from './database/database.module';

import { ClientsModule } from './clients/clients.module';
import { FavoritesModule } from './favorites/favorites.module';
import { ExternalApiModule } from './external-api/external-api.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [postgresConfig],
      envFilePath: '.env',
    }),
    DatabaseModule,
    ClientsModule,
    FavoritesModule,
    ExternalApiModule,
  ],
})
export class AppModule {}
