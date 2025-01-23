import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { NotificationService } from '../services/notification.service';

@ApiTags('notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  async getUserNotifications(@Request() req: { user: { id: string } }) {
    return this.notificationService.getUserNotifications(req.user.id);
  }

  @Post(':id/read')
  async markAsRead(
    @Request() req: { user: { id: string } },
    @Param('id') notificationId: string,
  ) {
    await this.notificationService.markAsRead(req.user.id, notificationId);
    return { message: 'Notification marked as read' };
  }

  @Post('read-all')
  async markAllAsRead(@Request() req: { user: { id: string } }) {
    await this.notificationService.markAllAsRead(req.user.id);
    return { message: 'All notifications marked as read' };
  }
}
