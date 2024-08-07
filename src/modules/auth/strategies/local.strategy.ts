import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import AuthService from '../auth.service';
import { ValidateUserOutput } from '../interfaces/validate-user-output.interface';
import { INVALID_CREDENTIALS } from '@constants/errors.constants';

@Injectable()
export default class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string): Promise<ValidateUserOutput> {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException(INVALID_CREDENTIALS);
    }

    return user;
  }
}
