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
import { Notification } from '@/domain/notification.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([Like, Comment, Feed, User, Notification])],
  providers: [LikeService, CommentService],
  controllers: [LikeController, CommentController],
  exports: [LikeService, CommentService],
})
export class InteractionModule {}
