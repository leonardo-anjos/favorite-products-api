import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'john_doe' })
  @IsString()
  @MinLength(3)
  @MaxLength(32)
  username: string;

  @ApiProperty({ example: 'Password123' })
  @IsString()
  @MinLength(6)
  @MaxLength(64)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=]{6,}$/, {
    message:
      'Password must be at least 6 characters and contain letters and numbers.',
  })
  password: string;
}
