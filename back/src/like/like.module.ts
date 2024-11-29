import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from './like.entity';
import { LikeService } from './like.service';
import { LikeController } from './like.controller';
import { UserModule } from '../user/user.module';
import { PostModule } from '../post/post.module';

@Module({
  imports: [TypeOrmModule.forFeature([Like]), UserModule, PostModule],
  providers: [LikeService],
  controllers: [LikeController],
})
export class LikeModule {}
