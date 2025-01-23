import { ApiProperty } from '@nestjs/swagger';

export class ProfileFeedResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  url: string;

  @ApiProperty()
  caption: string;

  @ApiProperty()
  hashtags: string[];

  @ApiProperty()
  userId: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  likesCount: number;

  @ApiProperty()
  commentsCount: number;

  @ApiProperty()
  createdAt: Date;
}
