import { Controller, Post, Get, Patch, Delete, Param, Body, UseGuards, ParseIntPipe } from '@nestjs/common';
import { PostService } from './post.service';
import { Post as PostEntity } from './post.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FollowService } from 'src/follow/follow.service';

@UseGuards(JwtAuthGuard)
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService,
    private readonly followService: FollowService,
  ) {}

  @Post()
  createPost(@Body() body: { title: string, content: string, authorId: number }): Promise<PostEntity> {
    const { title, content, authorId } = body;
    return this.postService.createPost(title, content, authorId);
  }

  @Get()
  findAll(): Promise<PostEntity[]> {
    return this.postService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<PostEntity> {
    return this.postService.findOne(id);
  }

  @Patch(':id')
  updatePost(
    @Param('id') id: number,
    @Body() body: { title: string; content: string }
  ): Promise<PostEntity> {
    return this.postService.updatePost(id, body.title, body.content);
  }

  @Delete(':id')
  deletePost(@Param('id') id: number): Promise<void> {
    return this.postService.deletePost(id);
  }
  @Get('author/:authorId')
findPostsByAuthor(@Param('authorId') authorId: number): Promise<PostEntity[]> {
  return this.postService.findPostsByAuthor(authorId);
}
@Get('feed/:userId')
async getFollowedPosts(@Param('userId', ParseIntPipe) userId: number) {
  const followingIds = await this.followService.getFollowingIds(userId);
  if (followingIds.length === 0) return []; 
  return this.postService.getPostsByAuthors(followingIds);
}

}
