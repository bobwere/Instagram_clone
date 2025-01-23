import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { SearchService } from '../services/search.service';
import { SearchQueryDto } from '../dtos/search-query.dto';
import { User } from '@/domain/user.entity';
import { Feed } from '@/domain/feed.entity';


@ApiTags('search')
@Controller('search')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  async search(
    @Query() searchQueryDto: SearchQueryDto,
  ): Promise<{ users?: User[]; photos?: Feed[] }> {
    const result = await this.searchService.search(searchQueryDto);
    return {
      users: searchQueryDto.name !== undefined ? result?.users : undefined,
      photos: searchQueryDto.hashtag !== undefined ? result?.photos : undefined
    };
  }
}
