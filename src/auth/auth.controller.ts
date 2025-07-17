import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'register a new user' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto.username, dto.password);
  }

  @Post('login')
  @ApiOperation({ summary: 'user login' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.username, dto.password);
  }
}
