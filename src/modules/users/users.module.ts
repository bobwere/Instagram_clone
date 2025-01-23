import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../domain/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Follow } from '@/domain/follow.entity';
import { Feed } from '@/domain/feed.entity';
import { Notification } from '@/domain/notification.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User,Follow,Feed,Notification]),
    ConfigModule,
  ],
  controllers: [UsersController],
  providers: [
    // services
    UsersService,
  ],
  exports: [UsersService],
})
export class UsersModule {}
