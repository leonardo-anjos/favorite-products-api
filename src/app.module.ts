import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';

import postgresConfig from './database/postgres.config';
import redisConfig from './database/redis.config';
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
      load: [postgresConfig, redisConfig],
      envFilePath: '.env',
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const redis = config.get('redis');
        return {
          store: redisStore,
          host: redis.host,
          port: redis.port,
          password: redis.password,
          ttl: redis.ttl,
        };
      },
    }),
    DatabaseModule,
    ClientsModule,
    FavoritesModule,
    ExternalApiModule,
    AuthModule,
  ],
})
export class AppModule {}
