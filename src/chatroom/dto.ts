import { IsNotEmpty, IsString, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChatroomDto {
  @ApiProperty({ example: 'Chatroom Name' })
  @IsString()
  @IsNotEmpty({ message: 'Name is required.' })
  name: string;

  @ApiProperty({ type: [String], example: ['user1', 'user2'] })
  @IsArray({ message: 'UserIds must be an array of strings.' })
  userIds: string[];
}

export class MessageDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Content is required.' })
  readonly content: string;
}
