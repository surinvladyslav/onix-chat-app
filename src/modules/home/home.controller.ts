import { Controller, Get, UseGuards, Render, Req } from '@nestjs/common';
import { Request as ExpressRequest } from 'express';

import IsLoggedGuard from '@guards/is-logged.guard';
import { ChatroomService } from '@modules/chatroom/chatroom.service';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { User } from '@modules/users/interfaces/user.interface';

@Controller('home')
export default class HomeController {
  constructor(private readonly chatroomService: ChatroomService) {}

  @ApiExcludeEndpoint()
  @UseGuards(IsLoggedGuard)
  @Render('home')
  @Get('/')
  async getHome(@Req() req: ExpressRequest) {
    const user: User = req.user;

    const chats = await this.chatroomService.getChatroomsForUser(user.id);
    const processedChats = await this.chatroomService.processChatrooms(chats);

    return { chats: processedChats, user };
  }
}
