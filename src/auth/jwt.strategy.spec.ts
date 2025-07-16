import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtStrategy],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('should return user payload with userId and username', async () => {
      const mockPayload = {
        sub: 'user-id-123',
        username: 'testuser',
        iat: 1234567890,
        exp: 1234567890,
      };

      const result = await strategy.validate(mockPayload);

      expect(result).toEqual({
        userId: mockPayload.sub,
        username: mockPayload.username,
      });
    });

    it('should handle payload with different structure', async () => {
      const mockPayload = {
        sub: 'another-user-id',
        username: 'anotheruser',
        role: 'admin',
        permissions: ['read', 'write'],
      };

      const result = await strategy.validate(mockPayload);

      expect(result).toEqual({
        userId: mockPayload.sub,
        username: mockPayload.username,
      });
      // Should ignore additional properties
      expect(result).not.toHaveProperty('role');
      expect(result).not.toHaveProperty('permissions');
    });

    it('should handle payload with only required fields', async () => {
      const mockPayload = {
        sub: 'minimal-user-id',
        username: 'minimaluser',
      };

      const result = await strategy.validate(mockPayload);

      expect(result).toEqual({
        userId: mockPayload.sub,
        username: mockPayload.username,
      });
    });
  });
});
