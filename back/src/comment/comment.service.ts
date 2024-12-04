import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { NotificationService } from '../notification/notification.service';
import { Inject, forwardRef } from '@nestjs/common';
import { PostService } from 'src/post/post.service';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @Inject(forwardRef(() => NotificationService)) 
    private readonly notificationService: NotificationService,
    @Inject(forwardRef(() => PostService))
    private readonly postService: PostService,
  ) {}

  async addComment(postId: number, userId: number, text: string): Promise<Comment> {
    const newComment = this.commentRepository.create({
      post: { id: postId },
      user: { id: userId },
      text,
    });
    const recipient= await this.postService.findAuthorByPostId(postId);
    await this.notificationService.createNotification(
      'comment',
      userId,
      recipient,
      postId,


    );
    return this.commentRepository.save(newComment);
  }

  async getCommentsByPost(postId: number): Promise<Comment[]> {
    return this.commentRepository.find({
      where: { post: { id: postId } },
      relations: ['user'],
    });
  }

  async removeComment(commentId: number): Promise<void> {
    await this.commentRepository.delete(commentId);
  }
}
