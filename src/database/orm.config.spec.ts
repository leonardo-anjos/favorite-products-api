import { ormConfig } from './orm.config';
import { ConfigService } from '@nestjs/config';

describe('ormConfig', () => {
  it('should return correct TypeOrmModuleOptions from ConfigService', async () => {
    const mockConfig = {
      get: jest.fn((key: string) => {
        const values = {
          'postgres.host': 'localhost',
          'postgres.port': 5432,
          'postgres.username': 'user',
          'postgres.password': 'pass',
          'postgres.database': 'db',
        };
        return values[key];
      }),
    } as unknown as ConfigService;

    const result = await ormConfig(mockConfig);
    expect(result).toMatchObject({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'user',
      password: 'pass',
      database: 'db',
      synchronize: true,
      autoLoadEntities: true,
    });
  });
});
