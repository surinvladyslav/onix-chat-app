import { Injectable, NotFoundException } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import UsersService from '@modules/users/users.service';
import { User } from '@prisma/client';
import { USER_NOT_FOUND } from '@constants/errors.constants';

@Injectable()
export default class SessionSerializer extends PassportSerializer {
  constructor(private readonly usersService: UsersService) {
    super();
  }

  serializeUser(
    user: User,
    done: (err: Error | null, id: number) => void,
  ): void {
    done(null, user.id);
  }

  async deserializeUser(
    id: number,
    done: (err: Error | null, user?: User) => void,
  ): Promise<void> {
    try {
      const foundUser = await this.usersService.findById(id);

      if (!foundUser) {
        throw new NotFoundException(USER_NOT_FOUND);
      }

      done(null, foundUser);
    } catch (error) {
      done(error);
    }
  }
}
