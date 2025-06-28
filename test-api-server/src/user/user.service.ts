import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

interface User {
  id: number;
  name: string;
  email: string;
}

@Injectable()
export class UserService {
  #users: User[] = [{ id: 1, name: 'seungwan', email: 'swsj2369@hanmail.net' }];
  #idCounter: number = 2;

  create(createUserDto: CreateUserDto) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(createUserDto.email) || !createUserDto.name) {
      throw new BadRequestException('유효하지 않은 이메일 형식입니다.');
    }

    const newUser: User = {
      id: this.#idCounter++,
      name: createUserDto.name,
      email: createUserDto.email,
    };

    this.#users.push(newUser);
    return newUser;
  }

  findAll() {
    return this.#users;
  }

  findOne(id: number) {
    const user = this.#users.find((user) => user.id === id);

    if (!user) {
      throw new BadRequestException('사용자를 찾을 수 없습니다.');
    }

    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    const userIndex = this.#users.findIndex((user) => user.id === id);

    if (userIndex === -1) {
      throw new BadRequestException('사용자를 찾을 수 없습니다.');
    }

    const updatedUser = {
      ...this.#users[userIndex],
      ...updateUserDto,
    };

    this.#users[userIndex] = updatedUser;
    return updatedUser;
  }

  remove(id: number) {
    const userIndex = this.#users.findIndex((user) => user.id === id);

    if (userIndex === -1) {
      throw new BadRequestException('사용자를 찾을 수 없습니다.');
    }

    const removedUser = this.#users.splice(userIndex, 1)[0];
    return removedUser;
  }
}
