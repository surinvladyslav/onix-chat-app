import { Controller, Get, Render, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ChatroomService } from './chatroom/chatroom.service';
import { AuthGuard } from './auth/auth.guard';
import { Request } from 'express';
import { MinioService } from './minio/minio.service';
import { UserService } from './user/user.service';
import { User } from '@prisma/client';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(
    private readonly chatroomService: ChatroomService,
    private readonly userService: UserService,
    private readonly minioService: MinioService,
  ) {}

  @Get()
  @Render('index')
  @ApiOperation({ summary: 'Render start page' })
  @ApiResponse({ status: 200, description: 'Start page rendered successfully' })
  getStartPage() {
    return;
  }

  @UseGuards(AuthGuard)
  @Get('home')
  @Render('home')
  @ApiOperation({ summary: 'Get home page' })
  @ApiBearerAuth()
  async getHomePage(
    @Req() req: Request,
  ): Promise<{ chats: any[]; user: User }> {
    try {
      const userId: number = (req as any).user?.sub;
      const user = await this.userService.getUser(userId);
      const chats: any[] = await this.chatroomService.getChatroomsForUser(
        userId,
      );
      const promises = chats.map(async (chatroom) => {
        let imageUrl;
        if (chatroom.imageUrl) {
          imageUrl = await this.minioService.getImageUrl(chatroom.imageUrl);
        }
        return {
          ...chatroom,
          imageUrl: imageUrl ? imageUrl : null,
        };
      });
      const processedChats = await Promise.all(promises);
      return { chats: processedChats, user };
    } catch (error) {
      console.error('Error fetching messages for home page:', error);
      return { user: null, chats: [] };
    }
  }
}
