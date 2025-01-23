import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedService } from './services/feed.service';
import { FeedController } from './controllers/feed.controller';
import { Feed } from '@/domain/feed.entity';
import { Follow } from '@/domain/follow.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Feed, Follow])],
  providers: [FeedService],
  controllers: [FeedController],
})
export class FeedModule {}
