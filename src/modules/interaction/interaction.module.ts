import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikeService } from './services/like.service';
import { CommentService } from './services/comment.service';
import { LikeController } from './controllers/like.controller';
import { CommentController } from './controllers/comment.controller';
import { Like } from '@/domain/like.entity';
import { Feed } from '@/domain/feed.entity';
import { Comment } from '@/domain/comment.entity';
import { User } from '@/domain/user.entity';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    NotificationModule,
    TypeOrmModule.forFeature([Like, Comment, Feed, User])],
  providers: [LikeService, CommentService],
  controllers: [LikeController, CommentController],
  exports: [LikeService, CommentService],
})
export class InteractionModule {}
