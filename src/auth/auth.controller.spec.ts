import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockRegisterResult = {
    id: '1',
    username: 'newuser',
  };

  const mockLoginResult = {
    access_token: 'jwt-token-123',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const registerDto: RegisterDto = {
        username: 'newuser',
        password: 'password123',
      };

      jest.spyOn(authService, 'register').mockResolvedValue(mockRegisterResult);

      const result = await controller.register(registerDto);

      expect(authService.register).toHaveBeenCalledWith(
        registerDto.username,
        registerDto.password,
      );
      expect(result).toEqual(mockRegisterResult);
    });

    it('should handle register service errors', async () => {
      const registerDto: RegisterDto = {
        username: 'existinguser',
        password: 'password123',
      };

      const error = new Error('Username already exists');
      jest.spyOn(authService, 'register').mockRejectedValue(error);

      await expect(controller.register(registerDto)).rejects.toThrow(
        'Username already exists',
      );
      expect(authService.register).toHaveBeenCalledWith(
        registerDto.username,
        registerDto.password,
      );
    });

    it('should pass correct parameters to auth service', async () => {
      const registerDto: RegisterDto = {
        username: 'testuser',
        password: 'testpass',
      };

      jest.spyOn(authService, 'register').mockResolvedValue(mockRegisterResult);

      await controller.register(registerDto);

      expect(authService.register).toHaveBeenCalledWith('testuser', 'testpass');
    });
  });

  describe('login', () => {
    it('should login successfully and return access token', async () => {
      const loginDto: LoginDto = {
        username: 'testuser',
        password: 'password123',
      };

      jest.spyOn(authService, 'login').mockResolvedValue(mockLoginResult);

      const result = await controller.login(loginDto);

      expect(authService.login).toHaveBeenCalledWith(
        loginDto.username,
        loginDto.password,
      );
      expect(result).toEqual(mockLoginResult);
    });

    it('should handle login service errors', async () => {
      const loginDto: LoginDto = {
        username: 'wronguser',
        password: 'wrongpass',
      };

      const error = new Error('Invalid credentials');
      jest.spyOn(authService, 'login').mockRejectedValue(error);

      await expect(controller.login(loginDto)).rejects.toThrow(
        'Invalid credentials',
      );
      expect(authService.login).toHaveBeenCalledWith(
        loginDto.username,
        loginDto.password,
      );
    });

    it('should pass correct parameters to auth service', async () => {
      const loginDto: LoginDto = {
        username: 'testuser',
        password: 'testpass',
      };

      jest.spyOn(authService, 'login').mockResolvedValue(mockLoginResult);

      await controller.login(loginDto);

      expect(authService.login).toHaveBeenCalledWith('testuser', 'testpass');
    });
  });
});
