import {
  Controller,
  Get,
  Post,
  Render,
  Body,
  Res,
  HttpStatus,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';
import { Request, Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('register')
  @Render('register')
  @ApiOperation({ summary: 'Render register page' })
  getRegisterPage() {
    return;
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterDto, description: 'Registration details' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  async register(@Body() registerDto: RegisterDto, @Res() res: Response) {
    try {
      if (registerDto.password !== registerDto.confirmPassword) {
        throw new BadRequestException({
          confirmPassword: 'Password and confirm password are not the same.',
        });
      }
      await this.authService.register(registerDto, res);
      return res.redirect('/home');
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
    }
  }

  @Get('login')
  @Render('login')
  @ApiOperation({ summary: 'Render login page' })
  getLoginPage() {
    return;
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ type: LoginDto, description: 'Login credentials' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    try {
      await this.authService.login(loginDto, res);
      return res.redirect('/home');
    } catch (error) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ error: error.message });
    }
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Logged out successfully',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async logout(@Res() res: Response) {
    try {
      await this.authService.logout(res);
      return res
        .status(HttpStatus.OK)
        .json({ message: 'Logged out successfully' });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiBody({ description: 'Refresh token' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    try {
      const token = await this.authService.refreshToken(req, res);
      return res.status(HttpStatus.OK).json({ token });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
    }
  }
}
