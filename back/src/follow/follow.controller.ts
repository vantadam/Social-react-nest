import { Controller, Post, Delete, Param, Get, ParseIntPipe } from '@nestjs/common';
import { FollowService } from './follow.service';
import { User } from '../user/user.entity';

@Controller('follow')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Post(':followerId/:followingId')
  async followUser(
    @Param('followerId', ParseIntPipe) followerId: number,
    @Param('followingId', ParseIntPipe) followingId: number,
  ) {
    return this.followService.followUser(followerId, followingId);
  }

  @Delete(':followerId/:followingId')
  async unfollowUser(
    @Param('followerId', ParseIntPipe) followerId: number,
    @Param('followingId', ParseIntPipe) followingId: number,
  ) {
    return this.followService.unfollowUser(followerId, followingId);
  }

  @Get('followers/:userId')
  async getFollowers(@Param('userId', ParseIntPipe) userId: number): Promise<User[]> {
    return this.followService.getFollowers(userId);
  }

  @Get('following/:userId')
  async getFollowing(@Param('userId', ParseIntPipe) userId: number): Promise<User[]> {
    return this.followService.getFollowing(userId);
  }
  @Get('check/:followerId/:followingId')
  async checkFollowing(
    @Param('followerId', ParseIntPipe) followerId: number,
    @Param('followingId',ParseIntPipe) followingId: number,
  ){
  return this.followService.checkFollowing(followerId, followingId);
  }
}
