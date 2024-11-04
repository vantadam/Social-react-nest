import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Follow } from './follow.entity';
import { FollowService } from './follow.service';
import { FollowController } from './follow.controller';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([Follow, User])],
  providers: [FollowService, UserService],
  controllers: [FollowController],
  exports: [FollowService],
})
export class FollowModule {}
