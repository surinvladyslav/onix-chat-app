import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Redirect,
  Render,
  Req,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCookieAuth,
  ApiExcludeEndpoint,
  ApiInternalServerErrorResponse,
  ApiMovedPermanentlyResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request as ExpressRequest } from 'express';
import UsersService from '@modules/users/users.service';
import { SignInDto } from '@modules/auth/dto/sign-in.dto';
import IsNotLoggedGuard from '@guards/is-not-logged.guard';
import RedirectIfLoggedGuard from '@guards/redirect-if-logged.guard';
import LoginExceptionFilter from '@filters/login.exception.filter';
import LocalAuthGuard from './guards/local-auth.guard';
import { SignUpDto } from './dto/sign-up.dto';
import UserDto from '@modules/users/dto/user.dto';
import { User } from '@prisma/client';
import UserEntity from '@modules/users/entities/user.entity';
import { SkipAuth } from '@decorators/skip-auth.decorator';
import { Serialize } from '@decorators/serialize.decorator';

@ApiTags('Auth')
@Controller('auth')
export default class AuthController {
  constructor(private readonly usersService: UsersService) {}

  @ApiExcludeEndpoint()
  @UseGuards(RedirectIfLoggedGuard)
  @SkipAuth()
  @Render('login')
  @Get('login')
  index() {}

  @ApiExcludeEndpoint()
  @UseGuards(IsNotLoggedGuard)
  @SkipAuth()
  @Render('signup')
  @Get('sign-up')
  async signUp(): Promise<void> {}

  @ApiMovedPermanentlyResponse({ description: 'Redirects to login page' })
  @ApiInternalServerErrorResponse({ description: 'Returns the 500 error' })
  @ApiOkResponse({ description: 'User registered successfully', type: UserDto })
  @Serialize(UserEntity)
  @SkipAuth()
  @Redirect('/api/v1/auth/login')
  @Post('register')
  create(@Body() params: SignUpDto): Promise<User> {
    return this.usersService.create(params);
  }

  @ApiBody({ type: SignInDto })
  @ApiMovedPermanentlyResponse({
    description: 'Redirects to home page if login is successful',
  })
  @ApiInternalServerErrorResponse({ description: 'Internal error' })
  @ApiOkResponse({ description: 'User logged in successfully', type: UserDto })
  @HttpCode(HttpStatus.MOVED_PERMANENTLY)
  @SkipAuth()
  @UseGuards(LocalAuthGuard)
  @UseFilters(LoginExceptionFilter)
  @Redirect('/api/v1/home')
  @Post('login')
  login(@Req() req: ExpressRequest): any {
    return req.user;
  }

  @ApiMovedPermanentlyResponse({ description: 'Redirects to login page' })
  @ApiInternalServerErrorResponse({ description: 'Internal error' })
  @ApiCookieAuth()
  @ApiOkResponse({ description: 'User logged out successfully' })
  @Redirect('/api/v1/auth/login')
  @Post('logout')
  logout(@Req() req: ExpressRequest): void {
    this.usersService.logout(req.session);
  }
}
