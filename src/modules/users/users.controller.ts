import { CurrentUser } from '@/core/decorators/current-user.decorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { User } from '../../domain/user.entity';
import { UsersService } from './users.service';
import {
  Paginate,
  PaginateQuery,
  Paginated,
} from 'nestjs-paginate';
import { USERS_PAGINATION_CONFIG } from './pagination/pagination.config';
import { UpdateUserDto } from './dto/update-user.dto';
import { Serialize } from '@/core/interceptor/serializer.interceptor';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Serialize(User)
  async getCurrentUser(@CurrentUser() currentUser: User): Promise<User> {
    return currentUser;
  }

  @Patch()
  @Serialize(User)
  async updateCurrentUser(
    @CurrentUser() currentUser: User,
    @Body() newUserData: UpdateUserDto
  ): Promise<User> {
    return this.usersService.updateUser(currentUser, newUserData);
  }

  @Get('all')
  async getAllUsers(
    @Paginate() query: PaginateQuery
  ): Promise<Paginated<User>> {
    return this.usersService.paginatedFindAll(query, USERS_PAGINATION_CONFIG);
  }

  @Get(':id')
  async getUser(
    @Param('id') id: string,
  ): Promise<User> {
    return this.usersService.getUser(id);
  }

  @Post('follow/:id')
  async followUser(
    @Request() req: { user: { id: string } },
    @Param('id') id: string,
  ): Promise<void> {
    await this.usersService.followUser(req.user.id, id);
  }

  @Delete('unfollow/:id')
  async unfollowUser(
    @Request() req: { user: { id: string } },
    @Param('id') id: string,
  ): Promise<void> {
    await this.usersService.unfollowUser(req.user.id, id);
  }
}
