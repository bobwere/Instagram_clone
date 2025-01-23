import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommentDto } from '../dtos/create-comment.dto';
import { CommentResponseDto } from '../dtos/comment-response.dto';
import { Feed } from '@/domain/feed.entity';
import { Comment } from '@/domain/comment.entity';
import { NotificationService } from '@/modules/notification/services/notification.service';
import { User } from '@/domain/user.entity';
import { NotificationType } from '@/core/shared/enums/notification-type';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Feed)
    private readonly feedRepository: Repository<Feed>,
    private readonly notificationService: NotificationService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(
    userId: string,
    photoId: string,
    createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    const photo = await this.feedRepository.findOne({
      where: { id: photoId },
    });

    if (!photo) {
      throw new NotFoundException('Photo not found');
    }

    const savedComment = this.commentRepository.create({
      user_id: userId,
      feed_id: photoId,
      body: createCommentDto.body,
    });

     this.commentRepository.save(savedComment);
  

    await this.notificationService.createNotification(
    photo.user_id,
    `${user.name} has commented on your photo`,
    NotificationType.COMMENT,
    );

    return savedComment;
  }

  async findByPhotoId(photoId: string): Promise<CommentResponseDto[]> {
    const comments = await this.commentRepository.find({
      where: { 
        feed_id: photoId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });

    return comments.map((comment) => ({
      id: comment.id,
      userId: comment.user_id,
      feedId: comment.feed_id,
      body: comment.body,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      name: comment.user.name,
    }));
  }

  async getCommentsCount(photoId: string): Promise<number> {
    return this.commentRepository.count({
      where: { feed_id: photoId },
    });
  }
}
