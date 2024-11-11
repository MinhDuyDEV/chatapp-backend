import { Like } from '@/entities/like.entity';
import { Post } from '@/entities/post.entity';
import { User } from '@/entities/user.entity';
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

  async toggleLike(userId: string, postId: string): Promise<string> {
    const user = await this.userRepository.findOneBy({ id: userId });
    const post = await this.postRepository.findOneBy({ id: postId });

    if (!user || !post) {
      throw new NotFoundException('User or post not found');
    }

    const existingLike = await this.likeRepository.findOne({
      where: {
        user: { id: user.id },
        post: { id: post.id },
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

  async getLikesByPost(postId: string, page: number, limit: number) {
    const post = await this.postRepository.findOneBy({ id: postId });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const [likes, total] = await this.likeRepository.findAndCount({
      where: { post: { id: postId } },
      relations: ['user'],
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: likes.map((like) => ({
        userId: like.user.id,
        username: like.user.username,
        avatar: like.user.avatar,
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
