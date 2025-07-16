import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
// import { Client } from 'src/clients/entities/client.entity';
// import { Favorite } from 'src/favorites/entities/favorite.entity';

export const ormConfig = async (
  configService: ConfigService,
): Promise<TypeOrmModuleOptions> => ({
  type: 'postgres',
  host: configService.get<string>('postgres.host'),
  port: configService.get<number>('postgres.port'),
  username: configService.get<string>('postgres.username'),
  password: configService.get<string>('postgres.password'),
  database: configService.get<string>('postgres.database'),
  // entities: [Client, Favorite],
  synchronize: true,
  autoLoadEntities: true,
});
