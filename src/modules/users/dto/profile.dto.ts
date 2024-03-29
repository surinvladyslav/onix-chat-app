import UserEntity from '@modules/users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export default class ProfileDto {
  @ApiProperty({ type: UserEntity })
  readonly user: UserEntity | null = null;
}
