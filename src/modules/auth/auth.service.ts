import * as bcrypt from 'bcrypt';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ValidateUserOutput } from './interfaces/validate-user-output.interface';
import UsersService from '@modules/users/users.service';
import { USER_NOT_FOUND } from '@constants/errors.constants';

@Injectable()
export default class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<ValidateUserOutput | null> {
    const user = await this.usersService.getVerifiedByEmail(email);

    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND);
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
    };
  }
}
