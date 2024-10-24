import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from '@/entities/user.entity';

import { CreateUserParams } from './types/create-user.type';
import { FindUserParams } from './types/find-user-params.type';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async findAllUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findUser(params: FindUserParams): Promise<User> {
    return await this.userRepository.findOne({
      where: [{ id: params.id }, { email: params.email }],
    });
  }

  async saveRefreshToken(token: string, userId: string) {
    return await this.userRepository.update(userId, { refreshToken: token });
  }

  async createUser(params: CreateUserParams): Promise<User> {
    return await this.userRepository.save(params);
  }

  async deleteRefreshToken(userId: string) {
    return await this.userRepository.update(userId, { refreshToken: null });
  }
}
