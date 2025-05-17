import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/entity/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService
  ) {}

  async authenticate(email: string, password: string) {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new BadRequestException(
        `${email} 이메일을 가진 사용자가 없습니다!`
      );
    }

    const isPasswordValid = await bcrypt.compareSync(password, user.password);

    if (!isPasswordValid) {
      throw new BadRequestException('잘못된 이메일 정보입니다!');
    }

    return user;
  }

  async issueToken(email: string, isRefreshToken: boolean) {
    return await this.jwtService.signAsync(
      {
        userEmail: email,
        type: isRefreshToken ? 'refresh' : 'access',
      },
      {
        secret: isRefreshToken
          ? this.configService.get<string>('REFRESH_TOKEN_SECRET')
          : this.configService.get<string>('ACCESS_TOKEN_SECRET'),
        expiresIn: isRefreshToken ? '24h' : 3600,
      }
    );
  }

  async register(createUserDto: CreateUserDto) {
    const { email, nickName, password } = createUserDto;
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (user) {
      throw new ConflictException('이미 존재하는 이메일입니다.');
    }

    // 어차피 이름만 들어오는 것이므로 bcrypt로 해싱해서 넣어주면 된다.
    const hashedPassword = await bcrypt.hash(
      password,
      this.configService.get<number>('HASH_ROUNDS') as number
    );

    await this.userRepository.save({
      email: email,
      nickName: nickName,
      password: hashedPassword,
    });

    return await this.userRepository.findOne({
      where: {
        email,
      },
    });
  }

  // passport-local을 이용해서 사용자의 이름과 패스워드를 확인한 바를 기반으로 사용자를 만들어주면 된다.
  async login(loginUserDto: LoginDto) {
    // req의 정보를 이용해서 issueToken을 하면 됨.

    return {
      accessToken: await this.issueToken(loginUserDto.email, false),
      refreshToken: await this.issueToken(loginUserDto.email, true),
    };
  }
}
