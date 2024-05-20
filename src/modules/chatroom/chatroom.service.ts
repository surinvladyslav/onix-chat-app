import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Chatroom, Message } from '@prisma/client';
import { ChatroomRepository } from '@modules/chatroom/chatroom.repository';
import { MinioService } from '@providers/minio/minio.service';
import UsersService from '@modules/users/users.service';
import {
  CreateChatroomDto,
  UpdateChatroomDto,
} from '@modules/chatroom/dto/chatroom.dto';
import { MessageDto } from '@modules/chatroom/dto/message.dto';
import {
  CHATROOM_CONFLICT,
  CHATROOM_NOT_FOUND,
} from '@constants/errors.constants';

@Injectable()
export class ChatroomService {
  private readonly logger = new Logger(ChatroomService.name);

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
    try {
      const [messages, chatroom, users] = await Promise.all([
        this.getMessagesForChatroom(chatroomId),
        this.getChatroom(chatroomId),
        this.userService.getUsersOfChatroom(chatroomId),
      ]);

      let imageUrl: string | null = null;
      if (chatroom.imageUrl) {
        imageUrl = await this.minioService.getImageUrl(chatroom.imageUrl);
      }

      return { messages, chatroom, imageUrl, users, userId };
    } catch (error) {
      this.logger.error(`Error fetching chat page data: ${error}`);
      return {
        messages: [],
        chatroom: null,
        imageUrl: null,
        users: [],
        userId,
      };
    }
  }

  async create(
    chatroomDto: CreateChatroomDto,
    file: Express.Multer.File,
  ): Promise<Chatroom> {
    const { name, creatorId, participants } = chatroomDto;

    const existingChatroom = await this.chatroomRepository.findByName(name);
    if (existingChatroom) {
      throw new ConflictException(CHATROOM_CONFLICT);
    }

    let imageUrl: string | null = null;
    if (file) {
      imageUrl = await this.minioService.uploadImage(file);
    }

    return this.chatroomRepository.create(
      name,
      Number(creatorId),
      imageUrl,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      JSON.parse(participants),
    );
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

  async saveMessage(messageDto: MessageDto, userId: number): Promise<Message> {
    const { chatroomId, content } = messageDto;

    const chatroom = await this.chatroomRepository.findById(chatroomId);
    if (!chatroom) {
      throw new NotFoundException('Chatroom not found');
    }

    return this.chatroomRepository.createMessage(chatroomId, content, userId);
  }

  async update(
    chatroomDto: UpdateChatroomDto,
    file: Express.Multer.File,
    chatroomId: number,
  ) {
    const { name, creatorId, participants } = chatroomDto;

    const chatroom = await this.chatroomRepository.findById(chatroomId);
    if (!chatroom) {
      throw new NotFoundException('Chatroom not found');
    }

    let imageUrl: string | null = null;
    if (file) {
      imageUrl = await this.minioService.uploadImage(file);
    }

    if (chatroom.imageUrl) {
      await this.minioService.deleteImage(chatroom.imageUrl);
    }

    await this.chatroomRepository.update(
      chatroomId,
      name,
      Number(creatorId),
      imageUrl,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      JSON.parse(participants),
    );
  }

  async delete(chatroomId: number) {
    const chatroom = await this.chatroomRepository.findById(chatroomId);

    if (!chatroom) {
      throw new NotFoundException(CHATROOM_NOT_FOUND);
    }

    await this.chatroomRepository.delete(chatroomId);

    if (chatroom.imageUrl) {
      await this.minioService.deleteImage(chatroom.imageUrl);
    }
  }
}
