import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string; 

  @Column({ nullable: true })
  postId?: number; 

  @ManyToOne(() => User, { nullable: true })
  user: User; 

  @ManyToOne(() => User, { nullable: false })
  recipient: User; 

  @Column({ default: false })
  isRead: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
