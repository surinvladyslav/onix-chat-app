import { Module } from '@nestjs/common';
import UsersController from '@modules/users/users.controller';
import UsersService from '@modules/users/users.service';
import { UserRepository } from '@modules/users/users.repository';

@Module({
  imports: [],
  controllers: [UsersController],
  providers: [UsersService, UserRepository],
  exports: [UsersService],
})
export default class UsersModule {}
