import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async createPost(title: string, content: string, authorId: number): Promise<Post> {
    const post = this.postRepository.create({content, authorId });
    return this.postRepository.save(post);
  }

  async findAll(): Promise<Post[]> {
    return this.postRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: number): Promise<Post> {
    const post = await this.postRepository.findOne({ where: { id } });
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    return post;
  }

  async updatePost(id: number, title: string, content: string): Promise<Post> {
    const post = await this.findOne(id);
    
    post.content = content;
    return this.postRepository.save(post);
  }

  async deletePost(id: number): Promise<void> {
    const result = await this.postRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
  }
  async findPostsByAuthor(authorId: number): Promise<Post[]> {
    return this.postRepository.find({
      where: { authorId },
      order: {
        createdAt: 'DESC',
      },
    });
  }
  
}
