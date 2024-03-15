import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Render,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ChatroomService } from './chatroom.service';
import { Chatroom, Message } from '@prisma/client';
import { ChatroomDto, MessageDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadDto } from '@modules/chatroom/dto/file.dto';

@ApiTags('Chatroom')
@ApiCookieAuth()
@Controller('chatroom')
export class ChatroomController {
  constructor(private readonly chatroomService: ChatroomService) {}

  @Get(':id')
  @Render('chatroom')
  @ApiOperation({ summary: 'Render chatroom page' })
  @ApiParam({ name: 'id', type: Number, description: 'Chatroom ID' })
  async getChatPage(
    @Param('id') id: string,
    @Req() req,
    @Res() res,
  ): Promise<{
    messages: Message[];
    chatroom: Chatroom;
    imageUrl: string;
    userId: number;
  }> {
    try {
      const chatroomId = parseInt(id, 10);
      const userId = req.user.id;

      const data = await this.chatroomService.getChatPageData(
        chatroomId,
        userId,
      );

      res.render('chatroom', { ...data });
    } catch (error) {
      console.error('Error fetching messages for home page:', error);
      return {
        messages: [],
        chatroom: null,
        imageUrl: null,
        userId: null,
      };
    }
  }

  @Post('message')
  @ApiOperation({ summary: 'Send message to chatroom' })
  @ApiBody({ type: MessageDto })
  @ApiResponse({
    status: 201,
    description: 'Message sent successfully',
    type: MessageDto,
  })
  async sendMessage(@Body() body: MessageDto, @Req() req): Promise<Message> {
    const { chatroomId, content } = body;
    return this.chatroomService.sendMessage(chatroomId, content, req.user.id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Create a new chatroom' })
  @ApiBody({ type: ChatroomDto })
  @ApiResponse({
    status: 201,
    description: 'Chatroom created successfully',
    type: ChatroomDto,
  })
  async createChatroom(
    @Body() body,
    @UploadedFile() file: FileUploadDto,
    @Req() req,
    @Res() res,
  ): Promise<Chatroom> {
    const { name, userIds } = body;

    return this.chatroomService.createChatroom(
      name,
      req.user.id,
      file,
      JSON.parse(userIds),
    );
  }

  @Post(':chatroomId')
  @ApiOperation({ summary: 'Add users to chatroom' })
  @ApiResponse({ status: 200, description: 'Users added successfully' })
  async addUsersToChatroom(
    @Param('chatroomId') chatroomId: string,
    @Body('userIds') userIds: number[],
  ): Promise<void> {
    const userIdsAsNumbers = userIds.map(Number);
    await this.chatroomService.addUsersToChatroom(
      parseInt(chatroomId, 10),
      userIdsAsNumbers,
    );
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Update chatroom details' })
  @ApiParam({ name: 'id', type: Number, description: 'Chatroom ID' })
  @ApiBody({
    description: 'Chatroom data',
    type: ChatroomDto,
  })
  @ApiOkResponse({ description: 'Chatroom details updated successfully' })
  @ApiBadRequestResponse({ description: 'Invalid data or chatroom not found' })
  async updateChatroom(
    @Param('id', ParseIntPipe) id: number,
    @Body() body,
    @UploadedFile() file: FileUploadDto,
    @Res() res,
  ): Promise<string> {
    const { name, userIds } = body;
    await this.chatroomService.updateChatroom(
      id,
      name,
      file,
      JSON.parse(userIds),
    );

    return res.redirect(`/api/v1/chatroom/${id}`);
  }

  @Get(':userId/chatrooms')
  @ApiOperation({ summary: 'Get chatrooms for user' })
  @ApiResponse({
    status: 200,
    description: 'Chatrooms retrieved successfully',
    type: [ChatroomDto],
  })
  async getChatroomsForUser(
    @Param('userId') userId: string,
  ): Promise<Chatroom[]> {
    return this.chatroomService.getChatroomsForUser(parseInt(userId, 10));
  }

  @Get(':chatroomId/messages')
  @ApiOperation({ summary: 'Get messages for chatroom' })
  @ApiResponse({
    status: 200,
    description: 'Messages retrieved successfully',
    type: [MessageDto],
  })
  async getMessagesForChatroom(
    @Param('chatroomId') chatroomId: string,
  ): Promise<Message[]> {
    return this.chatroomService.getMessagesForChatroom(
      parseInt(chatroomId, 10),
    );
  }

  @Delete(':chatroomId')
  @ApiOperation({ summary: 'Delete chatroom' })
  @ApiResponse({ status: 200, description: 'Chatroom deleted successfully' })
  async deleteChatroom(
    @Param('chatroomId') chatroomId: string,
  ): Promise<string> {
    await this.chatroomService.deleteChatroom(parseInt(chatroomId, 10));
    return 'good';
  }
}
