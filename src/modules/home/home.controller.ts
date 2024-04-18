import { Controller, Get, UseGuards, Render, Res, Req } from '@nestjs/common';
import {
  Response as ExpressResponse,
  Request as ExpressRequest,
} from 'express';

import IsLoggedGuard from '@guards/is-logged.guard';
import { ChatroomService } from '@modules/chatroom/chatroom.service';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { User } from '@modules/users/interfaces/user.interface';

@Controller('home')
export default class HomeController {
  constructor(private readonly chatroomService: ChatroomService) {}

  @ApiExcludeEndpoint()
  @UseGuards(IsLoggedGuard)
  @Get()
  @Render('home')
  async getHome(@Req() req: ExpressRequest, @Res() res: ExpressResponse) {
    try {
      const user: User = req.user;
      const userId: number = user.id;

      const chats = await this.chatroomService.getChatroomsForUser(userId);
      const processedChats = await this.chatroomService.processChatrooms(chats);

      return res.render('home', { chats: processedChats, user: req.user });
    } catch (error) {
      return { user: null, chats: [] };
    }
  }
}
