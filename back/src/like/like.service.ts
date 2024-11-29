import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from './like.entity';
import { User } from '../user/user.entity';
import { Post } from '../post/post.entity';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,
  ) {}


  async likePost(user: User, post: Post): Promise<Like> {
    const existingLike = await this.likeRepository.findOne({ where: { user, post } });
    if (existingLike) {
      throw new Error('Post already liked by user');
    }
    const like = this.likeRepository.create({ user, post });
    await this.likeRepository.save(like);

    return like;
  }

 
  async unlikePost(user: User, post: Post): Promise<void> {
    console.log('Unliking post:', post.id, 'by user:', user.id);
    const existingLike = await this.likeRepository.findOne({
      select: ['id'],  
      where: {
        user: { id: user.id },  
        post: { id: post.id },  
      },
    });
  
    if (!existingLike) {
      console.log(`Like not found for post: ${post.id} and user: ${user.id}`);
      throw new Error('Like not found');
    }
  
    console.log(`Like found, deleting like with id: ${existingLike.id}`);
    await this.likeRepository.delete(existingLike.id);
  } 
  
  


  async countLikes(post: Post): Promise<number> {
    return this.likeRepository.count({ where: { post } });
  }




  async findLike(user: User, post: Post): Promise<Boolean> {
    
    const like = await this.likeRepository.findOne({
      select: ['id'],  
      where: {
        user: { id: user.id },  
        post: { id: post.id },  
      },
    });
    
    if (like) {
      console.log('Like exists with user id:', user.id, 'and post id:', post.id);
    } else {
      console.log('Like does not exist with user id:', user.id, 'and post id:', post.id);
    }
    

    
    
    return !!like;
  }
  
  
}

