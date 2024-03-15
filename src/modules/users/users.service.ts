import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import UserDto from './dto/user.dto';
import { UserRepository } from '@modules/users/users.repository';
import { User } from '@prisma/client';

@Injectable()
export default class UsersService {
  constructor(private readonly usersRepository: UserRepository) {}

  async create(userDto: UserDto): Promise<User> {
    return this.usersRepository.create({
      password: userDto.password,
      email: userDto.email,
      fullname: userDto.fullname,
    });
  }

  async updateProfile(userId: number, fullname: string): Promise<User> {
    return this.usersRepository.updateProfile(userId, fullname);
  }

  async getVerifiedByEmail(email: string): Promise<User | null> {
    return this.usersRepository.getVerifiedByEmail(email);
  }

  async getUsersOfChatroom(chatroomId: number): Promise<User[]> {
    return this.usersRepository.getUsersOfChatroom(chatroomId);
  }

  async findById(id: number): Promise<User | null> {
    return this.usersRepository.findById(id);
  }

  async findOne(id: number): Promise<User | null> {
    return this.usersRepository.findOne(id);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.findAll();
  }
}
