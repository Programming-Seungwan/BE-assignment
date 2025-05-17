import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRePository: Repository<User>
  ) {}

  create(createUserDto: CreateUserDto) {
    return this.userRePository.save(createUserDto);
  }

  findAll() {
    return this.userRePository.find();
  }

  async findOne(id: number) {
    const user = await this.userRePository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`id ${id}를 가진 유저가 없습니다!`);
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const forUpdateUser = await this.userRePository.findOne({
      where: { id },
    });

    if (!forUpdateUser) {
      throw new NotFoundException(
        `업데이트할 id ${id}를 가진 유저가 없습니다!`
      );
    }

    await this.userRePository.update(id, updateUserDto);

    return await this.userRePository.findOne({ where: { id } });
  }

  async remove(id: number) {
    const forRemoveUser = await this.userRePository.findOne({ where: { id } });

    if (!forRemoveUser) {
      throw new NotFoundException(`삭제할 id ${id}를 가진 유저가 없습니다!`);
    }

    return this.userRePository.delete(id);
  }
}
