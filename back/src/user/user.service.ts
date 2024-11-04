import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(email: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({ email, password: hashedPassword });
    return this.userRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }
  async findByUsername(username: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (user) {
      delete user.password;
    }
    return user;
  }

  async validateUser(email: string, pass: string): Promise<User | null> {
    const user = await this.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      return user;
    }
    return null;
  }

  async updateUser(id: number, updateData: Partial<{ email: string; password: string; username: string; image: string }>): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error('User not found');
    }
    if (updateData.email) {
      user.email = updateData.email;
    }
    if (updateData.password) {
      user.password = await bcrypt.hash(updateData.password, 10);
    }
    if (updateData.username) {
      user.username = updateData.username;
    }
    if (updateData.image) {
      user.image = updateData.image;
    }
    return this.userRepository.save(user);
}


  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (user) {
      delete user.password;
    }

    return user;
  }
  
  

  
}
