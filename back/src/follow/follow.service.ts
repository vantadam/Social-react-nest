import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Follow } from './follow.entity';
import { User } from '../user/user.entity';

@Injectable()
export class FollowService {
  constructor(
    @InjectRepository(Follow)
    private readonly followRepository: Repository<Follow>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async followUser(followerId: number, followingId: number): Promise<Follow> {
    

    const follower = await this.userRepository.findOne({ where: { id: followerId } });
    const following = await this.userRepository.findOne({ where: { id: followingId } });

    if (!follower || !following) {
      throw new NotFoundException('User not found');
    }

 
    const existingFollow = await this.followRepository.findOne({
      where: { follower: { id: followerId }, following: { id: followingId } },
    });

    if (existingFollow) {
      throw new ConflictException('You are already following this user');
    }

    const follow = this.followRepository.create({ follower, following });
    return this.followRepository.save(follow);
  }

  async unfollowUser(followerId: number, followingId: number): Promise<void> {
    const follow = await this.followRepository.findOne({
      where: { follower: { id: followerId }, following: { id: followingId } },
    });

    if (!follow) {
      throw new NotFoundException('Follow relationship not found');
    }

    await this.followRepository.remove(follow);
  }

  async getFollowers(userId: number): Promise<User[]> {
    const followers = await this.followRepository.find({
      where: { following: { id: userId } },
      relations: ['follower'],
    });
    return followers.map(follow => follow.follower);
  }

  async getFollowing(userId: number): Promise<User[]> {
    const following = await this.followRepository.find({
      where: { follower: { id: userId } },
      relations: ['following'],
    });
    return following.map(follow => follow.following);
  }

  async checkFollowing(followerId: number, followingId: number): Promise<boolean> {
    const follow = await this.followRepository.findOne({
      where: { follower: { id: followerId }, following: { id: followingId } },
    });
    return !!follow;
  }

  async getFollowingIds(userId: number): Promise<number[]> {
    const following = await this.followRepository.find({
      where: { follower: { id: userId } },
      relations: ['following'],
    });
    return following.map(follow => follow.following.id);
  }
  
}
