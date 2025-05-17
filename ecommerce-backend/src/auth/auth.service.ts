import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/entity/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService
  ) {}

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
}
