var bcrypt = require('bcryptjs');

import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Equal, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '../../domain/user.entity';
import { formatEmail } from '@/core/utils/formatting-data';
import BaseServiceMethods from '@/core/shared/classes/base-service-methods';
import { UpdateUserDto } from './dto/update-user.dto';
import { Follow } from '@/domain/follow.entity';
import { Feed } from '@/domain/feed.entity';
import { NotificationService } from '../notification/services/notification.service';
import { NotificationType } from '@/core/shared/enums/notification-type';
import { Notification } from '@/domain/notification.entity';


@Injectable()
export class UsersService extends BaseServiceMethods<User> {

  constructor(
    @InjectRepository(Follow)
    private readonly followRepository: Repository<Follow>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Feed)
    private readonly feedRepository: Repository<Feed>,
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,  
  ) {
    super(userRepository);
  }

  async createUser(createDto: CreateUserDto): Promise<User> {
    const { email } = createDto;

    const formattedEmail = formatEmail(email);

    const existingUser = await this.findByEmail(formattedEmail);

    if (existingUser) {
      throw new ConflictException('Please use a different email address.');
    }

    const saltOrRounds = 10;

    const hash = await bcrypt.hashSync(createDto.password, saltOrRounds);

    const newUserData: DeepPartial<User> = {
      ...createDto,
      email: formattedEmail,
      password: hash,
    };

    // Create user
    const newUser = this.userRepository.create(newUserData);

    await this.userRepository.save(newUser);

    return newUser;
  }

  async unfollowUser(followerId: string, id: string) {
    const userToUnfollow = await this.userRepository.findOne({
      where: { id },
    });

    if (!userToUnfollow) {
      throw new NotFoundException('User not found');
    }

    const follow = await this.followRepository.findOne({
      where: {
        follower_id: followerId,
        following_id: userToUnfollow.id,
      },
    });

    if (!follow) {
      throw new NotFoundException('Not following this user');
    }

    await this.followRepository.remove(follow);
  }


  async followUser(followerId: string, id: string) {
    const follower = await this.userRepository.findOne({
      where: { id: followerId },
    });


    const userToFollow = await this.userRepository.findOne({
      where: { id },
    });

    if (!userToFollow) {
      throw new NotFoundException('User not found');
    }

    if (followerId === userToFollow.id) {
      throw new ConflictException('Users cannot follow themselves');
    }

    const existingFollow = await this.followRepository.findOne({
      where: {
        follower_id: followerId,
        following_id: userToFollow.id,
      },
    });

    if (existingFollow) {
      throw new ConflictException('Already following this user');
    }

  
    const follow = this.followRepository.create({
      follower_id: followerId,
      following_id: userToFollow.id,
    });

    await this.followRepository.save(follow);

    const notification = this.notificationRepository.create({
      user_id: userToFollow.id,
      type: NotificationType.FOLLOW,
      content: `${follower.name} has started following you`,
      read: false,
    });

    await this.notificationRepository.save(notification);
  
    return;
  }
  

  async findByEmail(email: string): Promise<User> {
    const formattedEmail = formatEmail(email);

    if (!formattedEmail) return null;

    return this.userRepository.findOne({
      where: {
        email: Equal(formattedEmail),
      },
    });
  }

  async updateUser(user: User, updateData: UpdateUserDto): Promise<User> {
    const updatedUser = this.userRepository.merge(user, updateData);

    await this.userRepository.save(updatedUser);

    return updatedUser;
  }

  async getUser(id: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const [followersCount, followingCount, photosCount] = await Promise.all([
      this.followRepository.count({ where: { following_id: user.id } }),
      this.followRepository.count({ where: { follower_id: user.id } }),
      this.feedRepository.count({ where: { user_id: user.id } }),
    ]);

    return {
      id: user.id,
      followersCount,
      followingCount,
      photosCount,
      createdAt: user.createdAt,
    };
  }
}
