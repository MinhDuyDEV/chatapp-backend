import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '@/entities/post.entity';
import { Follow } from '@/entities/follow.entity';
import { TimelinePostDto } from './dto/timeline-post.dto';
import { DtoHelper } from '@/shared/utils/dto-helper';

@Injectable()
export class TimelineService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>,
    @InjectRepository(Follow)
    private readonly followRepo: Repository<Follow>,
  ) {}

  async getTimelineFollowing(
    userId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    data: TimelinePostDto[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    // Get IDs of users that the current user follows
    const followedUsers = await this.followRepo
      .createQueryBuilder('follow')
      .leftJoinAndSelect('follow.following', 'following')
      .where('follow.followerId = :userId', { userId })
      .getMany();

    const followingIds = followedUsers.map((follow) => follow.following.id);
    const relevantUserIds = [...new Set([...followingIds, userId])];

    // Get posts with pagination
    const [posts, total] = await this.postRepo
      .createQueryBuilder('post')
      .select([
        'post.id',
        'post.content',
        'post.visibility',
        'post.createdAt',
        'post.updatedAt',
        'author.id',
        'author.username',
        'author.avatar',
        'profile.firstName',
        'profile.lastName',
        'attachments.id',
        'attachments.url',
        'attachments.mimetype',
      ])
      .loadRelationCountAndMap('post.likesCount', 'post.likes')
      .loadRelationCountAndMap('post.commentsCount', 'post.comments')
      .leftJoin('post.author', 'author')
      .leftJoin('author.profile', 'profile')
      .leftJoin('post.attachments', 'attachments')
      .leftJoinAndSelect('post.likes', 'like')
      .leftJoinAndSelect('like.user', 'user')
      .where('post.authorId IN (:...userIds)', { userIds: relevantUserIds })
      .andWhere('post.visibility != :onlyMe', { onlyMe: 'onlyMe' })
      .orderBy('post.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const postsWithLikeInfo = posts.map((post) => ({
      ...post,
      isLikedByMe: post.likes.some((like) => like.user.id === userId),
    }));

    return {
      data: DtoHelper.mapToDtoArray(TimelinePostDto, postsWithLikeInfo),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getTimelineExplore(
    userId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    data: TimelinePostDto[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const [posts, total] = await this.postRepo
      .createQueryBuilder('post')
      .select([
        'post.id',
        'post.content',
        'post.visibility',
        'post.createdAt',
        'post.updatedAt',
        'author.id',
        'author.username',
        'author.avatar',
        'profile.firstName',
        'profile.lastName',
        'attachments.id',
        'attachments.url',
        'attachments.mimetype',
      ])
      .loadRelationCountAndMap('post.likesCount', 'post.likes')
      .loadRelationCountAndMap('post.commentsCount', 'post.comments')
      .leftJoin('post.author', 'author')
      .leftJoin('author.profile', 'profile')
      .leftJoin('post.attachments', 'attachments')
      .leftJoinAndSelect('post.likes', 'like')
      .leftJoinAndSelect('like.user', 'user')
      .orderBy('post.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const postsWithLikeInfo = posts.map((post) => ({
      ...post,
      isLikedByMe: post.likes.some((like) => like.user.id === userId),
    }));

    return {
      data: DtoHelper.mapToDtoArray(TimelinePostDto, postsWithLikeInfo),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }
}
