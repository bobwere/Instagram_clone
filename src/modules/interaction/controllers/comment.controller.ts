import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CommentService } from '../services/comment.service';
import { CreateCommentDto } from '../dtos/create-comment.dto';

@Controller('comments')
@UseGuards(JwtAuthGuard)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('photo/:photoId')
  async create(
    @Request() req: { user: { id: string } },
    @Param('photoId') photoId: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentService.create(req.user.id, photoId, createCommentDto);
  }

  @Get('photo/:photoId')
  async findByPhotoId(@Param('photoId') photoId: string) {
    return this.commentService.findByPhotoId(photoId);
  }

  @Get('photo/:photoId/count')
  async getCommentsCount(@Param('photoId') photoId: string) {
    return { count: await this.commentService.getCommentsCount(photoId) };
  }
}
