import { Controller, Post, Get, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  async addComment(
    @Body() body: { postId: number; userId: number; text: string },
  ) {
    return this.commentService.addComment(body.postId, body.userId, body.text);
  }

  @Get(':postId')
  async getCommentsByPost(@Param('postId') postId: number) {
    return this.commentService.getCommentsByPost(postId);
  }

  @Delete(':id')
  async removeComment(@Param('id') id: number) {
    await this.commentService.removeComment(id);
  }
}
