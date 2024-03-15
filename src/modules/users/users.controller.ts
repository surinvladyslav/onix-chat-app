import {
  Controller,
  Get,
  Put,
  Body,
  Param,
} from '@nestjs/common';
import {
  ApiTags,
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiBadRequestResponse,
  ApiBody,
} from '@nestjs/swagger';
import UsersService from '@modules/users/users.service';
import { User } from '@prisma/client';

@ApiTags('Users')
@Controller('users')
export default class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiCookieAuth()
  @ApiOkResponse({ description: 'Successfully fetched users list.' })
  @ApiBadRequestResponse({ description: "Couldn't fetch users list." })
  async getAllUsers(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user profile' })
  @ApiCookieAuth()
  @ApiBody({ description: 'Full name of the user', type: String })
  @ApiOkResponse({ description: 'Successfully updated user profile.' })
  @ApiBadRequestResponse({ description: "Couldn't update user profile." })
  async updateProfile(
    @Param('id') id: string,
    @Body('fullname') fullname: string,
  ): Promise<User> {
    const userId: number = parseInt(id, 10);
    return this.usersService.updateProfile(userId, fullname);
  }
}
