import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

jest.mock('bcryptjs');

describe('UsersService', () => {
  let service: UsersService;
  let userRepo: Repository<User>;

  const mockUser: User = {
    id: '1',
    username: 'testuser',
    password: 'hashedpassword',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepo = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByUsername', () => {
    it('should return user when found', async () => {
      jest.spyOn(userRepo, 'findOne').mockResolvedValue(mockUser);

      const result = await service.findByUsername('testuser');

      expect(userRepo.findOne).toHaveBeenCalledWith({
        where: { username: 'testuser' },
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found', async () => {
      jest.spyOn(userRepo, 'findOne').mockResolvedValue(null);

      const result = await service.findByUsername('nonexistent');

      expect(userRepo.findOne).toHaveBeenCalledWith({
        where: { username: 'nonexistent' },
      });
      expect(result).toBeNull();
    });
  });

  describe('createUser', () => {
    it('should create and save user with hashed password', async () => {
      const hashedPassword = 'hashedpassword123';
      const userData = { username: 'newuser', password: hashedPassword };
      const createdUser = { ...mockUser, ...userData };

      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      jest.spyOn(userRepo, 'create').mockReturnValue(createdUser);
      jest.spyOn(userRepo, 'save').mockResolvedValue(createdUser);

      const result = await service.createUser('newuser', 'password123');

      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(userRepo.create).toHaveBeenCalledWith(userData);
      expect(userRepo.save).toHaveBeenCalledWith(createdUser);
      expect(result).toEqual(createdUser);
    });

    it('should handle bcrypt hash error', async () => {
      const hashError = new Error('Hash failed');
      (bcrypt.hash as jest.Mock).mockRejectedValue(hashError);

      await expect(
        service.createUser('newuser', 'password123'),
      ).rejects.toThrow('Hash failed');
    });
  });

  describe('validateUser', () => {
    it('should return user when credentials are valid', async () => {
      jest.spyOn(userRepo, 'findOne').mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser('testuser', 'password123');

      expect(userRepo.findOne).toHaveBeenCalledWith({
        where: { username: 'testuser' },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        'password123',
        mockUser.password,
      );
      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found', async () => {
      jest.spyOn(userRepo, 'findOne').mockResolvedValue(null);

      const result = await service.validateUser('nonexistent', 'password123');

      expect(userRepo.findOne).toHaveBeenCalledWith({
        where: { username: 'nonexistent' },
      });
      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('should return null when password is invalid', async () => {
      jest.spyOn(userRepo, 'findOne').mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await service.validateUser('testuser', 'wrongpassword');

      expect(userRepo.findOne).toHaveBeenCalledWith({
        where: { username: 'testuser' },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        'wrongpassword',
        mockUser.password,
      );
      expect(result).toBeNull();
    });

    it('should handle bcrypt compare error', async () => {
      jest.spyOn(userRepo, 'findOne').mockResolvedValue(mockUser);
      const compareError = new Error('Compare failed');
      (bcrypt.compare as jest.Mock).mockRejectedValue(compareError);

      await expect(
        service.validateUser('testuser', 'password123'),
      ).rejects.toThrow('Compare failed');
    });
  });
});
