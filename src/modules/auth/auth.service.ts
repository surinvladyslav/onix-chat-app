import * as bcrypt from 'bcrypt';

import { Injectable, NotFoundException } from '@nestjs/common';

import { ValidateUserOutput } from './interfaces/validate-user-output.interface';
import UsersService from '@modules/users/users.service';

@Injectable()
export default class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<null | ValidateUserOutput> {
    const user = await this.usersService.getVerifiedByEmail(email);

    if (!user) {
      throw new NotFoundException('The item does not exist');
    }

    const passwordCompared = await bcrypt.compare(password, user.password);

    if (passwordCompared) {
      return {
        id: user.id,
        email: user.email,
      };
    }

    return null;
  }
}
