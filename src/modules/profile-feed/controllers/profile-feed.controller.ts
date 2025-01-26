import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Body,
  Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ProfileFeedService } from '../services/profile-feed.service';
import { CreateProfileFeedDto } from '../dtos/create-profile-feed.dto';
import { User } from '@/domain/user.entity';


@Controller('profile-feed')
@UseGuards(JwtAuthGuard)
export class ProfileFeedController {
  constructor(private readonly profileFeedService: ProfileFeedService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadPhoto(
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.profileFeedService.uploadPhoto(file);
  }


  @Post()
  async createProfileFeed(
    @Request() req: { user: { id: string; email: string } },
    @Body() createProfileFeedDto: CreateProfileFeedDto,
  ) {
    const user = {
      id: req.user.id,
      email: req.user.email,
    } as User;
    return this.profileFeedService.create(user, createProfileFeedDto);
  }

  @Get()
  async findAll(@Request() req: { user: { id: string } }) {
    return this.profileFeedService.findAllByUser(req.user.id);
  }

  @Delete(':id')
  async remove(
    @Request() req: { user: { id: string } },
    @Param('id') id: string,
  ) {
    return this.profileFeedService.remove(req.user.id, id);
  }
}