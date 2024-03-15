import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsString,
} from 'class-validator';

export default class SignInDto {
  @ApiProperty({ description: 'User email', type: String })
  @IsNotEmpty({ message: 'Email is required.' })
  @IsString()
  @IsEmail({}, { message: 'Email must be valid.' })
  readonly email: string = '';

  @ApiProperty({ description: 'User password', type: String })
  @IsNotEmpty({ message: 'Password is required.' })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters.' })
  @MaxLength(64, { message: 'Password must be at most 64 characters.' })
  readonly password: string = '';
}
