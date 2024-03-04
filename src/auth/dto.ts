import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength, IsString } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ description: 'User fullname' })
  @IsNotEmpty({ message: 'Fullname is required.' })
  @IsString({ message: 'Fullname must be a string.' })
  fullname: string;

  @ApiProperty({ description: 'User password' })
  @IsNotEmpty({ message: 'Password is required.' })
  @MinLength(8, { message: 'Password must be at least 8 characters.' })
  password: string;

  @ApiProperty({ description: 'Confirm password' })
  @IsNotEmpty({ message: 'Confirm Password is required.' })
  confirmPassword: string;

  @ApiProperty({ description: 'User email' })
  @IsNotEmpty({ message: 'Email is required.' })
  @IsEmail({}, { message: 'Email must be valid.' })
  email: string;
}

export class LoginDto {
  @ApiProperty({ description: 'User email' })
  @IsNotEmpty({ message: 'Email is required.' })
  @IsEmail({}, { message: 'Email must be valid.' })
  email: string;

  @ApiProperty({ description: 'User password' })
  @IsNotEmpty({ message: 'Password is required.' })
  password: string;
}
