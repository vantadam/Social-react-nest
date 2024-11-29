import { Controller, Post, Delete, Param, Body,Get, Query } from '@nestjs/common';
import { LikeService } from './like.service';
import { UserService } from '../user/user.service';
import { PostService } from '../post/post.service';

@Controller('likes')
export class LikeController {
  constructor(
    private readonly likeService: LikeService,
    private readonly userService: UserService,
    private readonly postService: PostService,
  ) {}

  @Post(':postId')
  async likePost(
    @Param('postId') postId: number,
    @Body('userId') userId: string,
  ): Promise<void> {
    const user = await this.userService.findById(Number(userId)); 
    const post = await this.postService.findOne(postId);
    await this.likeService.likePost(user, post);
  }

  @Delete(':postId')
  async unlikePost(
    @Param('postId') postId: number,
    @Query('userId') userId: string, 
  ): Promise<void> {
    console.log('Deleting like for postId:', postId, 'and userId:', userId);
    const user = await this.userService.findById(Number(userId)); 
    const post = await this.postService.findOne(postId);
    await this.likeService.unlikePost(user, post);
  }
  
  

  @Get(':postId/:userId')
  async checkIfLiked(
    @Param('postId') postId: number,
    @Param('userId') userId: string,
  ): Promise<boolean> {
    const user = await this.userService.findById(Number(userId)); 
    const post = await this.postService.findOne(postId);
    const like = await this.likeService.findLike(user, post);
    console.log('like', like);
    console.log('!!like', !!like);
    return !!like; 
  }
  
  
}
