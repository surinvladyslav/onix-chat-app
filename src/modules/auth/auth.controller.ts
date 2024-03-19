import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  Res,
  Render,
  Get,
  HttpCode,
  HttpStatus,
  UseFilters,
} from '@nestjs/common';
import {
  ApiTags,
  ApiInternalServerErrorResponse,
  ApiCookieAuth,
  ApiMovedPermanentlyResponse,
  ApiBody,
  ApiExcludeEndpoint,
} from '@nestjs/swagger';
import {
  Response as ExpressResponse,
  Request as ExpressRequest,
} from 'express';
import UsersService from '@modules/users/users.service';
import SignInDto from '@modules/auth/dto/sign-in.dto';
import IsNotLoggedGuard from '@guards/is-not-logged.guard';
import RedirectIfLoggedGuard from '@guards/redirect-if-logged.guard';
import LoginExceptionFilter from '@filters/login.exception.filter';
import LocalAuthGuard from './guards/local-auth.guard';
import SignUpDto from './dto/sign-up.dto';

@ApiTags('Auth')
@Controller('auth')
export default class AuthController {
  constructor(private readonly usersService: UsersService) {}

  @ApiExcludeEndpoint()
  @UseGuards(RedirectIfLoggedGuard)
  @Get('login')
  @Render('login')
  index() {}

  @ApiExcludeEndpoint()
  @UseGuards(IsNotLoggedGuard)
  @Get('/sign-up')
  @Render('signup')
  async signUp(): Promise<void> {}

  @ApiMovedPermanentlyResponse({ description: 'Redirects to home' })
  @ApiInternalServerErrorResponse({ description: 'Returns the 500 error' })
  @Post('/register')
  async create(
    @Body() params: SignUpDto,
    @Res() res: ExpressResponse,
  ): Promise<void> {
    await this.usersService.create(params);

    return res.redirect('/api/v1/auth/login');
  }

  @ApiMovedPermanentlyResponse({ description: '301. If logout is success' })
  @ApiInternalServerErrorResponse({ description: 'Internal error' })
  @ApiCookieAuth()
  @Get('/logout')
  logout(@Request() req, @Res() res: ExpressResponse): void {
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }

      res.status(200).json({ message: 'Logged out successfully' });
    });
  }

  @ApiBody({ type: SignInDto })
  @ApiMovedPermanentlyResponse({ description: 'Returns 301 if login is ok' })
  @ApiInternalServerErrorResponse({
    description: 'Returns 500 if smth has been failed',
  })
  @HttpCode(HttpStatus.MOVED_PERMANENTLY)
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @UseFilters(LoginExceptionFilter)
  login(@Request() req: ExpressRequest, @Res() res: ExpressResponse): void {
    return res.redirect('/api/v1/home');
  }
}
