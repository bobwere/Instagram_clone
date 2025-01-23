import { User } from '@/domain/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class SignInResponseDto {
  @ApiProperty({
    description: 'The JWT access token. Lasts for a day',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  @Expose()
  accessToken: string;

  @ApiProperty({
    description: 'The JWT refresh token. Lasts for 7 days',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  @Expose()
  refreshToken: string;

  @ApiProperty({
    description: 'The user object',
  })
  @ApiProperty({ type: User })
  @Expose()
  @Type(() => User)
  user: User;
}
