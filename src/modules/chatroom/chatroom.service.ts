import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Chatroom, Message } from '@prisma/client';
import { ChatroomRepository } from '@modules/chatroom/chatroom.repository';
import { MinioService } from '@providers/minio/minio.service';
import { FileUploadDto } from '@modules/chatroom/dto/file.dto';
import UsersService from '@modules/users/users.service';

@Injectable()
export class ChatroomService {
  constructor(
    private readonly chatroomRepository: ChatroomRepository,
    private readonly minioService: MinioService,
    private readonly userService: UsersService,
  ) {}

  async getChatroom(id: number): Promise<Chatroom | null> {
    const chatroom = await this.chatroomRepository.findById(id);
    if (!chatroom) {
      throw new NotFoundException('Chatroom not found');
    }
    return chatroom;
  }

  async processChatrooms(chats: Chatroom[]) {
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
    return await Promise.all(promises);
  }

  async getChatPageData(chatroomId: number, userId: number) {
    const messages = await this.getMessagesForChatroom(chatroomId);
    const chatroom = await this.getChatroom(chatroomId);
    const users = await this.userService.getUsersOfChatroom(chatroomId);
    let imageUrl: string | null = null;

    if (chatroom.imageUrl) {
      imageUrl = await this.minioService.getImageUrl(chatroom.imageUrl);
    }

    return { messages, chatroom, imageUrl, users, userId };
  }

  async createChatroom(
    name: string,
    creatorId: number,
    file: FileUploadDto | undefined,
    userIds: number[],
  ): Promise<Chatroom> {
    const existingChatroom = await this.chatroomRepository.findByName(name);
    if (existingChatroom) {
      throw new BadRequestException('Chatroom already exists');
    }

    let imageFileName: string | null = null;

    if (file) {
      const fileName = `${Date.now()}-${file.originalname}`;
      await this.minioService.uploadImage(file, fileName);
      imageFileName = fileName;
    }

    const newChatroom = await this.chatroomRepository.create(
      name,
      creatorId,
      imageFileName,
    );

    await this.addUsersToChatroom(newChatroom.id, userIds);

    return newChatroom;
  }

  async addUsersToChatroom(chatroomId: number, userIds: number[]) {
    const existingChatroom = await this.chatroomRepository.findById(chatroomId);
    if (!existingChatroom) {
      throw new BadRequestException({ chatroomId: 'Chatroom does not exist' });
    }
    return this.chatroomRepository.addUsersToChatroom(chatroomId, userIds);
  }

  async getChatroomsForUser(userId: number) {
    return this.chatroomRepository.getChatroomsForUser(userId);
  }

  async getMessagesForChatroom(chatroomId: number) {
    return this.chatroomRepository.getMessagesForChatroom(chatroomId);
  }

  async sendMessage(
    chatroomId: number,
    message: string,
    userId: number,
  ): Promise<Message> {
    const chatroom = await this.chatroomRepository.findById(chatroomId);
    if (!chatroom) {
      throw new NotFoundException('Chatroom not found');
    }

    return this.chatroomRepository.createMessage(chatroomId, message, userId);
  }

  async updateChatroom(
    chatroomId: number,
    name: string,
    file: FileUploadDto | undefined,
    userIds: number[],
  ) {
    let imageFileName: string | null = null;
    const chatroom = await this.chatroomRepository.findById(chatroomId);
    if (!chatroom) {
      throw new NotFoundException('Chatroom not found');
    }

    if (file) {
      const fileName = `${Date.now()}-${file.originalname}`;
      await this.minioService.uploadImage(file, fileName);
      imageFileName = fileName;
    }

    await this.chatroomRepository.update(chatroomId, {
      name,
      imageUrl: imageFileName,
    });

    if (chatroom.imageUrl) {
      await this.minioService.deleteImage(chatroom.imageUrl);
    }

    await this.addUsersToChatroom(chatroomId, userIds);
  }

  async deleteChatroom(chatroomId: number) {
    const chatroom = await this.chatroomRepository.findById(chatroomId);
    if (!chatroom) {
      throw new NotFoundException('Chatroom not found');
    }

    await this.chatroomRepository.delete(chatroomId);

    if (chatroom.imageUrl) {
      await this.minioService.deleteImage(chatroom.imageUrl);
    }
  }
}
