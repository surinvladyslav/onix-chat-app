import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import UserEntity from '@modules/users/entities/user.entity';
import UsersService from '@modules/users/users.service';

@Injectable()
export default class SessionSerializer extends PassportSerializer {
  constructor(private readonly usersService: UsersService) {
    super();
  }

  serializeUser(user: UserEntity, done: CallableFunction) {
    done(null, user);
  }

  async deserializeUser(user: UserEntity, done: CallableFunction) {
    const foundUser = await this.usersService.findById(user.id);

    if (!foundUser) {
      return done(new UnauthorizedException('The user does not exist'));
    }

    return done(null, user);
  }
}
