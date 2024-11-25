import { Repository } from 'typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@/entities/user.entity';
import { CreateUserParams } from './types/create-user.type';
import { FindUserParams } from './types/find-user-params.type';
import { FileService } from '../file/file.service';
import { FileType } from '@/shared/constants/file-type';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly fileService: FileService,
  ) {}

  async findAllUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findUser(params: FindUserParams): Promise<User> {
    return await this.userRepository.findOne({
      where: [
        { id: params.id },
        { email: params.email },
        { username: params.username },
      ],
    });
  }

  async saveRefreshToken(token: string, userId: string): Promise<any> {
    return await this.userRepository.update(userId, { refreshToken: token });
  }

  async createUser(params: CreateUserParams): Promise<User> {
    return await this.userRepository.save(params);
  }

  async deleteRefreshToken(userId: string): Promise<any> {
    return await this.userRepository.update(userId, { refreshToken: null });
  }

  async uploadAvatar(userId: string, file: Express.Multer.File): Promise<User> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const [fileResponse] = await this.fileService.uploadFiles([file], {
      type: FileType.AVATAR,
    });

    user.avatar = fileResponse.url;
    return await this.userRepository.save(user);
  }
}
