import { Like } from '@/entities/like.entity';
import { Post } from '@/entities/post.entity';
import { User } from '@/entities/user.entity';
import { AuthUser } from '@/shared/decorators/auth-user.decorator';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like) private readonly likeRepository: Repository<Like>,
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async toggleLike(@AuthUser() user: User, postId: string): Promise<string> {
    const foundUser = await this.userRepository.findOneBy({ id: user.id });
    const post = await this.postRepository.findOneBy({ id: postId });

    if (!foundUser || !post) {
      throw new NotFoundException('User or post not found');
    }

    const existingLike = await this.likeRepository.findOne({
      where: {
        user: { id: user.id },
        post: { id: postId },
      },
    });

    if (existingLike) {
      await this.likeRepository.remove(existingLike);
      return 'Post unlike successfully';
    } else {
      const like = this.likeRepository.create({ user, post });
      await this.likeRepository.save(like);
      return 'Post liked successfully';
    }
  }
}
