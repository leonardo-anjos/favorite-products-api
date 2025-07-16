import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import postgresConfig from './database/postgres.config';
import { DatabaseModule } from './database/database.module';

// import { ClientsModule } from './clients/clients.module';
// import { FavoritesModule } from './favorites/favorites.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [postgresConfig],
      envFilePath: '.env',
    }),
    DatabaseModule,
    // ClientsModule,
    // FavoritesModule,
  ],
})
export class AppModule {}
