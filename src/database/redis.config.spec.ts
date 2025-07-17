import redisConfig from './redis.config';

describe('redisConfig', () => {
  const OLD_ENV = process.env;
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });
  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('should return correct config from environment variables', () => {
    process.env.REDIS_HOST = 'redis-host';
    process.env.REDIS_PORT = '6380';
    process.env.REDIS_PASSWORD = 'secret';
    process.env.REDIS_TTL = '120';
    const config = redisConfig();
    expect(config).toEqual({
      host: 'redis-host',
      port: 6380,
      password: 'secret',
      ttl: 120,
    });
  });

  it('should use defaults if env vars are not set', () => {
    delete process.env.REDIS_HOST;
    delete process.env.REDIS_PORT;
    delete process.env.REDIS_PASSWORD;
    delete process.env.REDIS_TTL;
    const config = redisConfig();
    expect(config).toEqual({
      host: 'localhost',
      port: 6379,
      password: undefined,
      ttl: 60,
    });
  });
});
