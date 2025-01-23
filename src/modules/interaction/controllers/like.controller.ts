import {
  Controller,
  Post,
  Delete,
  Param,
  UseGuards,
  Request,
  Get,
  Body,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { LikeService } from '../services/like.service';
import { CreateLikeDto } from '../dtos/create-like.dto';
import { LikeResponseDto } from '../dtos/like-response.dto';

@ApiTags('likes')
@Controller('likes')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post()
  @ApiOperation({ summary: 'Like a photo' })
  @ApiResponse({
    status: 201,
    description: 'Photo liked successfully',
    type: LikeResponseDto,
  })
  async create(
    @Request() req: { user: { id: string } },
    @Body() createLikeDto: CreateLikeDto,
  ) {
    return this.likeService.create(req.user.id, createLikeDto);
  }

  @Delete(':photoId')
  async remove(
    @Request() req: { user: { id: string } },
    @Param('photoId') photoId: string,
  ) {
    return this.likeService.remove(req.user.id, photoId);
  }

  @Get('photo/:photoId')
  async findByPhotoId(@Param('photoId') photoId: string) {
    return this.likeService.findByPhotoId(photoId);
  }

  @Get('photo/:photoId/count')
  async getLikesCount(@Param('photoId') photoId: string) {
    return { count: await this.likeService.getLikesCount(photoId) };
  }
}
