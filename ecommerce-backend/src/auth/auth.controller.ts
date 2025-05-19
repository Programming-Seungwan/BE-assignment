import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LocalAuthGuard } from './strategy/local.strategy';
import { LoginDto } from './dto/login.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  // 회원 가입을 하는 로직, 로그인을 하면 이를 기반으로 jwt의 access token과 refresh token을 발급해주는 로직, refresh token을 기반으로 accessToken을 재발급해주는 로직이 필요함
  @Post('/register')
  @ApiOperation({ summary: '회원 가입용 엔드포인트' })
  @ApiBody({ type: CreateUserDto })
  registerUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('/login')
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: '로그인용 엔드포인트' })
  @ApiResponse({
    status: 200,
    description: '인증 관련 access token과 refresh token 반환',
  })
  @ApiBody({ type: LoginDto })
  login(@Request() req: LoginDto) {
    return this.authService.login(req);
  }
}
