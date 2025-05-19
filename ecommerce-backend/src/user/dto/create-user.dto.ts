import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ description: '회원가입용 이메일 필드' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '회원가입용 사용자 닉네임 필드' })
  nickName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '회원가입용 비밀번호 필드' })
  password: string;
}
