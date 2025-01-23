import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLikeDto } from '../dtos/create-like.dto';
import { LikeResponseDto } from '../dtos/like-response.dto';
import { Like } from '@/domain/like.entity';
import { Feed } from '@/domain/feed.entity';
import { Notification } from '@/domain/notification.entity';
import { NotificationService } from '@/modules/notification/services/notification.service';
import { NotificationType } from '@/core/shared/enums/notification-type';
import { UsersService } from '@/modules/users/users.service';
import { User } from '@/domain/user.entity';


@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,
    @InjectRepository(Feed)
    private readonly feedRepository: Repository<Feed>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly notificationService: NotificationService,
  ) {}

  async create(userId: string, createLikeDto: CreateLikeDto): Promise<Like> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const photo = await this.feedRepository.findOne({
      where: { id: createLikeDto.photoId },
    });

  
    if (!photo) {
      throw new NotFoundException('Photo not found');
    }

    const existingLike = await this.likeRepository.findOne({
      where: {
        user_id: userId,
        feed_id: createLikeDto.photoId,
      },
    });

    if (existingLike) {
      throw new ConflictException('User has already liked this photo');
    }

    const like = this.likeRepository.create({
      user_id: userId,
      feed_id: photo.id,
    });


    const savedLike = await this.likeRepository.save(like);

    await this.notificationService.createNotification(
    photo.user_id,
    `${user.name} has liked your photo`,
    NotificationType.LIKE,
    );

    return savedLike;
  }

  async remove(userId: string, photoId: string): Promise<void> {
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

    const like = await this.likeRepository.findOne({
      where: {
        user_id: userId,
        feed_id: photoId,
      },
    });

    if (!like) {
      throw new NotFoundException('Like not found');
    }

   await this.likeRepository.remove(like);

    await this.notificationService.createNotification(
      photo.user_id,
      `${user.name} has unliked your photo`,
      NotificationType.LIKE,
      );
  }

  async findByPhotoId(photoId: string): Promise<LikeResponseDto[]> {
    const likes = await this.likeRepository.find({
      where: {feed_id: photoId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });

    return likes.map((like) => ({
      id: like.id,
      userId: like.user_id,
      feedId: like.feed_id,
      createdAt: like.createdAt,
    }));
  }

  async getLikesCount(photoId: string): Promise<number> {
    return this.likeRepository.count({
      where: { feed_id: photoId },
    });
  }
}
