import { Controller, Get } from '@nestjs/common';
import { Body, Param, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Put(':id')
    async updateUser(
        @Param('id') id: number,
        @Body() updateData: Partial<{ email: string; password: string; username: string; image: string }>
    ): Promise<User> {
        return this.userService.updateUser(id, updateData);
    }
    @Get(':id')
    async findById(@Param('id') id: string): Promise<User> {
      return this.userService.findById(Number(id));
    }
    
}