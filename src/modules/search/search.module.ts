import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchService } from './services/search.service';
import { SearchController } from './controllers/search.controller';
import { Feed } from '@/domain/feed.entity';
import { User } from '@/domain/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Feed])],
  providers: [SearchService],
  controllers: [SearchController],
})
export class SearchModule {}
