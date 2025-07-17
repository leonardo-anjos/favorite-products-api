import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'john_doe' })
  @IsString()
  @MinLength(3)
  @MaxLength(32)
  username: string;

  @ApiProperty({ example: 'Password123' })
  @IsString()
  @MinLength(6)
  @MaxLength(64)
  password: string;
}
