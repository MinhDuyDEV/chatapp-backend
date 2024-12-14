import { Like } from '@/entities/like.entity';
import { Post } from '@/entities/post.entity';
import { User } from '@/entities/user.entity';
import { DtoHelper } from '@/shared/utils/dto-helper';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FriendService } from '../friend/friend.service';
import { Services } from '@/shared/constants/services.enum';
import { UsersLikedPostDto } from './dto/users-liked-post.dto';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like) private readonly likeRepository: Repository<Like>,
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @Inject(Services.FRIENDS_SERVICE)
    private readonly friendService: FriendService,
  ) {}

  async toggleLike(userId: string, postId: string): Promise<void> {
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
    } else {
      const like = this.likeRepository.create({ user, post });
      await this.likeRepository.save(like);
    }
  }

  async getLikesByPost(
    meId: string,
    postId: string,
    page: number,
    limit: number,
  ) {
    const post = await this.postRepository.findOneBy({ id: postId });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const [likes, total] = await this.likeRepository
      .createQueryBuilder('like')
      .innerJoinAndSelect('like.user', 'user')
      .innerJoinAndSelect('user.profile', 'profile')
      .where('like.postId = :postId', { postId })
      .orderBy('like.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const users = await Promise.all(
      likes.map(async (like) => {
        const relationship = await this.friendService.getRelationship(
          meId,
          like.user.id,
        );

        return {
          user: {
            id: like.user.id,
            username: like.user.username,
            avatar: like.user.avatar,
            profile: {
              firstName: like.user.profile.firstName,
              lastName: like.user.profile.lastName,
            },
          },
          relationship,
        };
      }),
    );

    return {
      data: DtoHelper.mapToDtoArray(UsersLikedPostDto, users),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }
}
