import { Controller, Get, UseGuards, Render, Res, Req } from '@nestjs/common';
import { Response as ExpressResponse } from 'express';

import IsLoggedGuard from '@guards/is-logged.guard';
import { ChatroomService } from '@modules/chatroom/chatroom.service';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller('home')
export default class HomeController {
  constructor(private readonly chatroomService: ChatroomService) {}

  @ApiExcludeEndpoint()
  @UseGuards(IsLoggedGuard)
  @Get()
  @Render('home')
  async getHome(@Req() req, @Res() res: ExpressResponse) {
    try {
      const userId: number = req.user.id;
      const chats = await this.chatroomService.getChatroomsForUser(userId);
      const processedChats = await this.chatroomService.processChatrooms(chats);

      return res.render('home', { chats: processedChats, user: req.user });
    } catch (error) {
      console.error('Error fetching messages for home page:', error);
      return { user: null, chats: [] };
    }
  }
}
