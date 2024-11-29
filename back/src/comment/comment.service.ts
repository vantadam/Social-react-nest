import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async addComment(postId: number, userId: number, text: string): Promise<Comment> {
    const newComment = this.commentRepository.create({
      post: { id: postId },
      user: { id: userId },
      text,
    });
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
