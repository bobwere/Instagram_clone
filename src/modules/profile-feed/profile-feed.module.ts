import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileFeedService } from './services/profile-feed.service';
import { ProfileFeedController } from './controllers/profile-feed.controller';
import { UploadService } from './services/upload.service';
import { Feed } from '@/domain/feed.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Feed])],
  providers: [ProfileFeedService, UploadService],
  controllers: [ProfileFeedController],
  exports: [ProfileFeedService],
})
export class ProfileFeedModule {}
