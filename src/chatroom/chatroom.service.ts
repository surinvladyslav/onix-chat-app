import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Chatroom } from '@prisma/client';

@Injectable()
export class ChatroomService {
  constructor(private readonly prisma: PrismaService) {}

  async getChatroom(id: number) {
    return this.prisma.chatroom.findUnique({
      where: {
        id: id,
      },
      include: {
        users: true,
      },
    });
  }

  async createChatroom(
    name: string,
    sub: number,
    imageUrl: string,
  ): Promise<Chatroom> {
    const existingChatroom = await this.prisma.chatroom.findFirst({
      where: {
        name,
      },
    });
    if (existingChatroom) {
      throw new BadRequestException({ name: 'Chatroom already exists' });
    }

    return this.prisma.chatroom.create({
      data: {
        name,
        creatorId: sub,
        imageUrl,
        users: {
          connect: {
            id: sub,
          },
        },
      },
    });
  }

  async addUsersToChatroom(chatroomId: number, userIds: number[]) {
    const existingChatroom = await this.prisma.chatroom.findUnique({
      where: {
        id: chatroomId,
      },
    });
    if (!existingChatroom) {
      throw new BadRequestException({ chatroomId: 'Chatroom does not exist' });
    }

    return this.prisma.chatroom.update({
      where: {
        id: chatroomId,
      },
      data: {
        users: {
          connect: userIds.map((id) => ({ id: id })),
        },
      },
      include: {
        users: true,
      },
    });
  }

  async getChatroomsForUser(userId: number) {
    return this.prisma.chatroom.findMany({
      where: {
        users: {
          some: {
            id: userId,
          },
        },
      },
      include: {
        users: {
          orderBy: {
            createdAt: 'desc',
          },
        },
        messages: {
          take: 1,
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });
  }

  async updateChatroom(chatroomId: number, name: string, imageUrl: string) {
    // if (avatarUrl) {
    //   const oldUser = await this.prisma.user.findUnique({
    //     where: { id: userId },
    //   });
    //   const updatedUser = await this.prisma.user.update({
    //     where: { id: userId },
    //     data: {
    //       fullname,
    //       avatarUrl,
    //     },
    //   });
    //
    //   if (oldUser.avatarUrl) {
    //     const imageName = oldUser.avatarUrl.split('/').pop();
    //     const imagePath = join(
    //       __dirname,
    //       '..',
    //       '..',
    //       'public',
    //       'images',
    //       imageName,
    //     );
    //     if (fs.existsSync(imagePath)) {
    //       fs.unlinkSync(imagePath);
    //     }
    //   }
    //
    //   return updatedUser;
    // }
    return this.prisma.chatroom.update({
      where: { id: chatroomId },
      data: {
        name,
        imageUrl,
      },
    });
  }

  async sendMessage(chatroomId: number, message: string, userId: number) {
    return this.prisma.message.create({
      data: {
        content: message,
        chatroomId,
        userId,
      },
      include: {
        chatroom: {
          include: {
            users: true,
          },
        },
        user: true,
      },
    });
  }

  async getMessagesForChatroom(chatroomId: number) {
    return this.prisma.message.findMany({
      where: {
        chatroomId: chatroomId,
      },
      include: {
        chatroom: {
          include: {
            users: {
              orderBy: {
                createdAt: 'asc',
              },
            },
          },
        },
        user: true,
      },
    });
  }

  async deleteChatroom(chatroomId: number) {
    return this.prisma.chatroom.delete({
      where: {
        id: chatroomId,
      },
    });
  }
}
