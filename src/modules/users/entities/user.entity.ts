import { ApiProperty } from '@nestjs/swagger';

export default class UserEntity extends Document {
  @ApiProperty({ type: String })
  readonly id: number;

  @ApiProperty({ type: String })
  readonly email: string = '';

  @ApiProperty({ type: String })
  readonly password: string = '';
}
