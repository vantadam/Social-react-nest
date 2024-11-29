import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn ,JoinColumn} from 'typeorm';
import { User } from '../user/user.entity';
import { Post } from '../post/post.entity';

@Entity()
export class Like {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.likes)
  @JoinColumn({ name: 'userId' })
  user: User;
  
  @ManyToOne(() => Post, post => post.likes)
  @JoinColumn({ name: 'postId' })
  post: Post;
  

  @CreateDateColumn()
  createdAt: Date;
}
