import {
  Controller,
  Get,
  Put,
  Body,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiCookieAuth, ApiOkResponse } from '@nestjs/swagger';
import UsersService from '@modules/users/users.service';
import { User } from '@prisma/client';
import UserEntity from '@modules/users/entities/user.entity';
import { Serialize } from '@decorators/serialize.decorator';

@ApiTags('Users')
@Controller('users')
export default class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiCookieAuth()
  @ApiOkResponse({ type: UserEntity, isArray: true })
  @Serialize(UserEntity)
  @Get()
  async findAll(): Promise<UserEntity[]> {
    return this.usersService.findAll();
  }

  @ApiCookieAuth()
  @Serialize(UserEntity)
  @Put(':id')
  async updateProfile(
    @Param('id') id: string,
    @Body('fullname') fullname: string,
  ): Promise<User> {
    const userId: number = parseInt(id, 10);

    return this.usersService.updateProfile(userId, fullname);
  }
}
