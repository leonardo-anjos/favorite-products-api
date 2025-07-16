import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';

import postgresConfig from './database/postgres.config';
import { DatabaseModule } from './database/database.module';

import { ClientsModule } from './clients/clients.module';
import { FavoritesModule } from './favorites/favorites.module';
import { ExternalApiModule } from './external-api/external-api.module';
import { AuthModule } from './auth/auth.module';

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
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: 'localhost',
      port: 6379,
      ttl: 60,
    }),
    DatabaseModule,
    ClientsModule,
    FavoritesModule,
    ExternalApiModule,
    AuthModule,
  ],
})
export class AppModule {}
