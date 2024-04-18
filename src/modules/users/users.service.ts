import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { UserRepository } from '@modules/users/users.repository';
import { User } from '@prisma/client';
import { Session } from 'express-session';
import { SignUpDto } from '@modules/auth/dto/sign-up.dto';
import { USER_CONFLICT } from '@constants/errors.constants';
import UserEntity from '@modules/users/entities/user.entity';

@Injectable()
export default class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly usersRepository: UserRepository) {}

  async create(signUpDto: SignUpDto): Promise<User> {
    const testUser: User = await this.usersRepository.findOne({
      where: { email: signUpDto.email },
    });

    if (testUser) {
      throw new ConflictException(USER_CONFLICT);
    }

    return this.usersRepository.create(signUpDto);
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
    return this.usersRepository.findOne({
      where: { id },
    });
  }

  async findAll(): Promise<UserEntity[]> {
    return this.usersRepository.findAll();
  }

  logout(session: Session): void {
    session.destroy((err: Error | null) => {
      if (err) {
        this.logger.error(
          'Error occurred while destroying session:',
          err.message,
        );
      }
    });
  }
}
