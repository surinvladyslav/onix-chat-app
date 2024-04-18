export class CreateChatroomDto {
  name: string;
  creatorId: number;
  participants: number[];
}

export class UpdateChatroomDto {
  name?: string;
  creatorId?: number;
  participants?: number[];
}
