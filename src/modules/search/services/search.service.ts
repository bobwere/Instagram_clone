import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In, ILike, JsonContains, ArrayContains } from 'typeorm';
import { SearchQueryDto } from '../dtos/search-query.dto';
import { User } from '@/domain/user.entity';
import { Feed } from '@/domain/feed.entity';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Feed)
    private readonly feedRepository: Repository<Feed>,
  ) {}

  private escapeSpecialChars(query: string): string {
    return query.replace(/[%_]/g, '\\\\$&');
  }

  async searchUsers(query: string): Promise<User[]> {
    if (!query) return [];
    const escapedQuery = this.escapeSpecialChars(query);
    return this.userRepository.find({
      where: {
        name: Like(`%${escapedQuery}%`),
      },
      select: ['id', 'name', 'createdAt'],
    });
  }

  async searchPhotos(query: string): Promise<Feed[]> {
    console.log('query',query);
    if (!query) return [];
    const escapedQuery =   this.escapeSpecialChars( query );
    console.log('escapedQuery',escapedQuery);
    return this.feedRepository.find({
      where: [
       { description: Like(`%${escapedQuery}%`) },
       { hashtags: ArrayContains([`${escapedQuery}`]) },
      ],
      relations: ['user'],
      order: { created_at: 'DESC' },
    });
  }

  async search(searchQueryDto: SearchQueryDto): Promise<{
    users: User[];
    photos: Feed[];
  }> {
    const { name, hashtag } = searchQueryDto;

    // Handle empty/null/undefined parameters
    if (!name && !hashtag) {
      return { users: [], photos: [] };
    }

    const [users, photos]: [User[], Feed[]] = await Promise.all([
      name ? this.searchUsers(name) : Promise.resolve<User[]>([]),
      hashtag ? this.searchPhotos(hashtag) : Promise.resolve<Feed[]>([]),
    ]);

    return { users, photos };
  }
}
