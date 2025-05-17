import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  // 회원 가입을 하는 로직, 로그인을 하면 이를 기반으로 jwt의 access token과 refresh token을 발급해주는 로직, refresh token을 기반으로 accessToken을 재발급해주는 로직이 필요함
  @Post('/register')
  registerUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }
}
