import { Controller, Get, Body, Req, UseGuards, Put } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { Request } from 'express';
import { User } from '@prisma/client';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Successfully fetched users list.' })
  @ApiBadRequestResponse({ description: "Couldn't fetch users list." })
  async getUsers(): Promise<User[]> {
    return this.userService.getUsers();
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user profile' })
  @ApiBody({ description: 'Full name of the user', type: String })
  @ApiOkResponse({ description: 'Successfully updated user profile.' })
  @ApiBadRequestResponse({ description: "Couldn't update user profile." })
  async updateProfile(
    @Body('fullname') fullname: string,
    @Req() request: Request,
  ): Promise<User> {
    const userId = +request.params.id;
    return this.userService.updateProfile(userId, fullname);
  }
}
