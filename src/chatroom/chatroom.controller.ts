import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Render,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ChatroomService } from './chatroom.service';
import { Chatroom, Message } from '@prisma/client';
import { ChatroomDto, MessageDto } from './dto';
import { UserService } from '../user/user.service';
import { AuthGuard } from '../auth/auth.guard';
import { MinioService } from '../minio/minio.service';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('chatroom')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('chatroom')
export class ChatroomController {
  constructor(
    private readonly chatroomService: ChatroomService,
    private readonly userService: UserService,
    private readonly minioService: MinioService,
  ) {}

  @Get(':id')
  @Render('chatroom')
  @ApiOperation({ summary: 'Render chatroom page' })
  @ApiParam({ name: 'id', type: Number, description: 'Chatroom ID' })
  @UsePipes(ParseIntPipe)
  async getChatPage(@Param('id') id: number, @Req() req) {
    const messages = await this.chatroomService.getMessagesForChatroom(id);
    const chatroom = await this.chatroomService.getChatroom(id);
    let imageUrl: string;
    if (chatroom.imageUrl) {
      imageUrl = await this.minioService.getImageUrl(chatroom.imageUrl);
    }
    const users = await this.userService.getUsersOfChatroom(id);
    const userId = +req.user.sub;
    return { messages, chatroom, users, imageUrl, userId };
  }

  @Post('message')
  @ApiOperation({ summary: 'Send message to chatroom' })
  @ApiBody({ type: MessageDto })
  @ApiResponse({
    status: 201,
    description: 'Message sent successfully',
    type: MessageDto,
  })
  async sendMessage(@Body() body: any, @Req() req): Promise<Message> {
    const { chatroomId, content } = body;
    return this.chatroomService.sendMessage(chatroomId, content, req.user.sub);
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
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
    @Res() res,
  ): Promise<any> {
    const { name, userIds } = body;
    let imageFileName = null;

    if (file) {
      const fileName = `${Date.now()}-${file.originalname}`;
      await this.minioService.uploadImage(file, fileName);
      imageFileName = fileName;
    }

    const newChatroom = await this.chatroomService.createChatroom(
      name,
      req.user.sub,
      imageFileName,
    );

    await this.chatroomService.addUsersToChatroom(
      newChatroom.id,
      JSON.parse(userIds),
    );

    return res.redirect(`/chatroom/${newChatroom.id}`);
  }

  @Post(':chatroomId')
  @ApiOperation({ summary: 'Add users to chatroom' })
  @ApiResponse({ status: 200, description: 'Users added successfully' })
  async addUsersToChatroom(
    @Param('chatroomId') chatroomId: number,
    @Body('userIds') userIds: number[],
  ) {
    return this.chatroomService.addUsersToChatroom(chatroomId, userIds);
  }

  // @Put(':id')
  // @UseInterceptors(FileInterceptor('file'))
  // @ApiOperation({ summary: 'Update chatroom details' })
  // // @ApiParam({ name: 'id', type: Number, description: 'Chatroom ID' })
  // // @ApiBody({ type: ChatroomDto })
  // // @UsePipes(ParseIntPipe)
  // async updateChatroom(
  //   @Param('id') id: number,
  //   @Body() body: any,
  //   @UploadedFile() file: Express.Multer.File,
  //   // @Req() req,
  //   @Res() res,
  // ): Promise<any> {
  //   console.log(id);
  //   const { name, userIds } = body;
  //   console.log(name);
  //   console.log(userIds);
  //
  //   // let imageFileName = null;
  //   // const chatroom = await this.chatroomService.getChatroom(id);
  //   // if (!chatroom) {
  //   //   throw new NotFoundException(`Chatroom with id ${id} not found`);
  //   // }
  //   //
  //   // if (file) {
  //   //   const fileName = `${Date.now()}-${file.originalname}`;
  //   //   await this.minioService.uploadImage(file, fileName);
  //   //   imageFileName = fileName;
  //   // }
  //   //
  //   // const newChatroom = await this.chatroomService.updateChatroom(
  //   //   id,
  //   //   name,
  //   //   imageFileName,
  //   // );
  //   //
  //   // await this.chatroomService.addUsersToChatroom(
  //   //   newChatroom.id,
  //   //   JSON.parse(userIds),
  //   // );
  //
  //   // const newChatroom = {
  //   //   id: 3,
  //   // };
  //   // return res.redirect(`/chatroom/${newChatroom.id}`);
  // }

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
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File,
    @Res() res,
  ): Promise<any> {
    const { name, userIds } = body;

    let imageFileName = null;
    const chatroom = await this.chatroomService.getChatroom(id);
    if (!chatroom) {
      throw new NotFoundException(`Chatroom with id ${id} not found`);
    }

    if (file) {
      const fileName = `${Date.now()}-${file.originalname}`;
      await this.minioService.uploadImage(file, fileName);
      imageFileName = fileName;
    }

    const newChatroom = await this.chatroomService.updateChatroom(
      id,
      name,
      imageFileName,
    );

    await this.chatroomService.addUsersToChatroom(
      newChatroom.id,
      JSON.parse(userIds),
    );

    return res.redirect(`/chatroom/${newChatroom.id}`);
  }

  @Get(':userId/chatrooms')
  @ApiOperation({ summary: 'Get chatrooms for user' })
  @ApiResponse({
    status: 200,
    description: 'Chatrooms retrieved successfully',
    type: [ChatroomDto],
  })
  async getChatroomsForUser(
    @Param('userId') userId: number,
  ): Promise<Chatroom[]> {
    return this.chatroomService.getChatroomsForUser(userId);
  }

  @Get(':chatroomId/messages')
  @ApiOperation({ summary: 'Get messages for chatroom' })
  @ApiResponse({
    status: 200,
    description: 'Messages retrieved successfully',
    type: [MessageDto],
  })
  @Get(':chatroomId/messages')
  async getMessagesForChatroom(
    @Param('chatroomId') chatroomId: number,
  ): Promise<Message[]> {
    console.log(chatroomId);
    return this.chatroomService.getMessagesForChatroom(chatroomId);
  }

  @Delete(':chatroomId')
  @ApiOperation({ summary: 'Delete chatroom' })
  @ApiResponse({ status: 200, description: 'Chatroom deleted successfully' })
  @UsePipes(ParseIntPipe)
  async deleteChatroom(
    @Param('chatroomId') chatroomId: number,
  ): Promise<string> {
    const chatroom = await this.chatroomService.deleteChatroom(chatroomId);

    if (chatroom.imageUrl) {
      await this.minioService.deleteImage(chatroom.imageUrl);
    }

    return 'Chatroom deleted successfully';
  }
}
