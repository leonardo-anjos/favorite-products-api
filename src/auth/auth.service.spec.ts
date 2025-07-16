import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUser = {
    id: '1',
    username: 'testuser',
    password: 'hashedpassword',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockCreatedUser = {
    id: '2',
    username: 'newuser',
    password: 'hashedpassword',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByUsername: jest.fn(),
            createUser: jest.fn(),
            validateUser: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      jest.spyOn(usersService, 'findByUsername').mockResolvedValue(null);
      jest.spyOn(usersService, 'createUser').mockResolvedValue(mockCreatedUser);

      const result = await service.register('newuser', 'password123');

      expect(usersService.findByUsername).toHaveBeenCalledWith('newuser');
      expect(usersService.createUser).toHaveBeenCalledWith(
        'newuser',
        'password123',
      );
      expect(result).toEqual({
        id: mockCreatedUser.id,
        username: mockCreatedUser.username,
      });
    });

    it('should throw ConflictException when username already exists', async () => {
      jest.spyOn(usersService, 'findByUsername').mockResolvedValue(mockUser);

      await expect(service.register('testuser', 'password123')).rejects.toThrow(
        ConflictException,
      );
      expect(usersService.findByUsername).toHaveBeenCalledWith('testuser');
      expect(usersService.createUser).not.toHaveBeenCalled();
    });

    it('should throw ConflictException with correct message when username already exists', async () => {
      jest.spyOn(usersService, 'findByUsername').mockResolvedValue(mockUser);

      await expect(service.register('testuser', 'password123')).rejects.toThrow(
        'Username already exists',
      );
    });

    it('should handle createUser error', async () => {
      const createError = new Error('Database error');
      jest.spyOn(usersService, 'findByUsername').mockResolvedValue(null);
      jest.spyOn(usersService, 'createUser').mockRejectedValue(createError);

      await expect(service.register('newuser', 'password123')).rejects.toThrow(
        'Database error',
      );
    });
  });

  describe('login', () => {
    it('should login successfully and return access token', async () => {
      const mockToken = 'jwt-token-123';
      const expectedPayload = { sub: mockUser.id, username: mockUser.username };

      jest.spyOn(usersService, 'validateUser').mockResolvedValue(mockUser);
      jest.spyOn(jwtService, 'sign').mockReturnValue(mockToken);

      const result = await service.login('testuser', 'password123');

      expect(usersService.validateUser).toHaveBeenCalledWith(
        'testuser',
        'password123',
      );
      expect(jwtService.sign).toHaveBeenCalledWith(expectedPayload);
      expect(result).toEqual({ access_token: mockToken });
    });

    it('should throw UnauthorizedException when user is not found', async () => {
      jest.spyOn(usersService, 'validateUser').mockResolvedValue(null);

      await expect(service.login('nonexistent', 'password123')).rejects.toThrow(
        UnauthorizedException,
      );
      expect(usersService.validateUser).toHaveBeenCalledWith(
        'nonexistent',
        'password123',
      );
      expect(jwtService.sign).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      jest.spyOn(usersService, 'validateUser').mockResolvedValue(null);

      await expect(service.login('testuser', 'wrongpassword')).rejects.toThrow(
        UnauthorizedException,
      );
      expect(usersService.validateUser).toHaveBeenCalledWith(
        'testuser',
        'wrongpassword',
      );
      expect(jwtService.sign).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException with correct message for invalid credentials', async () => {
      jest.spyOn(usersService, 'validateUser').mockResolvedValue(null);

      await expect(service.login('testuser', 'wrongpassword')).rejects.toThrow(
        'Invalid credentials',
      );
    });

    it('should handle validateUser error', async () => {
      const validateError = new Error('Validation error');
      jest.spyOn(usersService, 'validateUser').mockRejectedValue(validateError);

      await expect(service.login('testuser', 'password123')).rejects.toThrow(
        'Validation error',
      );
    });

    it('should handle jwt sign error', async () => {
      const signError = new Error('JWT sign error');
      jest.spyOn(usersService, 'validateUser').mockResolvedValue(mockUser);
      jest.spyOn(jwtService, 'sign').mockImplementation(() => {
        throw signError;
      });

      await expect(service.login('testuser', 'password123')).rejects.toThrow(
        'JWT sign error',
      );
    });
  });
});
