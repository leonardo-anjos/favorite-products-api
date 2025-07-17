import postgresConfig from './postgres.config';

describe('postgresConfig', () => {
  const OLD_ENV = process.env;
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });
  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('should return correct config from environment variables', () => {
    process.env.POSTGRES_HOST = 'localhost';
    process.env.POSTGRES_PORT = '5433';
    process.env.POSTGRES_USER = 'user';
    process.env.POSTGRES_PASSWORD = 'pass';
    process.env.POSTGRES_DB = 'db';
    const config = postgresConfig();
    expect(config).toEqual({
      host: 'localhost',
      port: 5433,
      username: 'user',
      password: 'pass',
      database: 'db',
    });
  });
});
