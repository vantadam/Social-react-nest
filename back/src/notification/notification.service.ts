import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './notification.entity';
import { User } from '../user/user.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  async createNotification(
    type: string,
    userId: number,
    recipientId: number,
    postId?: number,
  ): Promise<Notification> {
    const notification = this.notificationRepository.create({
      type,
      user: { id: userId },
      recipient: { id: recipientId },
      postId,
    });
    return this.notificationRepository.save(notification);
  }

  async getNotificationsForUser(recipientId: number): Promise<Notification[]> {
    return this.notificationRepository.find({
      where: { recipient: { id: recipientId } },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async markAsRead(notificationId: number): Promise<void> {
    await this.notificationRepository.update(notificationId, { isRead: true });
  }
}
