import {
  Controller,
  Get,
  Query,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { FeedService } from '../services/feed.service';
import { FeedQueryDto } from '../dtos/feed-query.dto';

@Controller('feed')
@UseGuards(JwtAuthGuard)
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Get()
  async getFeed(
    @Request() req: { user: { id: string } },
    @Query() query: FeedQueryDto,
  ) {
    if (!req?.user?.id) {
      throw new BadRequestException('Invalid user data');
    }
    return this.feedService.getFeed(req.user.id, query);
  }
}
