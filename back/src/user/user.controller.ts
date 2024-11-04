import { 
    Controller, 
    Get, 
    Param, 
    Put, 
    Body, 
    UseGuards, 
    UploadedFile, 
    UseInterceptors, 
    Post, 
    HttpException, 
    HttpStatus 
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { diskStorage } from 'multer';
  import { UserService } from './user.service';
  import { User } from './user.entity';
  import { JwtAuthGuard } from '../auth/jwt-auth.guard';
  import * as path from 'path';
  
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
  
    @Post(':id/upload-profile-pic')
    @UseInterceptors(FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/profilepics',
        filename: (req, file, cb) => {
          const fileExt = path.extname(file.originalname);
          const fileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${fileExt}`;
          cb(null, fileName);
        }
      })
    }))
    async uploadProfilePic(
      @Param('id') id: number,
      @UploadedFile() file: Express.Multer.File
    ): Promise<{ filename: string }> {
      if (!file) {
        throw new HttpException('File not provided', HttpStatus.BAD_REQUEST);
      }
  
      const filename = file.filename;
  
      
      const updatedUser = await this.userService.updateUser(id, { image: filename });
      
      if (!updatedUser) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
  
      return { filename };
    }

    @Get('username/:username')
  async getUserByUsername(@Param('username') username: string) {
    return this.userService.findByUsername(username);
  }
  }
  