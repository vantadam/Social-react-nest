import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { Follow } from 'src/follow/follow.entity';
import { Like } from 'src/like/like.entity';
import { Comment } from 'src/comment/comment.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  @IsNotEmpty()
  password: string;

  @Column({ nullable: true })
image: string;

@OneToMany(() => Follow, follow => follow.follower)
  following: Follow[];

  @OneToMany(() => Follow, follow => follow.following)
  followers: Follow[];

  @OneToMany(() => Like, (like) => like.user)
likes: Like[];

@OneToMany(() => Comment, (comment) => comment.user)
comments: Comment[];

}
