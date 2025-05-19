import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ description: '로그인 이메일 필드' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '로그인 패스워드 필드' })
  password: string;
}
