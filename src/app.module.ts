import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import * as Joi from 'joi';

import postgresConfig from './database/postgres.config';
import redisConfig from './database/redis.config';
import { DatabaseModule } from './database/database.module';
import { ClientsModule } from './clients/clients.module';
import { FavoritesModule } from './favorites/favorites.module';
import { ExternalApiModule } from './external-api/external-api.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [postgresConfig, redisConfig],
      envFilePath: '.env',
      validationSchema: Joi.object({
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().default(6379),
        REDIS_TTL: Joi.number().default(300),
        REDIS_PASSWORD: Joi.string().allow(''),
        REDIS_DB: Joi.number().default(0),
      }),
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        store: require('cache-manager-ioredis'),
        host: config.get<string>('redis.host'),
        port: config.get<number>('redis.port'),
        ttl: config.get<number>('redis.ttl'),
        password: config.get<string>('redis.password'),
        db: config.get<number>('redis.db'),
      }),
    }),
    DatabaseModule,
    ClientsModule,
    FavoritesModule,
    ExternalApiModule,
  ],
})
export class AppModule {}
