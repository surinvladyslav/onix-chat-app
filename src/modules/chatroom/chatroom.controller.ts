import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Render,
  Req,
  Res,
  UploadedFile, UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  Response as ExpressResponse,
  Request as ExpressRequest,
} from 'express';
import { ApiCookieAuth, ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { ChatroomService } from './chatroom.service';
import { Chatroom, Message } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from '@modules/users/interfaces/user.interface';
import {
  CreateChatroomDto,
  UpdateChatroomDto,
} from '@modules/chatroom/dto/chatroom.dto';
import { MessageDto } from '@modules/chatroom/dto/message.dto';
import { INTERNAL_SERVER_ERROR } from '@constants/errors.constants';
import IsLoggedGuard from '@guards/is-logged.guard';

@ApiCookieAuth()
@ApiTags('Chatroom')
@Controller('chatroom')
export class ChatroomController {
  private readonly logger = new Logger(ChatroomController.name);

  constructor(private readonly chatroomService: ChatroomService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() chatroomDto: CreateChatroomDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Chatroom> {
    return this.chatroomService.create(chatroomDto, file);
  }

  @Put(':chatroomId')
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('chatroomId', ParseIntPipe) chatroomId: number,
    @Body() chatroomDto: UpdateChatroomDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<void> {
    return this.chatroomService.update(chatroomDto, file, chatroomId);
  }

  @ApiExcludeEndpoint()
  @UseGuards(IsLoggedGuard)
  @Get(':id')
  @Render('chatroom')
  async getChatPage(
    @Param('id', ParseIntPipe) chatroomId: number,
    @Req() req: ExpressRequest,
  ): Promise<{
    messages: Message[];
    chatroom: Chatroom;
    imageUrl: string;
    userId: number;
  }> {
    const user: User = req.user;
    const userId: number = user.id;

    return this.chatroomService.getChatPageData(chatroomId, userId);
  }

  @Post('message')
  async sendMessage(
    @Body() messageDto: MessageDto,
    @Req() req: ExpressRequest,
  ): Promise<Message> {
    try {
      const user: User = req.user;
      const userId: number = user.id;
      return this.chatroomService.sendMessage(messageDto, userId);
    } catch (error) {
      this.logger.error(`Error sending message: ${error.message}`);
      throw new InternalServerErrorException(INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':userId/chatrooms')
  async getChatroomsForUser(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<Chatroom[]> {
    return this.chatroomService.getChatroomsForUser(userId);
  }

  @Get(':chatroomId/messages')
  async getMessagesForChatroom(
    @Param('chatroomId', ParseIntPipe) chatroomId: number,
  ): Promise<Message[]> {
    return this.chatroomService.getMessagesForChatroom(chatroomId);
  }

  @Delete(':chatroomId')
  async delete(
    @Param('chatroomId', ParseIntPipe) chatroomId: number,
  ): Promise<void> {
    await this.chatroomService.delete(chatroomId);
  }
}
