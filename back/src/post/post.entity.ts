import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Like } from 'src/like/like.entity';
import { Comment } from 'src/comment/comment.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column()
  authorId: number;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Like, (like) => like.post)
likes: Like[];

@OneToMany(() => Comment, (comment) => comment.post)
comments: Comment[];

}
