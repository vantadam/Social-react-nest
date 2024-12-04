import { Controller, Get, Patch, Param, ParseIntPipe } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get(':userId')
  async getNotifications(@Param('userId', ParseIntPipe) userId: number) {
    return this.notificationService.getNotificationsForUser(userId);
  }

  @Patch('mark-as-read/:id')
  async markAsRead(@Param('id', ParseIntPipe) id: number) {
    await this.notificationService.markAsRead(id);
    return { message: 'Notification marked as read' };
  }
}
