import { User } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

export default class UserEntity implements User {
  @Expose()
  readonly id!: number;

  @Expose()
  readonly fullname!: string;

  @Expose()
  readonly email!: string;

  @Exclude()
  readonly password!: string | null;

  @Expose()
  readonly createdAt!: Date;

  @Expose()
  readonly updatedAt!: Date;
}
