import { Injectable } from '@nestjs/common';
import { PrismaService } from '@providers/prisma';
import { Chatroom, Message } from '@prisma/client';

@Injectable()
export class ChatroomRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: number): Promise<Chatroom | null> {
    return this.prisma.chatroom.findUnique({
      where: { id },
      include: { users: true },
    });
  }

  async findByName(name: string): Promise<Chatroom | null> {
    return this.prisma.chatroom.findFirst({
      where: { name },
    });
  }

  async createMessage(
    chatroomId: number,
    content: string,
    userId: number,
  ): Promise<Message> {
    return this.prisma.message.create({
      data: {
        content,
        chatroom: { connect: { id: chatroomId } },
        user: { connect: { id: userId } },
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

  create(
    name: string,
    creatorId: number,
    imageUrl: string,
    users: number[],
  ): Promise<Chatroom> {
    return this.prisma.chatroom.create({
      data: {
        name,
        creatorId,
        imageUrl,
        users: {
          connect: [{ id: creatorId }, ...users.map((id: number) => ({ id }))],
        },
      },
    });
  }

  async addUsersToChatroom(chatroomId: number, userIds: number[]) {
    return this.prisma.chatroom.update({
      where: { id: chatroomId },
      data: { users: { connect: userIds.map((id) => ({ id })) } },
      include: { users: true },
    });
  }

  async getChatroomsForUser(userId: number) {
    return this.prisma.chatroom.findMany({
      where: { users: { some: { id: userId } } },
      include: {
        users: { orderBy: { createdAt: 'desc' } },
        messages: { take: 1, orderBy: { createdAt: 'desc' } },
      },
    });
  }

  async getMessagesForChatroom(chatroomId: number) {
    return this.prisma.message.findMany({
      where: { chatroomId },
      include: {
        chatroom: { include: { users: { orderBy: { createdAt: 'asc' } } } },
        user: true,
      },
    });
  }

  async update(
    id: number,
    name: string,
    creatorId: number,
    imageUrl: string,
    users: number[],
  ): Promise<Chatroom> {
    return this.prisma.chatroom.update({
      where: { id },
      data: {
        name,
        creatorId,
        imageUrl,
        users: {
          connect: [{ id: creatorId }, ...users.map((id: number) => ({ id }))],
        },
      },
    });
  }

  async delete(id: number): Promise<Chatroom> {
    return this.prisma.chatroom.delete({ where: { id } });
  }
}
