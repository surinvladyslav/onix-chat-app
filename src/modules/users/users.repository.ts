import { Injectable } from '@nestjs/common';
import { PrismaService } from '@providers/prisma';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findOne(id: number): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: { id },
    });
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async updateProfile(userId: number, fullname: string): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { fullname },
    });
  }

  async getVerifiedByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: { email },
    });
  }

  async getUsersOfChatroom(chatroomId: number): Promise<User[]> {
    return this.prisma.user.findMany({
      where: {
        chatrooms: {
          some: {
            id: chatroomId,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }
}
